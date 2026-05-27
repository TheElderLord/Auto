import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository, OrderFull } from './order.repository';
import type { OrderDto, OrderItemDto } from './dto/order.response';

@Injectable()
export class OrderService {
  constructor(private readonly repo: OrderRepository) {}

  async getById(id: string): Promise<OrderDto> {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return this.toDto(order);
  }

  private toDto(order: OrderFull): OrderDto {
    const items: OrderItemDto[] = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      article: item.product.article,
      name: item.product.name,
      brand: item.product.brand.name,
      stockItemId: item.stockItemId,
      storageName: item.stockItem.storage.name,
      qty: item.qty,
      unitPrice: Number(item.unitPrice),
      currency: item.currency,
      lineTotal: Number(item.unitPrice) * item.qty,
      status: item.status,
    }));
    return {
      id: order.id,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      items,
      total: Number(order.total),
      currency: order.currency,
      createdAt: order.createdAt.toISOString(),
    };
  }
}
