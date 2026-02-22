// src/test/setup.ts
import { prisma } from '../lib/prisma';

beforeAll(async () => {
  // Poderia colocar aqui lógicas de conexão com banco de testes
});

afterAll(async () => {
  await prisma.$disconnect();
});
