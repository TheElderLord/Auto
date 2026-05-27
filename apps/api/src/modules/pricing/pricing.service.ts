import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  /**
   * Applies a percentage markup to a purchase price.
   * Result is rounded to 2 decimal places.
   */
  calculateSalePrice(purchasePrice: number, markupPct: number): number {
    return Math.round(purchasePrice * (1 + markupPct / 100) * 100) / 100;
  }

  /**
   * Returns the lowest sale price across entries that have qty > 0.
   * Returns null if nothing is in stock.
   */
  lowestInStockPrice(entries: { price: number; qty: number }[]): number | null {
    const inStock = entries.filter((e) => e.qty > 0);
    if (inStock.length === 0) return null;
    return Math.min(...inStock.map((e) => e.price));
  }
}
