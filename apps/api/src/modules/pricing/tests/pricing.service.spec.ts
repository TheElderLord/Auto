import { PricingService } from '../pricing.service';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(() => {
    service = new PricingService();
  });

  describe('calculateSalePrice', () => {
    it('applies markup correctly', () => {
      expect(service.calculateSalePrice(1000, 20)).toBe(1200);
    });

    it('rounds to 2 decimal places', () => {
      expect(service.calculateSalePrice(1000, 33)).toBe(1330);
      expect(service.calculateSalePrice(100, 10.5)).toBe(110.5);
    });

    it('handles 0% markup', () => {
      expect(service.calculateSalePrice(5000, 0)).toBe(5000);
    });

    it('handles 100% markup', () => {
      expect(service.calculateSalePrice(2000, 100)).toBe(4000);
    });

    it('handles fractional purchase prices', () => {
      expect(service.calculateSalePrice(1150, 25)).toBe(1437.5);
    });
  });

  describe('lowestInStockPrice', () => {
    it('returns null when no entries are in stock', () => {
      expect(service.lowestInStockPrice([{ price: 1200, qty: 0 }])).toBeNull();
    });

    it('returns null for empty list', () => {
      expect(service.lowestInStockPrice([])).toBeNull();
    });

    it('returns the lowest price among in-stock entries', () => {
      expect(
        service.lowestInStockPrice([
          { price: 1440, qty: 5 },
          { price: 1380, qty: 12 },
          { price: 1500, qty: 0 },
        ]),
      ).toBe(1380);
    });

    it('ignores out-of-stock entries when finding the minimum', () => {
      expect(
        service.lowestInStockPrice([
          { price: 900, qty: 0 },
          { price: 1200, qty: 3 },
        ]),
      ).toBe(1200);
    });
  });
});
