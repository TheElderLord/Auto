import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/db/prisma.service';
import type { StockItem, Storage, Office } from '@kazparts/db';

export type StockItemRow = StockItem & {
  storage: Storage & { office: Office };
};

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProductIds(productIds: string[]): Promise<StockItemRow[]> {
    if (productIds.length === 0) return [];
    return this.prisma.stockItem.findMany({
      where: {
        productId: { in: productIds },
        storage: { isActive: true },
      },
      include: { storage: { include: { office: true } } },
      orderBy: { storage: { deliveryDays: 'asc' } },
    }) as Promise<StockItemRow[]>;
  }
}
