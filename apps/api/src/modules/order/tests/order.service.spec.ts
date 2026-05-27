import { NotFoundException } from '@nestjs/common';
import { OrderService } from '../order.service';

const mockRepo = {
  findById: jest.fn(),
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderService(mockRepo as any);
  });

  it('throws NotFoundException when order does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getById('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns order DTO with items', async () => {
    mockRepo.findById.mockResolvedValue({
      id: 'order1',
      status: 'PENDING',
      customerName: 'Arsen',
      customerPhone: '+77001234567',
      customerEmail: null,
      total: '24000',
      currency: 'KZT',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      items: [
        {
          id: 'oi1',
          productId: 'prod1',
          product: { article: 'X1', name: 'Part', brand: { name: 'Toyota' } },
          stockItemId: 'stock1',
          stockItem: { storage: { name: 'WH-A' } },
          qty: 2,
          unitPrice: '12000',
          currency: 'KZT',
          status: 'PENDING',
        },
      ],
    });

    const result = await service.getById('order1');

    expect(result.id).toBe('order1');
    expect(result.total).toBe(24000);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].lineTotal).toBe(24000);
    expect(result.items[0].brand).toBe('Toyota');
    expect(result.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });
});
