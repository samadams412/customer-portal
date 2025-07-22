// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // Step 1: Delete OrderItems → Orders → Products (in that order)
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.product.deleteMany(), // Now safe to delete
  ]);
  console.log("🧹 Cleared order-related product data.");

  // Step 2: Seed Products
  const productsData = [
    { name: "Organic Apples", price: 3.99, category: "produce", imageUrl: 'https://images.pexels.com/photos/2487443/pexels-photo-2487443.jpeg', inStock: true },
    { name: "Whole Milk (Gallon)", price: 4.50, category: "dairy", imageUrl: 'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg', inStock: true },
    { name: "Artisan Bread", price: 2.75, category: "dry goods", imageUrl: 'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg', inStock: true },
    { name: "Cage-Free Eggs (Dozen)", price: 5.20, category: "dairy", imageUrl: 'https://cdn.pixabay.com/photo/2022/07/26/13/55/egg-7345934_1280.jpg', inStock: false },
    { name: "Avocado (Each)", price: 1.50, category: "produce", imageUrl: 'https://cdn.pixabay.com/photo/2015/08/10/12/02/avocados-882635_1280.jpg', inStock: true },
    { name: "Salmon Fillet (LB)", price: 12.99, category: "meat", imageUrl: 'https://cdn.pixabay.com/photo/2017/05/19/13/06/salmon-2326479_1280.jpg', inStock: true },
    { name: "Organic Spinach", price: 3.20, category: "produce", imageUrl: 'https://cdn.pixabay.com/photo/2018/06/08/22/16/spinach-3463248_1280.jpg', inStock: true },
    { name: "Ground Coffee (Bag)", price: 8.99, category: "dry goods", imageUrl: 'https://cdn.pixabay.com/photo/2018/06/06/10/13/coffee-beans-3457587_1280.jpg', inStock: true },
    { name: "Blueberries (Pint)", price: 4.99, category: "produce", imageUrl: 'https://cdn.pixabay.com/photo/2020/07/18/13/01/blueberry-5417154_1280.jpg', inStock: true },
    { name: "Cheddar Cheese (Block)", price: 7.50, category: "dairy", imageUrl: 'https://as2.ftcdn.net/v2/jpg/00/75/52/99/1000_F_75529950_twH3BeBeXBTbXxsf8CiVkJBRsze9BBHv.jpg', inStock: true },
    { name: "Butter (LB)", price: 5.20, category: "dairy", imageUrl: 'https://cdn.pixabay.com/photo/2018/05/18/12/55/butter-3411126_960_720.jpg', inStock: true },
    { name: "Yellow Onions (2 LB Bag)", price: 3.50, category: "produce", imageUrl: 'https://cdn.pixabay.com/photo/2016/05/16/22/47/onions-1397037_960_720.jpg', inStock: true },
    { name: "Orange Juice (1/2 Gallon)", price: 4.99, category: "produce", imageUrl: 'https://images.pexels.com/photos/3603/healthy-breakfast-orange-juice-health.jpg', inStock: true },
    { name: "Olive Oil (16 OZ)", price: 9.99, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg', inStock: true },
    { name: "All Purpose Flour (Bag)", price: 5.99, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/6287223/pexels-photo-6287223.jpeg', inStock: false },
    { name: "White Rice (LB)", price: 1.50, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg', inStock: true },
    { name: "Chicken Breast (LB)", price: 5.99, category: "meat", imageUrl: 'https://cdn.pixabay.com/photo/2014/03/05/01/20/chicken-breast-279847_960_720.jpg', inStock: true },
    { name: "Spaghetti (LB)", price: 1.99, category: "dry goods", imageUrl: 'https://cdn.pixabay.com/photo/2017/04/06/14/18/spaghetti-2208374_960_720.jpg', inStock: true },
    { name: "Garlic (Each)", price: 0.70, category: "produce", imageUrl: 'https://images.pexels.com/photos/1392585/pexels-photo-1392585.jpeg', inStock: true },
    { name: "Carrots (Bag)", price: 2.50, category: "produce", imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg', inStock: true },
    { name: "Tomatoes (LB)", price: 1.99, category: "produce", imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg', inStock: true },
    { name: "Honey (12 OZ)", price: 3.99, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/302163/pexels-photo-302163.jpeg', inStock: false },
    { name: "Lentils (LB)", price: 2.50, category: "dry goods", imageUrl: 'https://cdn.pixabay.com/photo/2025/06/12/14/45/lentils-9656338_960_720.jpg', inStock: true },
    { name: "Oats (24 OZ)", price: 3.99, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/11112773/pexels-photo-11112773.jpeg', inStock: true },
    { name: "Strawberries (LB)", price: 2.99, category: "produce", imageUrl: 'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg', inStock: true },
    { name: "Bagels (6 ct)", price: 2.99, category: "dry goods", imageUrl: 'https://cdn.pixabay.com/photo/2021/09/17/09/42/bagel-6632148_960_720.jpg', inStock: true },
    { name: "Raw Shrimp (LB)", price: 8.99, category: "meat", imageUrl: 'https://images.pexels.com/photos/21771249/pexels-photo-21771249.jpeg', inStock: true },
    { name: "Sea Salt (LB)", price: 8.50, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/7717461/pexels-photo-7717461.jpeg', inStock: false },
    { name: "Peppercorns (LB)", price: 15.99, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/8559086/pexels-photo-8559086.jpeg', inStock: true },
    { name: "Lemons (Each)", price: 0.80, category: "produce", imageUrl: 'https://images.pexels.com/photos/266346/pexels-photo-266346.jpeg', inStock: true },
    { name: "Limes (Each)", price: 0.50, category: "produce", imageUrl: 'https://images.pexels.com/photos/186841/pexels-photo-186841.jpeg', inStock: false },
    { name: "Sweet Corn (Each)", price: 0.50, category: "produce", imageUrl: 'https://images.pexels.com/photos/16732706/pexels-photo-16732706.jpeg', inStock: true },
    { name: "Potatoes (5 LB)", price: 5.99, category: "produce", imageUrl: 'https://cdn.pixabay.com/photo/2018/12/29/13/42/farm-market-potatoes-3901428_960_720.jpg', inStock: true },
    { name: "Peanut Butter (LB)", price: 4.99, category: "dry goods", imageUrl: 'https://images.pexels.com/photos/6659898/pexels-photo-6659898.jpeg', inStock: false }
  ];

  await prisma.product.createMany({ data: productsData });
  console.log(`✅ Seeded ${productsData.length} products.`);

  // Step 3: Always reseed discount codes
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

  console.log("✅ Discount codes seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🌱 Seeding complete.");
  });