import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CartService } from '../cart.service';

const mockPrisma = {
  $transaction: jest.fn(),
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  cartItem: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
  stockItem: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
    update: jest.fn(),
  },
  stockReservation: {
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  order: {
    create: jest.fn(),
  },
};

const mockRepo = {
  findById: jest.fn(),
};

const mockPricing = {
  calculateSalePrice: jest.fn().mockReturnValue(12000),
};

// Makes $transaction call the callback with mockPrisma as the tx client
function setupTransaction() {
  mockPrisma.$transaction.mockImplementation((cb: (tx: typeof mockPrisma) => Promise<unknown>) =>
    cb(mockPrisma),
  );
}

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    jest.clearAllMocks();
    setupTransaction();
    service = new CartService(mockPrisma as any, mockRepo as any, mockPricing as any);
  });

  describe('create', () => {
    it('creates a new cart and returns empty CartDto', async () => {
      mockPrisma.cart.create.mockResolvedValue({
        id: 'cart1',
        status: 'ACTIVE',
        expiresAt: new Date(),
      });
      const result = await service.create();
      expect(result.id).toBe('cart1');
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('addItem', () => {
    const dto = { stockItemId: 'stock1', qty: 2 };

    it('decrements stock and creates reservation on success', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart1', status: 'ACTIVE' });
      mockPrisma.stockItem.findUnique.mockResolvedValue({
        id: 'stock1',
        productId: 'prod1',
        purchasePrice: '10000',
        currency: 'KZT',
        storage: { markupPct: '20' },
      });
      mockPrisma.stockItem.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.cartItem.create.mockResolvedValue({ id: 'item1' });
      mockPrisma.stockReservation.create.mockResolvedValue({});
      mockRepo.findById.mockResolvedValue({
        id: 'cart1',
        status: 'ACTIVE',
        items: [
          {
            id: 'item1',
            productId: 'prod1',
            product: { article: 'X1', name: 'Part', brand: { name: 'Brand' } },
            stockItemId: 'stock1',
            stockItem: { storage: { name: 'WH-A', office: { name: 'Almaty' } } },
            qty: 2,
            unitPrice: '12000',
            currency: 'KZT',
            reservation: null,
          },
        ],
      });

      const result = await service.addItem('cart1', dto);

      expect(mockPrisma.stockItem.updateMany).toHaveBeenCalledWith({
        where: { id: 'stock1', qty: { gte: 2 } },
        data: { qty: { decrement: 2 } },
      });
      expect(mockPrisma.stockReservation.create).toHaveBeenCalledTimes(1);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(24000);
    });

    it('throws BadRequestException when stock is insufficient', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart1', status: 'ACTIVE' });
      mockPrisma.stockItem.findUnique.mockResolvedValue({
        id: 'stock1',
        productId: 'prod1',
        purchasePrice: '10000',
        currency: 'KZT',
        storage: { markupPct: '20' },
      });
      // updateMany returns count=0 → not enough stock
      mockPrisma.stockItem.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.addItem('cart1', dto)).rejects.toBeInstanceOf(BadRequestException);
      expect(mockPrisma.cartItem.create).not.toHaveBeenCalled();
      expect(mockPrisma.stockReservation.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when cart does not exist', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(null);
      await expect(service.addItem('missing', dto)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ConflictException when cart is not ACTIVE', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart1', status: 'CHECKED_OUT' });
      await expect(service.addItem('cart1', dto)).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('removeItem', () => {
    it('increments stock and releases reservation when reservation is HELD', async () => {
      mockPrisma.cartItem.findFirst.mockResolvedValue({
        id: 'item1',
        cartId: 'cart1',
        stockItemId: 'stock1',
        reservation: { id: 'res1', qty: 2, status: 'HELD' },
      });
      mockPrisma.stockItem.update.mockResolvedValue({});
      mockPrisma.stockReservation.update.mockResolvedValue({});
      mockPrisma.cartItem.delete.mockResolvedValue({});
      mockRepo.findById.mockResolvedValue({
        id: 'cart1',
        status: 'ACTIVE',
        items: [],
      });

      const result = await service.removeItem('cart1', 'item1');

      expect(mockPrisma.stockItem.update).toHaveBeenCalledWith({
        where: { id: 'stock1' },
        data: { qty: { increment: 2 } },
      });
      expect(mockPrisma.stockReservation.update).toHaveBeenCalledWith({
        where: { id: 'res1' },
        data: { status: 'RELEASED' },
      });
      expect(result.items).toHaveLength(0);
    });

    it('throws NotFoundException when cart item is not found', async () => {
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);
      await expect(service.removeItem('cart1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('checkout', () => {
    const dto = { customerName: 'Arsen', customerPhone: '+77001234567' };
    const future = new Date(Date.now() + 60_000);

    const cartWithItems = {
      id: 'cart1',
      status: 'ACTIVE',
      items: [
        {
          id: 'item1',
          productId: 'prod1',
          stockItemId: 'stock1',
          qty: 2,
          unitPrice: '12000',
          currency: 'KZT',
          reservation: { id: 'res1', status: 'HELD', expiresAt: future },
        },
      ],
    };

    it('creates order and marks cart CHECKED_OUT', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(cartWithItems);
      mockPrisma.order.create.mockResolvedValue({
        id: 'order1',
        status: 'PENDING',
        total: '24000',
        currency: 'KZT',
        createdAt: new Date('2026-01-01'),
      });
      mockPrisma.stockReservation.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.cart.update.mockResolvedValue({});

      const result = await service.checkout('cart1', dto);

      expect(mockPrisma.order.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.cart.update).toHaveBeenCalledWith({
        where: { id: 'cart1' },
        data: { status: 'CHECKED_OUT' },
      });
      expect(mockPrisma.stockReservation.updateMany).toHaveBeenCalledWith({
        where: { cartItemId: { in: ['item1'] }, status: 'HELD' },
        data: { status: 'CONVERTED' },
      });
      expect(result.orderId).toBe('order1');
      expect(result.total).toBe(24000);
    });

    it('throws ConflictException when cart is already checked out', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ ...cartWithItems, status: 'CHECKED_OUT' });
      await expect(service.checkout('cart1', dto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws BadRequestException when cart is empty', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ ...cartWithItems, items: [] });
      await expect(service.checkout('cart1', dto)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws ConflictException when a reservation has expired', async () => {
      const expired = new Date(Date.now() - 1000);
      mockPrisma.cart.findUnique.mockResolvedValue({
        ...cartWithItems,
        items: [
          {
            ...cartWithItems.items[0],
            reservation: { id: 'res1', status: 'HELD', expiresAt: expired },
          },
        ],
      });
      await expect(service.checkout('cart1', dto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws ConflictException when a reservation is no longer held', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({
        ...cartWithItems,
        items: [
          {
            ...cartWithItems.items[0],
            reservation: { id: 'res1', status: 'RELEASED', expiresAt: future },
          },
        ],
      });
      await expect(service.checkout('cart1', dto)).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
