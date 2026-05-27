export interface CartItemDto {
  id: string;
  productId: string;
  article: string;
  name: string;
  brand: string;
  stockItemId: string;
  storageName: string;
  officeName: string;
  qty: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
}

export interface CartDto {
  id: string;
  status: string;
  items: CartItemDto[];
  total: number;
  currency: string;
}

export interface CheckoutResultDto {
  orderId: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
}
