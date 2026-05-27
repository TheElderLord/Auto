import { InventoryService } from '../inventory.service';
import { PricingService } from '../../pricing/pricing.service';

const mockRepo = { findByProductIds: jest.fn() };
const pricing = new PricingService();

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InventoryService(mockRepo as any, pricing);
  });

  it('returns empty map when no product ids given', async () => {
    mockRepo.findByProductIds.mockResolvedValue([]);
    const result = await service.getAvailabilityMap([]);
    expect(result.size).toBe(0);
  });

  it('marks product as in-stock when qty > 0', async () => {
    mockRepo.findByProductIds.mockResolvedValue([
      {
        id: 'si1',
        productId: 'p1',
        storageId: 's1',
        qty: 10,
        purchasePrice: '1000',
        currency: 'KZT',
        storage: { name: 'Central', officeId: 'o1', office: { name: 'Almaty' }, markupPct: '20', deliveryDays: 1 },
      },
    ]);
    const map = await service.getAvailabilityMap(['p1']);
    const avail = map.get('p1')!;
    expect(avail.inStock).toBe(true);
    expect(avail.lowestPrice).toBe(1200);
    expect(avail.entries[0].deliveryDays).toBe(1);
  });

  it('marks product as out-of-stock when qty is 0', async () => {
    mockRepo.findByProductIds.mockResolvedValue([
      {
        id: 'si2',
        productId: 'p2',
        storageId: 's1',
        qty: 0,
        purchasePrice: '2000',
        currency: 'KZT',
        storage: { name: 'Central', officeId: 'o1', office: { name: 'Almaty' }, markupPct: '20', deliveryDays: 1 },
      },
    ]);
    const map = await service.getAvailabilityMap(['p2']);
    const avail = map.get('p2')!;
    expect(avail.inStock).toBe(false);
    expect(avail.lowestPrice).toBeNull();
  });

  it('picks the lowest in-stock price across multiple storages', async () => {
    mockRepo.findByProductIds.mockResolvedValue([
      {
        id: 'si3',
        productId: 'p1', storageId: 's1', qty: 5, purchasePrice: '8500', currency: 'KZT',
        storage: { name: 'Almaty Central', officeId: 'o1', office: { name: 'Almaty' }, markupPct: '20', deliveryDays: 1 },
      },
      {
        id: 'si4',
        productId: 'p1', storageId: 's2', qty: 8, purchasePrice: '8200', currency: 'KZT',
        storage: { name: 'Supplier B', officeId: 'o1', office: { name: 'Almaty' }, markupPct: '25', deliveryDays: 2 },
      },
    ]);
    const map = await service.getAvailabilityMap(['p1']);
    const avail = map.get('p1')!;
    // Central: 8500 * 1.20 = 10200, Supplier B: 8200 * 1.25 = 10250 → lowest = 10200
    expect(avail.lowestPrice).toBe(10200);
    expect(avail.entries).toHaveLength(2);
  });
});
