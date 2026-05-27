import { NotFoundException } from '@nestjs/common';
import { CatalogService } from '../catalog.service';

const mockRepo = {
  searchByArticle: jest.fn(),
  findById: jest.fn(),
  listAll: jest.fn(),
};

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CatalogService(mockRepo as any);
  });

  describe('search', () => {
    it('returns empty results when nothing found', async () => {
      mockRepo.searchByArticle.mockResolvedValue([]);
      const result = await service.search('UNKNOWN123');
      expect(result).toEqual({ query: 'UNKNOWN123', total: 0, results: [] });
    });

    it('maps product rows to summary DTOs', async () => {
      mockRepo.searchByArticle.mockResolvedValue([
        {
          id: 'p1',
          article: '04465-33450',
          name: 'Brake Pad Set',
          brand: { id: 'b1', name: 'Toyota', slug: 'toyota' },
          images: [{ id: 'i1', url: '/img.jpg', isPrimary: true, sortOrder: 0 }],
          categories: [],
        },
      ]);
      const result = await service.search('04465-33450');
      expect(result.total).toBe(1);
      expect(result.results[0].article).toBe('04465-33450');
      expect(result.results[0].brand.slug).toBe('toyota');
      expect(result.results[0].primaryImage?.url).toBe('/img.jpg');
    });

    it('passes brandSlug to repository', async () => {
      mockRepo.searchByArticle.mockResolvedValue([]);
      await service.search('D1212', 'ngk');
      expect(mockRepo.searchByArticle).toHaveBeenCalledWith('D1212', 'ngk');
    });
  });

  describe('getById', () => {
    it('throws NotFoundException when product does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getById('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns full product detail', async () => {
      mockRepo.findById.mockResolvedValue({
        id: 'p1',
        article: 'D1212',
        name: 'Iridium Plug',
        description: 'Long-life plug',
        brand: { id: 'b1', name: 'NGK', slug: 'ngk' },
        images: [],
        categories: [
          { category: { id: 'c1', name: 'Spark Plugs', slug: 'spark-plugs' } },
        ],
      });
      const result = await service.getById('p1');
      expect(result.id).toBe('p1');
      expect(result.description).toBe('Long-life plug');
      expect(result.categories[0].slug).toBe('spark-plugs');
    });
  });
});
