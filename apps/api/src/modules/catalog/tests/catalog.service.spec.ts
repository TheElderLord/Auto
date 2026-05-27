import { NotFoundException } from '@nestjs/common';
import { CatalogService } from '../catalog.service';

const noAvailability = { inStock: false, lowestPrice: null, currency: 'KZT', entries: [] };

const mockRepo = {
  searchByArticle: jest.fn(),
  findById: jest.fn(),
  listAll: jest.fn(),
};

const mockInventory = {
  getAvailabilityMap: jest.fn().mockResolvedValue(new Map()),
};

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInventory.getAvailabilityMap.mockResolvedValue(new Map());
    service = new CatalogService(mockRepo as any, mockInventory as any);
  });

  describe('search', () => {
    it('returns empty results when nothing found', async () => {
      mockRepo.searchByArticle.mockResolvedValue([]);
      const result = await service.search('UNKNOWN123');
      expect(result).toEqual({ query: 'UNKNOWN123', total: 0, results: [] });
    });

    it('maps product rows to summary DTOs with availability', async () => {
      mockRepo.searchByArticle.mockResolvedValue([
        { id: 'p1', article: '04465-33450', name: 'Brake Pad Set', brand: { id: 'b1', name: 'Toyota', slug: 'toyota' }, images: [], categories: [] },
      ]);
      mockInventory.getAvailabilityMap.mockResolvedValue(
        new Map([['p1', { inStock: true, lowestPrice: 10200, currency: 'KZT', entries: [] }]]),
      );
      const result = await service.search('04465-33450');
      expect(result.total).toBe(1);
      expect(result.results[0].availability.inStock).toBe(true);
      expect(result.results[0].availability.lowestPrice).toBe(10200);
    });

    it('uses empty availability when inventory has no entry for product', async () => {
      mockRepo.searchByArticle.mockResolvedValue([
        { id: 'p1', article: 'X1', name: 'Part', brand: { id: 'b1', name: 'Brand', slug: 'brand' }, images: [], categories: [] },
      ]);
      const result = await service.search('X1');
      expect(result.results[0].availability).toEqual(noAvailability);
    });
  });

  describe('getById', () => {
    it('throws NotFoundException when product does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getById('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns full product detail with availability', async () => {
      mockRepo.findById.mockResolvedValue({
        id: 'p1', article: 'D1212', name: 'Iridium Plug', description: 'Long-life plug',
        brand: { id: 'b1', name: 'NGK', slug: 'ngk' }, images: [],
        categories: [{ category: { id: 'c1', name: 'Spark Plugs', slug: 'spark-plugs' } }],
      });
      mockInventory.getAvailabilityMap.mockResolvedValue(
        new Map([['p1', { inStock: true, lowestPrice: 1440, currency: 'KZT', entries: [] }]]),
      );
      const result = await service.getById('p1');
      expect(result.description).toBe('Long-life plug');
      expect(result.availability.lowestPrice).toBe(1440);
      expect(result.categories[0].slug).toBe('spark-plugs');
    });
  });
});
