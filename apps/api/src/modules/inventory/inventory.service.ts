import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { PricingService } from '../pricing/pricing.service';
import type { AvailabilityDto } from './dto/availability.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly repo: InventoryRepository,
    private readonly pricing: PricingService,
  ) {}

  async getAvailabilityMap(productIds: string[]): Promise<Map<string, AvailabilityDto>> {
    const rows = await this.repo.findByProductIds(productIds);
    const map = new Map<string, AvailabilityDto>();

    for (const row of rows) {
      const salePrice = this.pricing.calculateSalePrice(
        Number(row.purchasePrice),
        Number(row.storage.markupPct),
      );

      if (!map.has(row.productId)) {
        map.set(row.productId, { inStock: false, lowestPrice: null, currency: row.currency, entries: [] });
      }

      const avail = map.get(row.productId)!;
      avail.entries.push({
        stockItemId: row.id,
        storageId: row.storageId,
        storageName: row.storage.name,
        officeId: row.storage.officeId,
        officeName: row.storage.office.name,
        qty: row.qty,
        price: salePrice,
        currency: row.currency,
        deliveryDays: row.storage.deliveryDays,
      });

      if (row.qty > 0) {
        avail.inStock = true;
        if (avail.lowestPrice === null || salePrice < avail.lowestPrice) {
          avail.lowestPrice = salePrice;
        }
      }
    }

    return map;
  }
}
