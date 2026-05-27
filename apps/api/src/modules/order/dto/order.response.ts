export interface OrderItemDto {
  id: string;
  productId: string;
  article: string;
  name: string;
  brand: string;
  stockItemId: string;
  storageName: string;
  qty: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
  status: string;
}

export interface OrderDto {
  id: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: OrderItemDto[];
  total: number;
  currency: string;
  createdAt: string;
}
