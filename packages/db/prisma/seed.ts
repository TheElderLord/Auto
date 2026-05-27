import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ── Brands ──────────────────────────────────────────────────────────────────
  const [toyota, bosch, ngk, gates, mann] = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'toyota' }, update: {}, create: { name: 'Toyota', slug: 'toyota' } }),
    prisma.brand.upsert({ where: { slug: 'bosch' }, update: {}, create: { name: 'Bosch', slug: 'bosch' } }),
    prisma.brand.upsert({ where: { slug: 'ngk' }, update: {}, create: { name: 'NGK', slug: 'ngk' } }),
    prisma.brand.upsert({ where: { slug: 'gates' }, update: {}, create: { name: 'Gates', slug: 'gates' } }),
    prisma.brand.upsert({ where: { slug: 'mann-filter' }, update: {}, create: { name: 'Mann-Filter', slug: 'mann-filter' } }),
  ]);

  // ── Categories ───────────────────────────────────────────────────────────────
  const brakeCat = await prisma.category.upsert({ where: { slug: 'brakes' }, update: {}, create: { name: 'Brakes', slug: 'brakes' } });
  const igniteCat = await prisma.category.upsert({ where: { slug: 'ignition' }, update: {}, create: { name: 'Ignition', slug: 'ignition' } });
  const filterCat = await prisma.category.upsert({ where: { slug: 'filters' }, update: {}, create: { name: 'Filters', slug: 'filters' } });
  const beltCat = await prisma.category.upsert({ where: { slug: 'belts-chains' }, update: {}, create: { name: 'Belts & Chains', slug: 'belts-chains' } });

  const brakePadsCat = await prisma.category.upsert({ where: { slug: 'brake-pads' }, update: {}, create: { name: 'Brake Pads', slug: 'brake-pads', parentId: brakeCat.id } });
  const sparkPlugsCat = await prisma.category.upsert({ where: { slug: 'spark-plugs' }, update: {}, create: { name: 'Spark Plugs', slug: 'spark-plugs', parentId: igniteCat.id } });
  const oilFiltersCat = await prisma.category.upsert({ where: { slug: 'oil-filters' }, update: {}, create: { name: 'Oil Filters', slug: 'oil-filters', parentId: filterCat.id } });

  // ── Products ─────────────────────────────────────────────────────────────────
  async function upsertProduct(data: { article: string; name: string; description?: string; brandId: string; categoryIds: string[] }) {
    const existing = await prisma.product.findUnique({ where: { article_brandId: { article: data.article, brandId: data.brandId } } });
    if (existing) return existing;
    return prisma.product.create({
      data: { article: data.article, name: data.name, description: data.description, brandId: data.brandId, categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) } },
    });
  }

  const p1 = await upsertProduct({ article: '04465-33450', name: 'Disc Brake Pad Set — Front', description: 'OEM front disc brake pad set. Fits Corolla, Avensis, Auris.', brandId: toyota.id, categoryIds: [brakePadsCat.id] });
  const p2 = await upsertProduct({ article: '04465-02260', name: 'Disc Brake Pad Set — Rear', brandId: toyota.id, categoryIds: [brakePadsCat.id] });
  const p3 = await upsertProduct({ article: '0986424353', name: 'Brake Pads BP453', description: 'High-performance ceramic brake pads.', brandId: bosch.id, categoryIds: [brakePadsCat.id] });
  const p4 = await upsertProduct({ article: 'D1212', name: 'Iridium MAX Spark Plug', description: 'Long-life iridium spark plug.', brandId: ngk.id, categoryIds: [sparkPlugsCat.id] });
  const p5 = await upsertProduct({ article: 'BKR6EK', name: 'G-Power Platinum Spark Plug', brandId: ngk.id, categoryIds: [sparkPlugsCat.id] });
  const p6 = await upsertProduct({ article: 'RLL10902', name: 'Timing Belt Kit', description: 'Complete timing belt kit.', brandId: gates.id, categoryIds: [beltCat.id] });
  const p7 = await upsertProduct({ article: 'W712/83', name: 'Oil Filter', description: 'Spin-on oil filter. Fits most VAG/BMW petrol engines.', brandId: mann.id, categoryIds: [oilFiltersCat.id] });
  const p8 = await upsertProduct({ article: 'HU816X', name: 'Oil Filter (Metal-free)', brandId: mann.id, categoryIds: [oilFiltersCat.id] });

  // ── Offices ──────────────────────────────────────────────────────────────────
  const almaty = await prisma.office.upsert({ where: { id: 'office-almaty' }, update: {}, create: { id: 'office-almaty', name: 'Almaty Main', city: 'Almaty' } });
  const astana = await prisma.office.upsert({ where: { id: 'office-astana' }, update: {}, create: { id: 'office-astana', name: 'Astana Branch', city: 'Astana' } });

  // ── Storages ─────────────────────────────────────────────────────────────────
  const s1 = await prisma.storage.upsert({ where: { id: 'storage-almaty-central' }, update: {}, create: { id: 'storage-almaty-central', name: 'Almaty Central', officeId: almaty.id, deliveryDays: 1, markupPct: 20 } });
  const s2 = await prisma.storage.upsert({ where: { id: 'storage-almaty-b' }, update: {}, create: { id: 'storage-almaty-b', name: 'Almaty Supplier B', officeId: almaty.id, deliveryDays: 2, markupPct: 25 } });
  const s3 = await prisma.storage.upsert({ where: { id: 'storage-astana' }, update: {}, create: { id: 'storage-astana', name: 'Astana Warehouse', officeId: astana.id, deliveryDays: 3, markupPct: 22 } });

  // ── Stock items ───────────────────────────────────────────────────────────────
  const stock: Array<{ productId: string; storageId: string; qty: number; purchasePrice: number }> = [
    { productId: p1.id, storageId: s1.id, qty: 15, purchasePrice: 8500 },
    { productId: p1.id, storageId: s2.id, qty: 8,  purchasePrice: 8200 },
    { productId: p2.id, storageId: s1.id, qty: 6,  purchasePrice: 6800 },
    { productId: p3.id, storageId: s1.id, qty: 12, purchasePrice: 7200 },
    { productId: p3.id, storageId: s3.id, qty: 20, purchasePrice: 7000 },
    { productId: p4.id, storageId: s1.id, qty: 30, purchasePrice: 1200 },
    { productId: p4.id, storageId: s2.id, qty: 15, purchasePrice: 1150 },
    { productId: p5.id, storageId: s1.id, qty: 25, purchasePrice: 850  },
    { productId: p6.id, storageId: s1.id, qty: 4,  purchasePrice: 12000 },
    { productId: p7.id, storageId: s1.id, qty: 18, purchasePrice: 2100 },
    { productId: p7.id, storageId: s3.id, qty: 10, purchasePrice: 2050 },
    { productId: p8.id, storageId: s1.id, qty: 22, purchasePrice: 2300 },
    { productId: p8.id, storageId: s3.id, qty: 0,  purchasePrice: 2250 },
  ];

  for (const s of stock) {
    await prisma.stockItem.upsert({
      where: { productId_storageId: { productId: s.productId, storageId: s.storageId } },
      update: { qty: s.qty, purchasePrice: s.purchasePrice },
      create: { ...s, currency: 'KZT' },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
