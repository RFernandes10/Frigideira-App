import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { startOfDay, endOfDay } from "date-fns";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

export const menuRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: API para gerenciamento do cardápio diário.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMenuInput:
 *       type: object
 *       required:
 *         - date
 *         - dish1Id
 *         - dish2Id
 *         - dessert1Id
 *         - dessert2Id
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do cardápio.
 *           example: "2024-02-29T00:00:00.000Z"
 *         dish1Id:
 *           type: string
 *           format: uuid
 *           description: ID do primeiro prato.
 *           example: "clv5s2d3n0000q8z7h4g5f6e2"
 *         dish2Id:
 *           type: string
 *           format: uuid
 *           description: ID do segundo prato.
 *           example: "clv5s2d3n0000q8z7h4g5f6e3"
 *         dessert1Id:
 *           type: string
 *           format: uuid
 *           description: ID da primeira sobremesa.
 *           example: "clv5s2d3n0000q8z7h4g5f6e4"
 *         dessert2Id:
 *           type: string
 *           format: uuid
 *           description: ID da segunda sobremesa.
 *           example: "clv5s2d3n0000q8z7h4g5f6e5"
 *         maxOrders:
 *           type: integer
 *           minimum: 1
 *           description: Número máximo de pedidos que podem ser aceitos para este cardápio.
 *           example: 50
 *
 *     UpdateMenuInput:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Nova data do cardápio.
 *         dish1Id:
 *           type: string
 *           format: uuid
 *           description: Novo ID do primeiro prato.
 *         dish2Id:
 *           type: string
 *           format: uuid
 *           description: Novo ID do segundo prato.
 *         dessert1Id:
 *           type: string
 *           format: uuid
 *           description: Novo ID da primeira sobremesa.
 *         dessert2Id:
 *           type: string
 *           format: uuid
 *           description: Novo ID da segunda sobremesa.
 *         maxOrders:
 *           type: integer
 *           minimum: 1
 *           description: Novo número máximo de pedidos.
 *         isActive:
 *           type: boolean
 *           description: Status de ativação do cardápio.
 *
 *     DailyMenu:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do cardápio diário.
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data do cardápio.
 *         dish1Id:
 *           type: string
 *           format: uuid
 *         dish2Id:
 *           type: string
 *           format: uuid
 *         dessert1Id:
 *           type: string
 *           format: uuid
 *         dessert2Id:
 *           type: string
 *           format: uuid
 *         maxOrders:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         dish1:
 *           $ref: '#/components/schemas/Product'
 *         dish2:
 *           $ref: '#/components/schemas/Product'
 *         dessert1:
 *           $ref: '#/components/schemas/Product'
 *         dessert2:
 *           $ref: '#/components/schemas/Product'
 *
 *     DailyMenuResponse:
 *       type: object
 *       properties:
 *         menu:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             date:
 *               type: string
 *               format: date-time
 *             dish1Id:
 *               type: string
 *               format: uuid
 *             dish2Id:
 *               type: string
 *               format: uuid
 *             dessert1Id:
 *               type: string
 *               format: uuid
 *             dessert2Id:
 *               type: string
 *               format: uuid
 *             maxOrders:
 *               type: integer
 *             isActive:
 *               type: boolean
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             dishes:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             desserts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             availableSlots:
 *               type: integer
 *             ordersToday:
 *               type: integer
 *
 *
 */

// Schema de validação para criar cardápio
const createMenuSchema = z.object({
  date: z.string().datetime(),
  dish1Id: z.string().uuid(),
  dish2Id: z.string().uuid(),
  dessert1Id: z.string().uuid(),
  dessert2Id: z.string().uuid(),
  maxOrders: z.number().int().positive().default(30),
});

// Schema de validação para atualizar cardápio (todos os campos opcionais)
const updateMenuSchema = createMenuSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// ========== ROTAS PÚBLICAS ==========

// GET /api/menu/today - Buscar cardápio do dia
/**
 * @swagger
 * /api/menu/today:
 *   get:
 *     summary: Busca o cardápio ativo para o dia atual.
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Retorna o cardápio do dia ou uma mensagem se não houver.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyMenuResponse'
 *       500:
 *         description: Erro interno do servidor.
 */
menuRouter.get(
  "/today",
  asyncHandler(async (req: any, res: { json: (arg0: { message?: string; menu: { dishes: ({ id: string; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; } | null)[]; desserts: ({ id: string; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; } | null)[]; availableSlots: number; ordersToday: number; id: string; createdAt: Date; updatedAt: Date; date: Date; isActive: boolean; dish1Id: string; dish2Id: string; dessert1Id: string; dessert2Id: string; maxOrders: number; } | null; }) => void; }) => {
    const menu = await prisma.dailyMenu.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (!menu) {
      return res.json({
        message: "Cardápio ainda não disponível para hoje",
        menu: null,
      });
    }

    const [dish1, dish2, dessert1, dessert2] = await Promise.all([
      prisma.product.findUnique({ 
        where: { id: menu.dish1Id },
        select: { id: true, name: true, description: true, price: true, category: true, stock: true, imageUrl: true }
      }),
      prisma.product.findUnique({ 
        where: { id: menu.dish2Id },
        select: { id: true, name: true, description: true, price: true, category: true, stock: true, imageUrl: true }
      }),
      prisma.product.findUnique({ 
        where: { id: menu.dessert1Id },
        select: { id: true, name: true, description: true, price: true, category: true, stock: true, imageUrl: true }
      }),
      prisma.product.findUnique({ 
        where: { id: menu.dessert2Id },
        select: { id: true, name: true, description: true, price: true, category: true, stock: true, imageUrl: true }
      }),
    ]);

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const tomorrow = new Date(start);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ordersToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: start,
          lt: tomorrow,
        },
        status: {
          not: "cancelado",
        },
      },
    });

    res.json({
      menu: {
        ...menu,
        dishes: [dish1, dish2],
        desserts: [dessert1, dessert2],
        availableSlots: Math.max(0, menu.maxOrders - ordersToday),
        ordersToday,
      },
    });
  }),
);

// GET /api/menu/all - Buscar todos os cardápios
/**
 * @swagger
 * /api/menu/all:
 *   get:
 *     summary: Retorna todos os cardápios diários cadastrados.
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Lista de cardápios retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyMenu'
 *       500:
 *         description: Erro interno do servidor.
 */
menuRouter.get(
  "/all",
  asyncHandler(async (req: any, res: { json: (arg0: ({ dish1: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; dish2: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; dessert1: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; dessert2: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; } & { id: string; date: Date; dish1Id: string; dish2Id: string; dessert1Id: string; dessert2Id: string; isActive: boolean; maxOrders: number; createdAt: Date; updatedAt: Date; })[]) => void; }) => {
    const menus = await prisma.dailyMenu.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        dish1: true,
        dish2: true,
        dessert1: true,
        dessert2: true,
      },
    });

    res.json(menus);
  }),
);

// ========== ROTAS PROTEGIDAS (ADMIN) ==========

// GET /api/menu/:id - Buscar cardápio por ID
/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Busca um cardápio diário específico pelo ID (apenas para ADMIN).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do cardápio diário.
 *     responses:
 *       200:
 *         description: Cardápio diário retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyMenu'
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Cardápio não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
menuRouter.get(
  "/:id",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { params: { id: any; }; }, res: { json: (arg0: { dish1: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; dish2: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; dessert1: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; dessert2: { id: string; isActive: boolean; createdAt: Date; updatedAt: Date; name: string; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; } & { id: string; date: Date; dish1Id: string; dish2Id: string; dessert1Id: string; dessert2Id: string; isActive: boolean; maxOrders: number; createdAt: Date; updatedAt: Date; }) => void; }) => {
    const { id } = req.params;

    const menu = await prisma.dailyMenu.findUnique({
      where: { id },
      include: {
        dish1: true,
        dish2: true,
        dessert1: true,
        dessert2: true,
      },
    });

    if (!menu) {
      throw new AppError("Cardápio não encontrado", 404);
    }

    res.json(menu);
  }),
);

// POST /api/menu - Criar novo cardápio
/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Cria um novo cardápio diário (apenas para ADMIN).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuInput'
 *     responses:
 *       201:
 *         description: Cardápio diário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyMenu'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Um ou mais produtos não foram encontrados.
 *       409:
 *         description: Já existe um cardápio para esta data.
 *       500:
 *         description: Erro interno do servidor.
 */
menuRouter.post(
  "/",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { body: unknown; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id: string; date: Date; dish1Id: string; dish2Id: string; dessert1Id: string; dessert2Id: string; isActive: boolean; maxOrders: number; createdAt: Date; updatedAt: Date; }): void; new(): any; }; }; }) => {
    const data = createMenuSchema.parse(req.body);

    const dateObj = new Date(data.date);
    const existing = await prisma.dailyMenu.findFirst({
      where: {
        date: {
          gte: startOfDay(dateObj),
          lte: endOfDay(dateObj),
        },
      },
    });

    if (existing) {
      throw new AppError("Já existe um cardápio para esta data", 409);
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: [data.dish1Id, data.dish2Id, data.dessert1Id, data.dessert2Id],
        },
      },
    });

    if (products.length !== 4) {
      throw new AppError("Um ou mais produtos não foram encontrados", 404);
    }

    const menu = await prisma.dailyMenu.create({
      data: {
        date: dateObj,
        dish1Id: data.dish1Id,
        dish2Id: data.dish2Id,
        dessert1Id: data.dessert1Id,
        dessert2Id: data.dessert2Id,
        maxOrders: data.maxOrders,
        isActive: true,
      },
    });

    res.status(201).json(menu);
  }),
);

// PUT /api/menu/:id - Atualizar cardápio
/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Atualiza um cardápio diário existente (apenas para ADMIN).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do cardápio a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMenuInput'
 *     responses:
 *       200:
 *         description: Cardápio diário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyMenu'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Cardápio ou produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
menuRouter.put(
  "/:id",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { params: { id: any; }; body: unknown; }, res: { json: (arg0: { id: string; date: Date; dish1Id: string; dish2Id: string; dessert1Id: string; dessert2Id: string; isActive: boolean; maxOrders: number; createdAt: Date; updatedAt: Date; }) => void; }) => {
    const { id } = req.params;
    const data = updateMenuSchema.parse(req.body);

    const menu = await prisma.dailyMenu.findUnique({ where: { id } });
    if (!menu) {
      throw new AppError("Cardápio não encontrado", 404);
    }

    const productIds = [
      data.dish1Id,
      data.dish2Id,
      data.dessert1Id,
      data.dessert2Id,
    ].filter(Boolean) as string[];
    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });
      if (products.length !== productIds.length) {
        throw new AppError(
          "Um ou mais produtos fornecidos não foram encontrados",
          404,
        );
      }
    }

    const updatedMenu = await prisma.dailyMenu.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        dish1Id: data.dish1Id,
        dish2Id: data.dish2Id,
        dessert1Id: data.dessert1Id,
        dessert2Id: data.dessert2Id,
        maxOrders: data.maxOrders,
        isActive: data.isActive,
      },
    });

    res.json(updatedMenu);
  }),
);

// PATCH /api/menu/:id/toggle - Ativar/desativar cardápio
/**
 * @swagger
 * /api/menu/{id}/toggle:
 *   patch:
 *     summary: Ativa ou desativa um cardápio diário (apenas para ADMIN).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do cardápio a ser ativado/desativado.
 *     responses:
 *       200:
 *         description: Status do cardápio alterado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyMenu'
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Cardápio não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
menuRouter.patch(
  "/:id/toggle",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { params: { id: any; }; }, res: { json: (arg0: { id: string; date: Date; dish1Id: string; dish2Id: string; dessert1Id: string; dessert2Id: string; isActive: boolean; maxOrders: number; createdAt: Date; updatedAt: Date; }) => void; }) => {
    const { id } = req.params;

    const menu = await prisma.dailyMenu.findUnique({ where: { id } });

    if (!menu) {
      throw new AppError("Cardápio não encontrado", 404);
    }

    const updated = await prisma.dailyMenu.update({
      where: { id },
      data: {
        isActive: !menu.isActive,
      },
    });

    res.json(updated);
  }),
);

// DELETE /api/menu/:id - Deletar cardápio
/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Deleta um cardápio diário (apenas para ADMIN).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do cardápio a ser deletado.
 *     responses:
 *       204:
 *         description: Cardápio deletado com sucesso (sem conteúdo).
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Cardápio não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
menuRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (): void; new(): any; }; }; }) => {
    const { id } = req.params;

    await prisma.dailyMenu.delete({
      where: { id },
    });

    res.status(204).send();
  }),
);
