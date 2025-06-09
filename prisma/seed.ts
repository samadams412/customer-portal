const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: 'Milk', price: 3.49, imageUrl: '/images/milk.jpg' },
      { name: 'Eggs', price: 2.99, imageUrl: '/images/eggs.jpg' },
      { name: 'Bread', price: 2.49, imageUrl: '/images/bread.jpg' },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
