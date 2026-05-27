import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/db/prisma.service';
import type { Brand, Order, OrderItem, Product, StockItem, Storage } from '@kazparts/db';

export type OrderItemFull = OrderItem & {
  product: Product & { brand: Brand };
  stockItem: StockItem & { storage: Storage };
};

export type OrderFull = Order & {
  items: OrderItemFull[];
};

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<OrderFull | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { include: { brand: true } },
            stockItem: { include: { storage: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }) as Promise<OrderFull | null>;
  }
}
