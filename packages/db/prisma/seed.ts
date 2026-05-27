import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'toyota' },
      update: {},
      create: { name: 'Toyota', slug: 'toyota' },
    }),
    prisma.brand.upsert({
      where: { slug: 'bosch' },
      update: {},
      create: { name: 'Bosch', slug: 'bosch' },
    }),
    prisma.brand.upsert({
      where: { slug: 'ngk' },
      update: {},
      create: { name: 'NGK', slug: 'ngk' },
    }),
    prisma.brand.upsert({
      where: { slug: 'gates' },
      update: {},
      create: { name: 'Gates', slug: 'gates' },
    }),
    prisma.brand.upsert({
      where: { slug: 'mann-filter' },
      update: {},
      create: { name: 'Mann-Filter', slug: 'mann-filter' },
    }),
  ]);

  const [toyota, bosch, ngk, gates, mann] = brands;

  // Categories
  const brakeCat = await prisma.category.upsert({
    where: { slug: 'brakes' },
    update: {},
    create: { name: 'Brakes', slug: 'brakes' },
  });
  const igniteCat = await prisma.category.upsert({
    where: { slug: 'ignition' },
    update: {},
    create: { name: 'Ignition', slug: 'ignition' },
  });
  const filterCat = await prisma.category.upsert({
    where: { slug: 'filters' },
    update: {},
    create: { name: 'Filters', slug: 'filters' },
  });
  const beltCat = await prisma.category.upsert({
    where: { slug: 'belts-chains' },
    update: {},
    create: { name: 'Belts & Chains', slug: 'belts-chains' },
  });

  const brakePadsCat = await prisma.category.upsert({
    where: { slug: 'brake-pads' },
    update: {},
    create: { name: 'Brake Pads', slug: 'brake-pads', parentId: brakeCat.id },
  });
  const sparkPlugsCat = await prisma.category.upsert({
    where: { slug: 'spark-plugs' },
    update: {},
    create: { name: 'Spark Plugs', slug: 'spark-plugs', parentId: igniteCat.id },
  });
  const oilFiltersCat = await prisma.category.upsert({
    where: { slug: 'oil-filters' },
    update: {},
    create: { name: 'Oil Filters', slug: 'oil-filters', parentId: filterCat.id },
  });

  // Helper to upsert a product with categories
  async function upsertProduct(data: {
    article: string;
    name: string;
    description?: string;
    brandId: string;
    categoryIds: string[];
  }) {
    const existing = await prisma.product.findUnique({
      where: { article_brandId: { article: data.article, brandId: data.brandId } },
    });
    if (existing) return existing;

    return prisma.product.create({
      data: {
        article: data.article,
        name: data.name,
        description: data.description,
        brandId: data.brandId,
        categories: {
          create: data.categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    });
  }

  // Products
  await upsertProduct({
    article: '04465-33450',
    name: 'Disc Brake Pad Set — Front',
    description: 'OEM front disc brake pad set. Fits Corolla, Avensis, Auris.',
    brandId: toyota.id,
    categoryIds: [brakePadsCat.id],
  });

  await upsertProduct({
    article: '04465-02260',
    name: 'Disc Brake Pad Set — Rear',
    description: 'OEM rear disc brake pad set.',
    brandId: toyota.id,
    categoryIds: [brakePadsCat.id],
  });

  await upsertProduct({
    article: '0986424353',
    name: 'Brake Pads BP453',
    description: 'High-performance ceramic brake pads for compact cars.',
    brandId: bosch.id,
    categoryIds: [brakePadsCat.id],
  });

  await upsertProduct({
    article: 'D1212',
    name: 'Iridium MAX Spark Plug',
    description: 'Long-life iridium spark plug for improved fuel economy.',
    brandId: ngk.id,
    categoryIds: [sparkPlugsCat.id],
  });

  await upsertProduct({
    article: 'BKR6EK',
    name: 'G-Power Platinum Spark Plug',
    description: 'Platinum-tipped spark plug for reliable ignition.',
    brandId: ngk.id,
    categoryIds: [sparkPlugsCat.id],
  });

  await upsertProduct({
    article: 'RLL10902',
    name: 'Timing Belt Kit',
    description: 'Complete timing belt kit including tensioner and idler.',
    brandId: gates.id,
    categoryIds: [beltCat.id],
  });

  await upsertProduct({
    article: 'W712/83',
    name: 'Oil Filter',
    description: 'Spin-on oil filter. Fits most VAG/BMW petrol engines.',
    brandId: mann.id,
    categoryIds: [oilFiltersCat.id],
  });

  await upsertProduct({
    article: 'HU816X',
    name: 'Oil Filter (Metal-free)',
    description: 'Metal-free oil filter for eco-friendly disposal.',
    brandId: mann.id,
    categoryIds: [oilFiltersCat.id],
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
