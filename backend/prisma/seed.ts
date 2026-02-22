import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dailyMenu.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Dados anteriores removidos");

  // Criar configurações padrão
  const settings = await prisma.settings.create({
    data: {
      deliveryFee: 2.0,
      pixKey: "12299487751",
      pixName: "Roberto Fonseca",
      pixCity: "Rio de Janeiro",
      orderDeadline: "10:00",
      deliveryStartTime: "11:30",
      deliveryEndTime: "13:30",
      maxDailyOrders: 30,
      isAcceptingOrders: true,
    },
  });

  console.log("✓ Configurações criadas");

  // Criar usuário administrador padrão
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@frigideira.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log(
    "✓ Usuário administrador criado (admin@frigideira.com / admin123)",
  );

  // Criar usuário cliente padrão
  const hashedPasswordCustomer = await bcrypt.hash("customer123", 10);
  const customerUser = await prisma.user.create({
    data: {
      email: "customer@frigideira.com",
      password: hashedPasswordCustomer,
      role: UserRole.USER,
    },
  });

  console.log(
    "✓ Usuário cliente criado (customer@frigideira.com / customer123)",
  );

  // Criar produtos - Pratos
  const pratos = await Promise.all([
    prisma.product.create({
      data: {
        name: "Bife Acebolado Caseiro",
        description:
          "Bife bovino suculento com cebolas caramelizadas, acompanha arroz soltinho, feijão preto cremoso, batata frita crocante e salada verde fresca",
        price: 18.0,
        category: "prato",
        stock: 20,
        isActive: true,
        imageUrl: "/images/prato-1.png",
      },
    }),

    prisma.product.create({
      data: {
        name: "Bife à Parmegiana",
        description:
          "Bife empanado coberto com molho de tomate e queijo gratinado, acompanha arroz, feijão e batata frita",
        price: 17.0,
        category: "prato",
        stock: 20,
        isActive: true,
        imageUrl: "/images/prato-2.png",
      },
    }),
  ]);

  console.log("✓ Pratos criados");

  // Criar produtos - Sobremesas
  const sobremesas = await Promise.all([
    prisma.product.create({
      data: {
        name: "Pudim de Leite Condensado",
        description: "Cremoso pudim caseiro com calda de caramelo",
        price: 2.0,
        category: "sobremesa",
        stock: 20,
        isActive: true,
        imageUrl: "/images/sobremesa-1.png",
      },
    }),

    prisma.product.create({
      data: {
        name: "Pavê de Chocolate",
        description: "Camadas de biscoito e creme de chocolate",
        price: 2.0,
        category: "sobremesa",
        stock: 20,
        isActive: true,
        imageUrl: "/images/sobremesa-2.png",
      },
    }),
  ]);

  console.log("✓ Sobremesas criadas");

  // Criar cardápio de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const menu = await prisma.dailyMenu.create({
    data: {
      date: today,
      dish1Id: pratos[0].id, // Bife Acebolado
      dish2Id: pratos[1].id, // Frango Grelhado
      dessert1Id: sobremesas[0].id, // Pudim
      dessert2Id: sobremesas[1].id, // Gelatina
      maxOrders: 100,
      isActive: true,
    },
  });

  console.log("✓ Cardápio do dia criado");

  // Criar alguns clientes de exemplo
  const clientes = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Roberto Fernandes",
        phone: "5521972657221",
        email: "roberto@email.com",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Priscilla Fonseca",
        phone: "5521998707017",
        email: "priscilla@email.com",
      },
    }),
  ]);

  console.log("✓ Clientes de exemplo criados");

  // Criar alguns pedidos de exemplo
  const order1 = await prisma.order.create({
    data: {
      customerId: clientes[0].id,
      deliveryType: "entrega",
      deliveryAddress: "Rua Recife, 873 - Realengo, Rio de Janeiro - RJ",
      deliveryFee: 2.0,
      subtotal: 22.0,
      total: 24.0,
      status: "preparando",
      paymentStatus: "confirmado",
      items: {
        create: [
          {
            productId: pratos[0].id,
            quantity: 1,
            price: 18.0,
            type: "prato",
          },
          {
            productId: sobremesas[0].id,
            quantity: 1,
            price: 2.0,
            type: "sobremesa",
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: clientes[1].id,
      deliveryType: "retirada",
      deliveryFee: 0,
      subtotal: 19.0,
      total: 19.0,
      status: "novo",
      paymentStatus: "pendente",
      items: {
        create: [
          {
            productId: pratos[1].id,
            quantity: 1,
            price: 19.0,
            type: "prato",
          },
          {
            productId: sobremesas[1].id,
            quantity: 1,
            price: 0,
            type: "sobremesa",
          },
        ],
      },
    },
  });

  console.log("✓ Pedidos de exemplo criados");



  console.log("\n✅ Seed concluído com sucesso!");
  console.log("\n📊 Resumo:");
  console.log(`- ${pratos.length} pratos criados`);
  console.log(`- ${sobremesas.length} sobremesas criadas`);
  console.log(`- ${clientes.length} clientes criados`);
  console.log(`- 2 pedidos de exemplo criados`);
  console.log(`- 1 cardápio do dia criado`);
  console.log(`- 1 configuração padrão criada`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
