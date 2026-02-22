import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export const ordersRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API para gerenciamento de pedidos de clientes.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerInput:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do cliente.
 *           example: "João Silva"
 *         phone:
 *           type: string
 *           description: Telefone do cliente (apenas dígitos).
 *           example: "11987654321"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do cliente.
 *           example: "joao.silva@example.com"
 *
 *     OrderItemInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - type
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           description: ID do produto.
 *           example: "clv5s2d3n0000q8z7h4g5f6e2"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantidade do produto.
 *           example: 2
 *         type:
 *           type: string
 *           enum: [prato, sobremesa]
 *           description: Tipo de produto (prato ou sobremesa).
 *           example: "prato"
 *
 *     CreateOrderInput:
 *       type: object
 *       required:
 *         - customer
 *         - items
 *         - deliveryType
 *       properties:
 *         customer:
 *           $ref: '#/components/schemas/CustomerInput'
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *         deliveryType:
 *           type: string
 *           enum: [entrega, retirada]
 *           description: Tipo de entrega (entrega ou retirada).
 *           example: "entrega"
 *         deliveryAddress:
 *           type: string
 *           description: Endereço de entrega (obrigatório se deliveryType for "entrega").
 *           example: "Rua Exemplo, 123, Bairro Feliz, Cidade"
 *         observations:
 *           type: string
 *           description: Observações adicionais para o pedido.
 *           example: "Sem cebola, por favor."
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do pedido.
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: ID do cliente que fez o pedido.
 *         deliveryType:
 *           type: string
 *           enum: [entrega, retirada]
 *         deliveryAddress:
 *           type: string
 *         deliveryFee:
 *           type: number
 *           format: float
 *         subtotal:
 *           type: number
 *           format: float
 *         total:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [novo, preparando, pronto, entregue, cancelado]
 *           example: "novo"
 *         paymentStatus:
 *           type: string
 *           enum: [pendente, confirmado, cancelado]
 *           example: "pendente"
 *         observations:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Order'
 *         - type: object
 *           properties:
 *             customer:
 *               $ref: '#/components/schemas/CustomerInput' # Reusando para a estrutura básica do cliente
 *             items:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   orderId:
 *                     type: string
 *                     format: uuid
 *                   productId:
 *                     type: string
 *                     format: uuid
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: number
 *                     format: float
 *                   type:
 *                     type: string
 *                     enum: [prato, sobremesa]
 *                   product:
 *                     $ref: '#/components/schemas/Product' # Referência ao schema Product
 *
 *     OrderStats:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         totalRevenue:
 *           type: number
 *           format: float
 *         byStatus:
 *           type: object
 *           properties:
 *             novo: { type: integer }
 *             preparando: { type: integer }
 *             pronto: { type: integer }
 *             entregue: { type: integer }
 *             cancelado: { type: integer }
 *         byDeliveryType:
 *           type: object
 *           properties:
 *             entrega: { type: integer }
 *             retirada: { type: integer }
 */

// Schema de validaÃ§Ã£o para criar pedido
const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(3, "Nome deve ter no máximo 3 caracteres"),
    phone: z.string().min(10, "Telefone invalido"),
    email: z.string().email().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
        type: z.enum(["prato", "sobremesa"]),
      }),
    )
    .min(1, "Pedido deve ter pelo menos 1 item"),
  deliveryType: z.enum(["entrega", "retirada"]),
  deliveryAddress: z.string().optional(),
  observations: z.string().optional(),
});

// ========== ROTAS PÃšBLICAS ==========

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria um novo pedido.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithDetails'
 *       400:
 *         description: Dados de requisição inválidos, produtos indisponíveis ou fora de estoque, ou pedidos encerrados.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
ordersRouter.post(
  "/",
  asyncHandler(async (req: { body: unknown; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { customer: { id: string; createdAt: Date; updatedAt: Date; name: string; phone: string; email: string | null; }; items: ({ product: { id: string; createdAt: Date; updatedAt: Date; name: string; isActive: boolean; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; } & { type: string; id: string; createdAt: Date; price: number; productId: string; quantity: number; orderId: string; })[]; } & { deliveryFee: number; status: string; id: string; createdAt: Date; updatedAt: Date; deliveryType: string; deliveryAddress: string | null; observations: string | null; orderNumber: number; subtotal: number; total: number; paymentMethod: string; paymentStatus: string; customerId: string; }): void; new(): any; }; }; }) => {
    const data = createOrderSchema.parse(req.body);

    const settings = await prisma.settings.findFirst();
    if (settings && !settings.isAcceptingOrders) {
      throw new AppError(
        "Pedidos encerrados para hoje. Tente novamente amanhÃ£!",
        400,
      );
    }

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new AppError(`Produto ${item.productId} não encontrado`, 404);
      }

      if (!product.isActive) {
        throw new AppError(`Produto ${product.name} não está disponível`, 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Produto ${product.name} sem estoque suficiente`,
          400,
        );
      }
    }

    let customer = await prisma.customer.findUnique({
      where: { phone: data.customer.phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: data.customer,
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (product) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          type: item.type,
        });
      }
    }

    const deliveryFee =
      data.deliveryType === "entrega" ? settings?.deliveryFee || 2.0 : 0;

    const total = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        deliveryType: data.deliveryType,
        deliveryAddress: data.deliveryAddress,
        deliveryFee,
        subtotal,
        total,
        observations: data.observations,
        items: {
          create: orderItems,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.status(201).json(order);
  }),
);

// ========== ROTAS PROTEGIDAS (ADMIN) ==========

// GET /api/orders - Listar todos os pedidos
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lista todos os pedidos (apenas para ADMIN).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [novo, preparando, pronto, entregue, cancelado]
 *         description: Filtrar pedidos por status.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar pedidos por data de criação (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderWithDetails'
 *       401:
 *         description: Não autorizado (token ausente ou inválido).
 *       403:
 *         description: Acesso negado (apenas ADMINs podem listar pedidos).
 *       500:
 *         description: Erro interno do servidor.
 */
ordersRouter.get(
  "/",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { query: { status: any; date: any; }; }, res: { json: (arg0: ({ customer: { id: string; createdAt: Date; updatedAt: Date; name: string; phone: string; email: string | null; }; items: ({ product: { id: string; createdAt: Date; updatedAt: Date; name: string; isActive: boolean; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; } & { type: string; id: string; createdAt: Date; price: number; productId: string; quantity: number; orderId: string; })[]; } & { deliveryFee: number; status: string; id: string; createdAt: Date; updatedAt: Date; deliveryType: string; deliveryAddress: string | null; observations: string | null; orderNumber: number; subtotal: number; total: number; paymentMethod: string; paymentStatus: string; customerId: string; })[]) => void; }) => {
    const { status, date } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date as string);
      endDate.setHours(23, 59, 59, 999);

      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  }),
);

// GET /api/orders/stats/today - Estatísticas do dia
/**
 * @swagger
 * /api/orders/stats/today:
 *   get:
 *     summary: Retorna estatísticas de pedidos para o dia atual (apenas para ADMIN).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do dia retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStats'
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno do servidor.
 */
ordersRouter.get(
  "/stats/today",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: any, res: { json: (arg0: { totalOrders: number; totalRevenue: number; byStatus: { novo: number; preparando: number; pronto: number; entregue: number; cancelado: number; }; byDeliveryType: { entrega: number; retirada: number; }; }) => void; }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      byStatus: {
        novo: orders.filter((o) => o.status === "novo").length,
        preparando: orders.filter((o) => o.status === "preparando").length,
        pronto: orders.filter((o) => o.status === "pronto").length,
        entregue: orders.filter((o) => o.status === "entregue").length,
        cancelado: orders.filter((o) => o.status === "cancelado").length,
      },
      byDeliveryType: {
        entrega: orders.filter((o) => o.deliveryType === "entrega").length,
        retirada: orders.filter((o) => o.deliveryType === "retirada").length,
      },
    };

    res.json(stats);
  }),
);

// GET /api/orders/:id - Buscar pedido por ID
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Busca um pedido específico pelo ID (apenas para ADMIN).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithDetails'
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Pedido não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
ordersRouter.get(
  "/:id",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { params: { id: any; }; }, res: { json: (arg0: { customer: { id: string; createdAt: Date; updatedAt: Date; name: string; phone: string; email: string | null; }; items: ({ product: { id: string; createdAt: Date; updatedAt: Date; name: string; isActive: boolean; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; } & { type: string; id: string; createdAt: Date; price: number; productId: string; quantity: number; orderId: string; })[]; } & { deliveryFee: number; status: string; id: string; createdAt: Date; updatedAt: Date; deliveryType: string; deliveryAddress: string | null; observations: string | null; orderNumber: number; subtotal: number; total: number; paymentMethod: string; paymentStatus: string; customerId: string; }) => void; }) => {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    res.json(order);
  }),
);

// PATCH /api/orders/:id/status - Atualizar status do pedido
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateOrderStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [novo, preparando, pronto, entregue, cancelado]
 *           description: O novo status do pedido.
 *           example: "preparando"
 */
/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido (apenas para ADMIN).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do pedido a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusInput'
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithDetails'
 *       400:
 *         description: Status inválido.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Pedido não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
ordersRouter.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { params: { id: any; }; body: { status: any; }; }, res: { json: (arg0: { customer: { id: string; createdAt: Date; updatedAt: Date; name: string; phone: string; email: string | null; }; items: ({ product: { id: string; createdAt: Date; updatedAt: Date; name: string; isActive: boolean; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; } & { type: string; id: string; createdAt: Date; price: number; productId: string; quantity: number; orderId: string; })[]; } & { deliveryFee: number; status: string; id: string; createdAt: Date; updatedAt: Date; deliveryType: string; deliveryAddress: string | null; observations: string | null; orderNumber: number; subtotal: number; total: number; paymentMethod: string; paymentStatus: string; customerId: string; }) => void; }) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "novo",
      "preparando",
      "pronto",
      "entregue",
      "cancelado",
    ];

    if (!validStatuses.includes(status)) {
      throw new AppError("Status inválido", 400);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  }),
);

// PATCH /api/orders/:id/payment - Confirmar pagamento
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePaymentStatusInput:
 *       type: object
 *       required:
 *         - paymentStatus
 *       properties:
 *         paymentStatus:
 *           type: string
 *           enum: [pendente, confirmado, cancelado]
 *           description: O novo status de pagamento do pedido.
 *           example: "confirmado"
 */
/**
 * @swagger
 * /api/orders/{id}/payment:
 *   patch:
 *     summary: Confirma o status de pagamento de um pedido (apenas para ADMIN).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do pedido cujo pagamento será atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePaymentStatusInput'
 *     responses:
 *       200:
 *         description: Status de pagamento do pedido atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithDetails'
 *       400:
 *         description: Status de pagamento inválido.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Pedido não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
ordersRouter.patch(
  "/:id/payment",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(async (req: { params: { id: any; }; body: { paymentStatus: any; }; }, res: { json: (arg0: { customer: { id: string; createdAt: Date; updatedAt: Date; name: string; phone: string; email: string | null; }; items: ({ product: { id: string; createdAt: Date; updatedAt: Date; name: string; isActive: boolean; description: string; price: number; imageUrl: string | null; category: string; stock: number; }; } & { type: string; id: string; createdAt: Date; price: number; productId: string; quantity: number; orderId: string; })[]; } & { deliveryFee: number; status: string; id: string; createdAt: Date; updatedAt: Date; deliveryType: string; deliveryAddress: string | null; observations: string | null; orderNumber: number; subtotal: number; total: number; paymentMethod: string; paymentStatus: string; customerId: string; }) => void; }) => {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validPaymentStatuses = ["pendente", "confirmado", "cancelado"];

    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new AppError("Status de pagamento inválido", 400);
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        ...(paymentStatus === "confirmado" && { status: "preparando" }),
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (paymentStatus === "confirmado") {
      const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER;

      if (whatsappPhoneNumber) {
        const orderItemsMessage = order.items
          .map(
            (item) =>
              `${item.quantity}x ${item.product?.name || "Produto"} (R$ ${item.price.toFixed(2)})`,
          )
          .join("\n");

        const deliveryInfo =
          order.deliveryType === "entrega"
            ? `Endereço: ${order.deliveryAddress || "Não informado"}`
            : "Retirada no local";

        const message = [
          "*PEDIDO PAGO E CONFIRMADO!*",
          `Pedido ID: ${order.id}`,
          `Cliente: ${order.customer?.name || "N/A"}`,
          `Telefone: ${order.customer?.phone || "N/A"}`,
          `E-mail: ${order.customer?.email || ""}`,
          "",
          "*Detalhes do Pedido:*",
          orderItemsMessage,
          "",
          `Total: R$ ${order.total.toFixed(2)}`,
          `Tipo de entrega: ${order.deliveryType}`,
          deliveryInfo,
          `Observações: ${order.observations || "-"}`,
          "",
          "Acesse para ver mais: [link para o admin]",
        ].join("\n");

        const whatsappUrl = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(message)}`;
        console.log("Notificação WhatsApp de Pagamento:", whatsappUrl);
      } else {
        console.warn(
          "WHATSAPP_PHONE_NUMBER não configurado no .env. Notificação WhatsApp desabilitada.",
        );
      }
    }

    res.json(order);
  }),
);
