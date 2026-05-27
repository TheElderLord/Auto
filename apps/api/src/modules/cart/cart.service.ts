import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/db/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { CartRepository, CartFull } from './cart.repository';
import type { AddToCartDto } from './dto/add-to-cart.dto';
import type { CheckoutDto } from './dto/checkout.dto';
import type { CartDto, CartItemDto, CheckoutResultDto } from './dto/cart.response';

const RESERVATION_TTL_MS = 30 * 60 * 1000;
const CART_TTL_MS = 2 * 60 * 60 * 1000;

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: CartRepository,
    private readonly pricing: PricingService,
  ) {}

  async create(): Promise<CartDto> {
    const cart = await this.prisma.cart.create({
      data: { expiresAt: new Date(Date.now() + CART_TTL_MS) },
    });
    return { id: cart.id, status: cart.status, items: [], total: 0, currency: 'KZT' };
  }

  async getById(id: string): Promise<CartDto> {
    const cart = await this.repo.findById(id);
    if (!cart) throw new NotFoundException(`Cart ${id} not found`);
    return this.toDto(cart);
  }

  async addItem(cartId: string, dto: AddToCartDto): Promise<CartDto> {
    await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { id: cartId } });
      if (!cart) throw new NotFoundException(`Cart ${cartId} not found`);
      if (cart.status !== 'ACTIVE') throw new ConflictException('Cart is no longer active');

      const stockItemWithStorage = await tx.stockItem.findUnique({
        where: { id: dto.stockItemId },
        include: { storage: true },
      });
      if (!stockItemWithStorage) throw new NotFoundException(`Stock item ${dto.stockItemId} not found`);

      // Atomic decrement — safe against concurrent requests because the WHERE
      // condition is evaluated against the locked row value in PostgreSQL.
      const updated = await tx.stockItem.updateMany({
        where: { id: dto.stockItemId, qty: { gte: dto.qty } },
        data: { qty: { decrement: dto.qty } },
      });
      if (updated.count === 0) throw new BadRequestException('Insufficient stock');

      const unitPrice = this.pricing.calculateSalePrice(
        Number(stockItemWithStorage.purchasePrice),
        Number(stockItemWithStorage.storage.markupPct),
      );

      const cartItem = await tx.cartItem.create({
        data: {
          cartId,
          productId: stockItemWithStorage.productId,
          stockItemId: dto.stockItemId,
          qty: dto.qty,
          unitPrice,
          currency: stockItemWithStorage.currency,
        },
      });

      await tx.stockReservation.create({
        data: {
          stockItemId: dto.stockItemId,
          cartItemId: cartItem.id,
          qty: dto.qty,
          expiresAt: new Date(Date.now() + RESERVATION_TTL_MS),
        },
      });
    });

    const cart = await this.repo.findById(cartId);
    return this.toDto(cart!);
  }

  async removeItem(cartId: string, itemId: string): Promise<CartDto> {
    await this.prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findFirst({
        where: { id: itemId, cartId },
        include: { reservation: true },
      });
      if (!cartItem) throw new NotFoundException(`Cart item ${itemId} not found`);

      if (cartItem.reservation && cartItem.reservation.status === 'HELD') {
        await tx.stockItem.update({
          where: { id: cartItem.stockItemId },
          data: { qty: { increment: cartItem.reservation.qty } },
        });
        await tx.stockReservation.update({
          where: { id: cartItem.reservation.id },
          data: { status: 'RELEASED' },
        });
      }

      await tx.cartItem.delete({ where: { id: itemId } });
    });

    const cart = await this.repo.findById(cartId);
    return this.toDto(cart!);
  }

  async checkout(cartId: string, dto: CheckoutDto): Promise<CheckoutResultDto> {
    const order = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: { items: { include: { reservation: true } } },
      });
      if (!cart) throw new NotFoundException(`Cart ${cartId} not found`);
      if (cart.status !== 'ACTIVE')
        throw new ConflictException('Cart is already checked out or abandoned');
      if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

      const now = new Date();
      for (const item of cart.items) {
        if (!item.reservation || item.reservation.status !== 'HELD') {
          throw new ConflictException(`Reservation for item ${item.id} is no longer held`);
        }
        if (item.reservation.expiresAt < now) {
          throw new ConflictException(`Reservation for item ${item.id} has expired`);
        }
      }

      const total = cart.items.reduce(
        (sum, item) => sum + Number(item.unitPrice) * item.qty,
        0,
      );
      const currency = cart.items[0]!.currency;

      const created = await tx.order.create({
        data: {
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          total,
          currency,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              stockItemId: item.stockItemId,
              qty: item.qty,
              unitPrice: item.unitPrice,
              currency: item.currency,
            })),
          },
        },
      });

      await tx.stockReservation.updateMany({
        where: {
          cartItemId: { in: cart.items.map((i) => i.id) },
          status: 'HELD',
        },
        data: { status: 'CONVERTED' },
      });

      await tx.cart.update({
        where: { id: cartId },
        data: { status: 'CHECKED_OUT' },
      });

      return created;
    });

    return {
      orderId: order.id,
      status: order.status,
      total: Number(order.total),
      currency: order.currency,
      createdAt: order.createdAt.toISOString(),
    };
  }

  private toDto(cart: CartFull): CartDto {
    const items: CartItemDto[] = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      article: item.product.article,
      name: item.product.name,
      brand: item.product.brand.name,
      stockItemId: item.stockItemId,
      storageName: item.stockItem.storage.name,
      officeName: item.stockItem.storage.office.name,
      qty: item.qty,
      unitPrice: Number(item.unitPrice),
      currency: item.currency,
      lineTotal: Number(item.unitPrice) * item.qty,
    }));
    const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
    return {
      id: cart.id,
      status: cart.status,
      items,
      total,
      currency: items[0]?.currency ?? 'KZT',
    };
  }
}
