// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Home & lifestyle themed catalog, sourced live from DummyJSON (dummyjson.com, MIT licensed).
// Only categories that fit a home-goods storefront are pulled in — furniture, home decor,
// and kitchenware. Categories like electronics, apparel, or groceries are skipped on purpose
// so the catalog reads as one themed store, not a general marketplace.
const DUMMYJSON_CATEGORIES = ['furniture', 'home-decoration', 'kitchen-accessories'];

type DummyProduct = {
  title: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  thumbnail: string;
};

type SeedProduct = {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
};

// Generic finish/size modifiers that plausibly apply across furniture, decor, and kitchenware.
const VARIANT_MODIFIERS = [
  'Black', 'White', 'Walnut Finish', 'Oak Finish', 'Matte Grey',
  'Natural', 'Compact', 'Large', 'Set of 2', 'Brushed Steel',
];

async function fetchCategoryProducts(category: string): Promise<DummyProduct[]> {
  const res = await fetch(
    `https://dummyjson.com/products/category/${category}?limit=100&select=title,price,category,stock,images,thumbnail`
  );
  if (!res.ok) throw new Error(`DummyJSON fetch failed for ${category}: ${res.status}`);
  const data = await res.json();
  return data.products;
}

function toSeedProduct(p: DummyProduct, imageUrl: string): SeedProduct {
  return {
    name: p.title,
    price: p.price,
    category: p.category,
    imageUrl,
    inStock: p.stock > 0,
  };
}

// Scales a real product into `count` believable variants: a modifier appended to the name,
// a small price jitter, and the image rotated from that same product's own image pool
// (never a fabricated image).
function buildVariants(p: DummyProduct, count: number): SeedProduct[] {
  const images = p.images.length > 0 ? p.images : [p.thumbnail];
  const variants: SeedProduct[] = [toSeedProduct(p, images[0])];

  for (let i = 1; i < count; i++) {
    const modifier = VARIANT_MODIFIERS[(i - 1) % VARIANT_MODIFIERS.length];
    const jitter = 1 + (((i * 37) % 21) - 10) / 100; // deterministic +/-10% jitter
    const image = images[i % images.length];
    variants.push({
      name: `${p.title} — ${modifier}`,
      price: Math.round(p.price * jitter * 100) / 100,
      category: p.category,
      imageUrl: image,
      inStock: ((p.stock + i * 13) % 100) > 10, // mostly in stock, some sold out for pagination/UI testing
    });
  }

  return variants;
}

async function buildCatalog(): Promise<SeedProduct[]> {
  const catalog: SeedProduct[] = [];
  for (const category of DUMMYJSON_CATEGORIES) {
    const products = await fetchCategoryProducts(category);
    for (const p of products) {
      catalog.push(...buildVariants(p, 7)); // ~7x scale-up for pagination/perf testing
    }
  }
  return catalog;
}

async function main() {
  console.log('🌱 Seeding started...');

  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.product.deleteMany(),
  ]);
  console.log('🧹 Cleared order-related product data.');

  console.log('📦 Fetching home & lifestyle catalog from DummyJSON...');
  const productsData = await buildCatalog();

  await prisma.product.createMany({ data: productsData });
  console.log(`✅ Seeded ${productsData.length} products.`);

  await prisma.discountCode.deleteMany();
  await prisma.discountCode.createMany({
    data: [
      {
        code: 'SUMMER10',
        percentage: 10,
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      {
        code: 'WELCOME5',
        percentage: 5,
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
      {
        code: 'EXPIRED50',
        percentage: 50,
        expiresAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    ],
  });

  console.log('✅ Discount codes seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🌱 Seeding complete.');
  });
