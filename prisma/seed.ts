const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany(); // clear old seed data

  await prisma.product.createMany({
    data: [
      {
        name: "Apple - Gala",
        price: 0.99,
        imageUrl: "https://source.unsplash.com/200x200/?apple",
        inStock: true,
      },
      {
        name: "Banana",
        price: 0.39,
        imageUrl: "https://source.unsplash.com/200x200/?banana",
        inStock: true,
      },
      {
        name: "Almond Milk",
        price: 3.49,
        imageUrl: "https://source.unsplash.com/200x200/?milk",
        inStock: false,
      },
      {
        name: "Whole Wheat Bread",
        price: 2.99,
        imageUrl: "https://source.unsplash.com/200x200/?bread",
        inStock: true,
      },
      {
        name: "Eggs - Free Range",
        price: 4.29,
        imageUrl: "https://source.unsplash.com/200x200/?eggs",
        inStock: true,
      },
      {
        name: "Orange Juice",
        price: 3.99,
        imageUrl: "https://source.unsplash.com/200x200/?orange,juice",
        inStock: false,
      },
      {
        name: "Peanut Butter",
        price: 5.99,
        imageUrl: "https://source.unsplash.com/200x200/?peanut,butter",
        inStock: true,
      },
      {
        name: "Frozen Pizza",
        price: 6.49,
        imageUrl: "https://source.unsplash.com/200x200/?pizza",
        inStock: true,
      },
    ],
  });

  console.log("Seeded products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
