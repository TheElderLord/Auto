export interface BrandDto {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImageDto {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductSummaryDto {
  id: string;
  article: string;
  name: string;
  brand: BrandDto;
  primaryImage: ProductImageDto | null;
}

export interface ProductDetailDto extends ProductSummaryDto {
  description: string | null;
  images: ProductImageDto[];
  categories: CategoryDto[];
}

export interface SearchResultsDto {
  query: string;
  total: number;
  results: ProductSummaryDto[];
}
