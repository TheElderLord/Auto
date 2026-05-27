import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/db/prisma.service';
import type { Product, Brand, ProductImage, ProductCategory, Category } from '@kazparts/db';

type ProductWithRelations = Product & {
  brand: Brand;
  images: ProductImage[];
  categories: (ProductCategory & { category: Category })[];
};

@Injectable()
export class CatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchByArticle(q: string, brandSlug?: string): Promise<ProductWithRelations[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { article: { equals: q, mode: 'insensitive' } },
          { article: { startsWith: q, mode: 'insensitive' } },
        ],
        ...(brandSlug ? { brand: { slug: brandSlug } } : {}),
      },
      include: {
        brand: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        categories: { include: { category: true } },
      },
      orderBy: { article: 'asc' },
      take: 50,
    });
  }

  async findById(id: string): Promise<ProductWithRelations | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        categories: { include: { category: true } },
      },
    });
  }

  async listAll(take = 100, skip = 0): Promise<{ items: ProductWithRelations[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        include: {
          brand: true,
          images: { where: { isPrimary: true }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: [{ brand: { name: 'asc' } }, { article: 'asc' }],
        take,
        skip,
      }),
      this.prisma.product.count(),
    ]);
    return { items, total };
  }
}
