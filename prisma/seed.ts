// // // prisma/seed.ts
// // // This file uses CommonJS syntax (require) for compatibility with your local environment.
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');

// const prisma = new PrismaClient();

// // // // Define the Product interface locally for type strictness within this CommonJS seed file
// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl?: string;
//   inStock: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }


// async function main() {
//   console.log('Start seeding...');

// //   // 1. Clear existing data (order matters due to foreign key constraints)
// //   // Delete in reverse order of creation dependencies
//   await prisma.orderItem.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.cartItem.deleteMany();
//   await prisma.cart.deleteMany();
//   await prisma.address.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.product.deleteMany(); 
//   console.log('Cleaned up previous data.');

// //   // 2. Create Multiple Users
//   const hashedPassword = await bcrypt.hash('password123', 10);
//   const user1 = await prisma.user.create({
//     data: {
//       email: 'user1@example.com',
//       password: hashedPassword,
//     },
//   });
//   console.log(`Created user1 with ID: ${user1.id}`);

//   const user2 = await prisma.user.create({
//     data: {
//       email: 'user2@example.com',
//       password: hashedPassword,
//     },
//   });
//   console.log(`Created user2 with ID: ${user2.id}`);

// //   // 3. Create Products (ensure enough for testing different cart/order scenarios)
  // const productsData = [
//     { name: "Organic Apples", price: 3.99, imageUrl: 'https://images.pexels.com/photos/2487443/pexels-photo-2487443.jpeg', inStock: true },
//     { name: "Whole Milk (Gallon)", price: 4.50, imageUrl: 'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg', inStock: true },
//     { name: "Artisan Bread", price: 2.75, imageUrl: 'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg', inStock: true },
//     { name: "Cage-Free Eggs (Dozen)", price: 5.20, imageUrl: 'https://cdn.pixabay.com/photo/2022/07/26/13/55/egg-7345934_1280.jpg', inStock: false },
//     { name: "Avocado (Each)", price: 1.50, imageUrl: 'https://cdn.pixabay.com/photo/2015/08/10/12/02/avocados-882635_1280.jpg', inStock: true },
//     { name: "Salmon Fillet (LB)", price: 12.99, imageUrl: 'https://cdn.pixabay.com/photo/2017/05/19/13/06/salmon-2326479_1280.jpg', inStock: true },
//     { name: "Organic Spinach", price: 3.20, imageUrl: 'https://cdn.pixabay.com/photo/2018/06/08/22/16/spinach-3463248_1280.jpg', inStock: true },
//     { name: "Ground Coffee (Bag)", price: 8.99, imageUrl: 'https://cdn.pixabay.com/photo/2018/06/06/10/13/coffee-beans-3457587_1280.jpg', inStock: true },
//     { name: "Blueberries (Pint)", price: 4.99, imageUrl: 'https://cdn.pixabay.com/photo/2020/07/18/13/01/blueberry-5417154_1280.jpg', inStock: true },
//     { name: "Cheddar Cheese (Block)", price: 7.50, imageUrl: 'https://as2.ftcdn.net/v2/jpg/00/75/52/99/1000_F_75529950_twH3BeBeXBTbXxsf8CiVkJBRsze9BBHv.jpg', inStock: true },
    // { name: "Butter (LB)", price: 5.20, imageUrl: 'https://cdn.pixabay.com/photo/2018/05/18/12/55/butter-3411126_960_720.jpg', inStock: true},
    // { name: "Yellow Onions (2 LB Bag)", price: 3.50, imageUrl: 'https://cdn.pixabay.com/photo/2016/05/16/22/47/onions-1397037_960_720.jpg', inStock: true},
    // { name: "Orange Juice (1/2 Gallon)", price: 4.99, imageUrl: 'https://images.pexels.com/photos/3603/healthy-breakfast-orange-juice-health.jpg', inStock: true },
    // { name: "Olive Oil (16 OZ)", price: 9.99, imageUrl: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg', inStock: true},
    // { name: "All Purpose Flour (Bag)", price: 5.99, imageUrl: 'https://images.pexels.com/photos/6287223/pexels-photo-6287223.jpeg', inStock: false},
    // { name: "White Rice (LB)", price: 1.50, imageUrl: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg', inStock: true},
    // { name: "Chicken Breast (LB)", price: 5.99, imageUrl: 'https://cdn.pixabay.com/photo/2014/03/05/01/20/chicken-breast-279847_960_720.jpg', inStock: true},
    // { name: "Spaghetti (LB)", price: 1.99, imageUrl: 'https://cdn.pixabay.com/photo/2017/04/06/14/18/spaghetti-2208374_960_720.jpg', inStock: true},
    // { name: "Garlic (Each)", price: 0.70, imageUrl: 'https://images.pexels.com/photos/1392585/pexels-photo-1392585.jpeg', inStock: true},
    // { name: "Carrots (Bag)", price: 2.50, imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg', inStock: true },
    // { name: "Tomatoes (LB)", price: 1.99, imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg', inStock: true},
    // { name: "Honey (12 OZ)", price: 3.99, imageUrl: 'https://images.pexels.com/photos/302163/pexels-photo-302163.jpeg', inStock: false},
    // { name: "Lentils (LB)", price: 2.50, imageUrl: 'https://cdn.pixabay.com/photo/2025/06/12/14/45/lentils-9656338_960_720.jpg', inStock: true},
    // { name: "Oats (24 OZ)", price: 3.99, imageUrl: 'https://images.pexels.com/photos/11112773/pexels-photo-11112773.jpeg', inStock: true},
    // { name: "Strawberries (LB)", price: 2.99, imageUrl: 'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg', inStock: true},
    // { name: "Bagels (6 ct)", price: 2.99, imageUrl: 'https://cdn.pixabay.com/photo/2021/09/17/09/42/bagel-6632148_960_720.jpg', inStock: true},
    // { name: "Raw Shrimp (LB)", price: 8.99, imageUrl: 'https://images.pexels.com/photos/21771249/pexels-photo-21771249.jpeg', inStock: true},
    // { name: "Sea Salt (LB)", price: 8.50, imageUrl: 'https://images.pexels.com/photos/7717461/pexels-photo-7717461.jpeg', inStock: false},
    // { name: "Peppercorns (LB)", price: 15.99, imageUrl: 'https://images.pexels.com/photos/8559086/pexels-photo-8559086.jpeg', inStock: true},
    // { name: "Lemons (Each)", price: 0.80, imageUrl: 'https://images.pexels.com/photos/266346/pexels-photo-266346.jpeg', inStock: true},
    // { name: "Limes (Each)", price: 0.50, imageUrl: 'https://images.pexels.com/photos/186841/pexels-photo-186841.jpeg', inStock: false},
    // { name: "Sweet Corn (Each)", price: 0.50, imageUrl: 'https://images.pexels.com/photos/16732706/pexels-photo-16732706.jpeg', inStock: true},
    // { name: "Potatoes (5 LB)", price: 5.99, imageUrl: 'https://cdn.pixabay.com/photo/2018/12/29/13/42/farm-market-potatoes-3901428_960_720.jpg', inStock: true},
    // { name: "Peanut Butter (LB)", price: 4.99, imageUrl: 'https://images.pexels.com/photos/6659898/pexels-photo-6659898.jpeg', inStock: false}
  // ];
  // const createdProducts: Product[] = []; // Explicitly type as Product[]
  // for (const productData of productsData) {
  //   const p = await prisma.product.create({ data: productData });
  //   createdProducts.push(p as Product); // Cast to Product
  // }
  // console.log(`Created ${createdProducts.length} products.`);

// //   // Store product references for easy access
//   const productApples = createdProducts.find((p: Product) => p.name === 'Organic Apples') as Product;
//   const productMilk = createdProducts.find((p: Product) => p.name === 'Whole Milk (Gallon)') as Product;
//   const productBread = createdProducts.find((p: Product) => p.name === 'Artisan Bread') as Product;
//   const productEggs = createdProducts.find((p: Product) => p.name === 'Cage-Free Eggs (Dozen)') as Product;
//   const productAvocado = createdProducts.find((p: Product) => p.name === 'Avocado (Each)') as Product;
//   const productSalmon = createdProducts.find((p: Product) => p.name === 'Salmon Fillet (LB)') as Product;
//   const productCoffee = createdProducts.find((p: Product) => p.name === 'Ground Coffee (Bag)') as Product;


// //   // 4. Create Addresses for Users
//   const user1Address1 = await prisma.address.create({
//     data: {
//       street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210',
//       isDefault: true, userId: user1.id,
//     },
//   });
//   const user1Address2 = await prisma.address.create({
//     data: {
//       street: '456 Side Rd', city: 'Anytown', state: 'CA', zipCode: '90211',
//       isDefault: false, userId: user1.id,
//     },
//   });
//   console.log(`Created addresses for user1.`);

//   const user2Address1 = await prisma.address.create({
//     data: {
//       street: '789 Elm St', city: 'Otherville', state: 'NY', zipCode: '10001',
//       isDefault: true, userId: user2.id,
//     },
//   });
//   console.log(`Created addresses for user2.`);


// //   // 5. Create Carts and CartItems
//   const user1Cart = await prisma.cart.create({
//     data: {
//       userId: user1.id,
//       items: {
//         create: [
//           { productId: productApples.id, quantity: 2 },
//           { productId: productMilk.id, quantity: 1 },
//         ],
//       },
//     },
//   });
//   console.log(`Created cart for user1 with ID: ${user1Cart.id}`);

//   const user2Cart = await prisma.cart.create({
//     data: {
//       userId: user2.id,
//       items: {
//         create: [
//           { productId: productBread.id, quantity: 3 },
//           { productId: productCoffee.id, quantity: 1 },
//         ],
//       },
//     },
//   });
//   console.log(`Created cart for user2 with ID: ${user2Cart.id}`);


// //   // 6. Create Orders and OrderItems
// //   // Helper function to calculate totals (simplified for seeding)
//   const calculateOrderTotals = (items: { productId: string; quantity: number; priceAtPurchase: number }[]) => {
//     let subtotal = 0;
//     items.forEach(item => {
//       // Find the actual product object from createdProducts
//       const product = createdProducts.find((p: Product) => p.id === item.productId);
//       if (product) {
//         subtotal += product.price * item.quantity;
//       }
//     });
//     const taxRate = 0.0825; // 8.25%
//     const taxAmount = subtotal * taxRate;
//     const totalAmount = subtotal + taxAmount; // No discounts in seeding for simplicity
//     return { subtotalAmount: parseFloat(subtotal.toFixed(2)), taxAmount: parseFloat(taxAmount.toFixed(2)), totalAmount: parseFloat(totalAmount.toFixed(2)) };
//   };


// //   // User 1's First Order (Delivered)
//   const orderItems1Data = [
//     { productId: productApples.id, quantity: 1, priceAtPurchase: productApples.price },
//     { productId: productAvocado.id, quantity: 4, priceAtPurchase: productAvocado.price },
//   ];
//   const totals1 = calculateOrderTotals(orderItems1Data);
//   const order1 = await prisma.order.create({
//     data: {
//       userId: user1.id,
//       subtotalAmount: totals1.subtotalAmount,
//       taxAmount: totals1.taxAmount,
//       totalAmount: totals1.totalAmount,
//       deliveryType: 'DELIVERY',
//       status: 'DELIVERED',
//       shippingAddressId: user1Address1.id,
//       orderItems: {
//         create: orderItems1Data,
//       },
//     },
//   });
//   console.log(`Created order1 for user1 with ID: ${order1.id}, Status: ${order1.status}`);

// //   // User 1's Second Order (Pending - Pickup)
//   const orderItems2Data = [
//     { productId: productSalmon.id, quantity: 1, priceAtPurchase: productSalmon.price },
//     { productId: productMilk.id, quantity: 1, priceAtPurchase: productMilk.price },
//   ];
//   const totals2 = calculateOrderTotals(orderItems2Data);
//   const order2 = await prisma.order.create({
//     data: {
//       userId: user1.id,
//       subtotalAmount: totals2.subtotalAmount,
//       taxAmount: totals2.taxAmount,
//       totalAmount: totals2.totalAmount,
//       deliveryType: 'PICKUP',
//       status: 'PENDING',
//       orderItems: {
//         create: orderItems2Data,
//       },
//     },
//   });
//   console.log(`Created order2 for user1 with ID: ${order2.id}, Status: ${order2.status}`);

// //   // User 2's First Order (Processing)
//   const orderItems3Data = [
//     { productId: productBread.id, quantity: 2, priceAtPurchase: productBread.price },
//     { productId: productEggs.id, quantity: 1, priceAtPurchase: productEggs.price }, // Even if out of stock, it's captured
//   ];
//   const totals3 = calculateOrderTotals(orderItems3Data);
//   const order3 = await prisma.order.create({
//     data: {
//       userId: user2.id,
//       subtotalAmount: totals3.subtotalAmount,
//       taxAmount: totals3.taxAmount,
//       totalAmount: totals3.totalAmount,
//       deliveryType: 'DELIVERY',
//       status: 'PROCESSING',
//       shippingAddressId: user2Address1.id,
//       orderItems: {
//         create: orderItems3Data,
//       },
//     },
//   });
//   console.log(`Created order3 for user2 with ID: ${order3.id}, Status: ${order3.status}`);

// }

// main()
//   .catch((e) => {
//     console.error('Seeding error:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//     console.log('Seeding finished.');
//   });
// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear old discount codes
  await prisma.discountCode.deleteMany();

  // Create new discount codes
  const codes = await prisma.discountCode.createMany({
    data: [
      {
        code: 'SUMMER10',
        percentage: 10,
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
      },
      {
        code: 'WELCOME5',
        percentage: 5,
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
      },
      {
        code: 'EXPIRED50',
        percentage: 50,
        expiresAt: new Date(new Date().setDate(new Date().getDate() - 1)), // already expired
      },
    ],
  });

  console.log('✅ Seeded discount codes:', codes);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
