import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import type { Brand, Product, ProductImage, ProductCategory, Category } from '@kazparts/db';
import type {
  SearchResultsDto,
  ProductSummaryDto,
  ProductDetailDto,
  ProductImageDto,
} from './dto/product.response';

type ProductRow = Product & {
  brand: Brand;
  images: ProductImage[];
  categories: (ProductCategory & { category: Category })[];
};

@Injectable()
export class CatalogService {
  constructor(private readonly repo: CatalogRepository) {}

  async search(q: string, brandSlug?: string): Promise<SearchResultsDto> {
    const products = await this.repo.searchByArticle(q, brandSlug);
    return {
      query: q,
      total: products.length,
      results: products.map((p) => this.toSummary(p)),
    };
  }

  async getById(id: string): Promise<ProductDetailDto> {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return {
      ...this.toSummary(product),
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
    return { total, take, skip, items: items.map((p) => this.toSummary(p)) };
  }

  private toSummary(p: ProductRow): ProductSummaryDto {
    const primary = p.images.find((i) => i.isPrimary) ?? p.images[0] ?? null;
    return {
      id: p.id,
      article: p.article,
      name: p.name,
      brand: { id: p.brand.id, name: p.brand.name, slug: p.brand.slug },
      primaryImage: primary ? this.toImageDto(primary) : null,
    };
  }

  private toImageDto(img: ProductImage): ProductImageDto {
    return { id: img.id, url: img.url, isPrimary: img.isPrimary, sortOrder: img.sortOrder };
  }
}
