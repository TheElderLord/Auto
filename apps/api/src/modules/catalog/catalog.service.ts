import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import { InventoryService } from '../inventory/inventory.service';
import type { Brand, Product, ProductImage, ProductCategory, Category } from '@kazparts/db';
import type {
  AvailabilityDto,
  ProductDetailDto,
  ProductImageDto,
  ProductSummaryDto,
  SearchResultsDto,
} from './dto/product.response';

type ProductRow = Product & {
  brand: Brand;
  images: ProductImage[];
  categories: (ProductCategory & { category: Category })[];
};

const EMPTY_AVAILABILITY: AvailabilityDto = {
  inStock: false,
  lowestPrice: null,
  currency: 'KZT',
  entries: [],
};

@Injectable()
export class CatalogService {
  constructor(
    private readonly repo: CatalogRepository,
    private readonly inventory: InventoryService,
  ) {}

  async search(q: string, brandSlug?: string): Promise<SearchResultsDto> {
    const products = await this.repo.searchByArticle(q, brandSlug);
    const availMap = await this.inventory.getAvailabilityMap(products.map((p) => p.id));
    return {
      query: q,
      total: products.length,
      results: products.map((p) => this.toSummary(p, availMap.get(p.id) ?? EMPTY_AVAILABILITY)),
    };
  }

  async getById(id: string): Promise<ProductDetailDto> {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    const availMap = await this.inventory.getAvailabilityMap([id]);
    return {
      ...this.toSummary(product, availMap.get(id) ?? EMPTY_AVAILABILITY),
      description: product.description,
      images: product.images.map((img) => this.toImageDto(img)),
      categories: product.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
    };
  }

  async listAll(take: number, skip: number) {
    const { items, total } = await this.repo.listAll(take, skip);
    const availMap = await this.inventory.getAvailabilityMap(items.map((p) => p.id));
    return {
      total,
      take,
      skip,
      items: items.map((p) => this.toSummary(p, availMap.get(p.id) ?? EMPTY_AVAILABILITY)),
    };
  }

  private toSummary(p: ProductRow, availability: AvailabilityDto): ProductSummaryDto {
    const primary = p.images.find((i) => i.isPrimary) ?? p.images[0] ?? null;
    return {
      id: p.id,
      article: p.article,
      name: p.name,
      brand: { id: p.brand.id, name: p.brand.name, slug: p.brand.slug },
      primaryImage: primary ? this.toImageDto(primary) : null,
      availability,
    };
  }

  private toImageDto(img: ProductImage): ProductImageDto {
    return { id: img.id, url: img.url, isPrimary: img.isPrimary, sortOrder: img.sortOrder };
  }
}
