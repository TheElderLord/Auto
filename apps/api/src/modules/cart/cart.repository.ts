import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/db/prisma.service';
import type {
  Brand,
  Cart,
  CartItem,
  Office,
  Product,
  StockItem,
  StockReservation,
  Storage,
} from '@kazparts/db';

export type CartItemFull = CartItem & {
  product: Product & { brand: Brand };
  stockItem: StockItem & { storage: Storage & { office: Office } };
  reservation: StockReservation | null;
};

export type CartFull = Cart & {
  items: CartItemFull[];
};

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CartFull | null> {
    return this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { include: { brand: true } },
            stockItem: { include: { storage: { include: { office: true } } } },
            reservation: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }) as Promise<CartFull | null>;
  }
}
