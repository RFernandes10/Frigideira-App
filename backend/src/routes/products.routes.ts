import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductActiveStatus,
} from "../controllers/product.controller";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../schemas/product.schema";
import { UserRole } from "@prisma/client";

export const productsRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para gerenciamento de produtos.
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos ativos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro no servidor.
 */
productsRouter.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Busca um produto específico pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
productsRouter.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 */
productsRouter.post(
  "/",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  validate(productCreateSchema),
  createProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Produto não encontrado.
 */
productsRouter.put(
  "/:id",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  validate(productUpdateSchema),
  updateProduct,
);

/**
 * @swagger
 * /api/products/{id}/toggle:
 *   patch:
 *     summary: Ativa ou desativa um produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto a ser ativado/desativado.
 *     responses:
 *       200:
 *         description: Status do produto alterado com sucesso.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Produto não encontrado.
 */
productsRouter.patch(
  "/:id/toggle",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  toggleProductActiveStatus,
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto a ser deletado.
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso (sem conteúdo).
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Produto não encontrado.
 */
productsRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  deleteProduct,
);
