// prisma/seed.ts
// This file uses CommonJS syntax (require) for compatibility with your local environment.
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Define the Product interface locally for type strictness within this CommonJS seed file
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}


async function main() {
  console.log('Start seeding...');

  // 1. Clear existing data (order matters due to foreign key constraints)
  // Delete in reverse order of creation dependencies
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany(); 
  console.log('Cleaned up previous data.');

  // 2. Create Multiple Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: hashedPassword,
    },
  });
  console.log(`Created user1 with ID: ${user1.id}`);

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: hashedPassword,
    },
  });
  console.log(`Created user2 with ID: ${user2.id}`);

  // 3. Create Products (ensure enough for testing different cart/order scenarios)
  const productsData = [
    { name: "Organic Apples", price: 3.99, imageUrl: 'https://images.pexels.com/photos/2487443/pexels-photo-2487443.jpeg', inStock: true },
    { name: "Whole Milk (Gallon)", price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1634141510639-d691d86f47be?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: true },
    { name: "Artisan Bread", price: 2.75, imageUrl: 'https://plus.unsplash.com/premium_photo-1666675709302-8630e759fed5?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: true },
    { name: "Cage-Free Eggs (Dozen)", price: 5.20, imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=1043&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: false },
    { name: "Avocado (Each)", price: 1.50, imageUrl: 'https://images.unsplash.com/photo-1612506266679-606568a33215?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: true },
    { name: "Salmon Fillet (LB)", price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1559058789-672da06263d8?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: true },
    { name: "Organic Spinach", price: 3.20, imageUrl: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: true },
    { name: "Ground Coffee (Bag)", price: 8.99, imageUrl: 'https://images.unsplash.com/photo-1619615174792-a5edcfeafdfe?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: true },
    { name: "Blueberries (Pint)", price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1597774681009-f8679cf72348?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', inStock: true },
    { name: "Cheddar Cheese (Block)", price: 7.50, imageUrl: 'https://as2.ftcdn.net/v2/jpg/00/75/52/99/1000_F_75529950_twH3BeBeXBTbXxsf8CiVkJBRsze9BBHv.jpg', inStock: true },
  ];
  const createdProducts: Product[] = []; // Explicitly type as Product[]
  for (const productData of productsData) {
    const p = await prisma.product.create({ data: productData });
    createdProducts.push(p as Product); // Cast to Product
  }
  console.log(`Created ${createdProducts.length} products.`);

  // Store product references for easy access
  const productApples = createdProducts.find((p: Product) => p.name === 'Organic Apples') as Product;
  const productMilk = createdProducts.find((p: Product) => p.name === 'Whole Milk (Gallon)') as Product;
  const productBread = createdProducts.find((p: Product) => p.name === 'Artisan Bread') as Product;
  const productEggs = createdProducts.find((p: Product) => p.name === 'Cage-Free Eggs (Dozen)') as Product;
  const productAvocado = createdProducts.find((p: Product) => p.name === 'Avocado (Each)') as Product;
  const productSalmon = createdProducts.find((p: Product) => p.name === 'Salmon Fillet (LB)') as Product;
  const productCoffee = createdProducts.find((p: Product) => p.name === 'Ground Coffee (Bag)') as Product;


  // 4. Create Addresses for Users
  const user1Address1 = await prisma.address.create({
    data: {
      street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210',
      isDefault: true, userId: user1.id,
    },
  });
  const user1Address2 = await prisma.address.create({
    data: {
      street: '456 Side Rd', city: 'Anytown', state: 'CA', zipCode: '90211',
      isDefault: false, userId: user1.id,
    },
  });
  console.log(`Created addresses for user1.`);

  const user2Address1 = await prisma.address.create({
    data: {
      street: '789 Elm St', city: 'Otherville', state: 'NY', zipCode: '10001',
      isDefault: true, userId: user2.id,
    },
  });
  console.log(`Created addresses for user2.`);


  // 5. Create Carts and CartItems
  const user1Cart = await prisma.cart.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          { productId: productApples.id, quantity: 2 },
          { productId: productMilk.id, quantity: 1 },
        ],
      },
    },
  });
  console.log(`Created cart for user1 with ID: ${user1Cart.id}`);

  const user2Cart = await prisma.cart.create({
    data: {
      userId: user2.id,
      items: {
        create: [
          { productId: productBread.id, quantity: 3 },
          { productId: productCoffee.id, quantity: 1 },
        ],
      },
    },
  });
  console.log(`Created cart for user2 with ID: ${user2Cart.id}`);


  // 6. Create Orders and OrderItems
  // Helper function to calculate totals (simplified for seeding)
  const calculateOrderTotals = (items: { productId: string; quantity: number; priceAtPurchase: number }[]) => {
    let subtotal = 0;
    items.forEach(item => {
      // Find the actual product object from createdProducts
      const product = createdProducts.find((p: Product) => p.id === item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    });
    const taxRate = 0.0825; // 8.25%
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount; // No discounts in seeding for simplicity
    return { subtotalAmount: parseFloat(subtotal.toFixed(2)), taxAmount: parseFloat(taxAmount.toFixed(2)), totalAmount: parseFloat(totalAmount.toFixed(2)) };
  };


  // User 1's First Order (Delivered)
  const orderItems1Data = [
    { productId: productApples.id, quantity: 1, priceAtPurchase: productApples.price },
    { productId: productAvocado.id, quantity: 4, priceAtPurchase: productAvocado.price },
  ];
  const totals1 = calculateOrderTotals(orderItems1Data);
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      subtotalAmount: totals1.subtotalAmount,
      taxAmount: totals1.taxAmount,
      totalAmount: totals1.totalAmount,
      deliveryType: 'DELIVERY',
      status: 'DELIVERED',
      shippingAddressId: user1Address1.id,
      orderItems: {
        create: orderItems1Data,
      },
    },
  });
  console.log(`Created order1 for user1 with ID: ${order1.id}, Status: ${order1.status}`);

  // User 1's Second Order (Pending - Pickup)
  const orderItems2Data = [
    { productId: productSalmon.id, quantity: 1, priceAtPurchase: productSalmon.price },
    { productId: productMilk.id, quantity: 1, priceAtPurchase: productMilk.price },
  ];
  const totals2 = calculateOrderTotals(orderItems2Data);
  const order2 = await prisma.order.create({
    data: {
      userId: user1.id,
      subtotalAmount: totals2.subtotalAmount,
      taxAmount: totals2.taxAmount,
      totalAmount: totals2.totalAmount,
      deliveryType: 'PICKUP',
      status: 'PENDING',
      orderItems: {
        create: orderItems2Data,
      },
    },
  });
  console.log(`Created order2 for user1 with ID: ${order2.id}, Status: ${order2.status}`);

  // User 2's First Order (Processing)
  const orderItems3Data = [
    { productId: productBread.id, quantity: 2, priceAtPurchase: productBread.price },
    { productId: productEggs.id, quantity: 1, priceAtPurchase: productEggs.price }, // Even if out of stock, it's captured
  ];
  const totals3 = calculateOrderTotals(orderItems3Data);
  const order3 = await prisma.order.create({
    data: {
      userId: user2.id,
      subtotalAmount: totals3.subtotalAmount,
      taxAmount: totals3.taxAmount,
      totalAmount: totals3.totalAmount,
      deliveryType: 'DELIVERY',
      status: 'PROCESSING',
      shippingAddressId: user2Address1.id,
      orderItems: {
        create: orderItems3Data,
      },
    },
  });
  console.log(`Created order3 for user2 with ID: ${order3.id}, Status: ${order3.status}`);

}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding finished.');
  });
