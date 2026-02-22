import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating product images...");

  // Active Dishes
  const activeDishes = await prisma.product.findMany({
    where: {
      category: "prato",
      isActive: true,
    },
    take: 2,
    orderBy: {
      createdAt: "asc",
    },
  });

  if (activeDishes.length >= 1) {
    await prisma.product.update({
      where: { id: activeDishes[0].id },
      data: { imageUrl: "/images/prato-1.png" },
    });
  }

  if (activeDishes.length >= 2) {
    await prisma.product.update({
      where: { id: activeDishes[1].id },
      data: { imageUrl: "/images/prato-2.png" },
    });
  }

  // Active Desserts
  const activeDesserts = await prisma.product.findMany({
    where: {
      category: "sobremesa",
      isActive: true,
    },
    take: 2,
    orderBy: {
      createdAt: "asc",
    },
  });

  if (activeDesserts.length >= 1) {
    await prisma.product.update({
      where: { id: activeDesserts[0].id },
      data: { imageUrl: "/images/sobremesa-1.png" },
    });
  }

  if (activeDesserts.length >= 2) {
    await prisma.product.update({
      where: { id: activeDesserts[1].id },
      data: { imageUrl: "/images/sobremesa-2.png" },
    });
  }

  console.log("Product images updated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
