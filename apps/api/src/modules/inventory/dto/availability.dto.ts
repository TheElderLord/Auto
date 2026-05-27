export interface StockEntryDto {
  stockItemId: string;
  storageId: string;
  storageName: string;
  officeId: string;
  officeName: string;
  qty: number;
  price: number;
  currency: string;
  deliveryDays: number;
}

export interface AvailabilityDto {
  inStock: boolean;
  lowestPrice: number | null;
  currency: string;
  entries: StockEntryDto[];
}
