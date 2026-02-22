import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O ID único do produto.
 *           example: "clv5s2d3n0000q8z7h4g5f6e2"
 *         name:
 *           type: string
 *           description: Nome do produto.
 *           example: "Prato Principal"
 *         description:
 *           type: string
 *           description: Descrição do produto.
 *           example: "Um delicioso prato principal para toda a família."
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do produto.
 *           example: 29.99
 *         imageUrl:
 *           type: string
 *           format: url
 *           description: URL da imagem do produto.
 *           example: "http://example.com/images/prato-1.png"
 *         category:
 *           type: string
 *           enum: [prato, sobremesa]
 *           description: Categoria do produto.
 *           example: "prato"
 *         stock:
 *           type: integer
 *           description: Quantidade em estoque.
 *           example: 100
 *         isActive:
 *           type: boolean
 *           description: Indica se o produto está ativo para venda.
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização.
 *
 *     ProductCreate:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           example: "Torta de Limão"
 *         description:
 *           type: string
 *           example: "Uma torta de limão cremosa com merengue."
 *         price:
 *           type: number
 *           format: float
 *           example: 15.50
 *         imageUrl:
 *           type: string
 *           format: url
 *           example: "http://example.com/images/torta.png"
 *         category:
 *           type: string
 *           enum: [prato, sobremesa]
 *           example: "sobremesa"
 *         stock:
 *           type: integer
 *           example: 50
 *         isActive:
 *           type: boolean
 *           default: true
 *
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Torta de Limão Siciliano"
 *         description:
 *           type: string
 *           example: "Uma torta cremosa com o toque especial do limão siciliano."
 *         price:
 *           type: number
 *           format: float
 *           example: 18.00
 *         imageUrl:
 *           type: string
 *           format: url
 *         category:
 *           type: string
 *           enum: [prato, sobremesa]
 *         stock:
 *           type: integer
 *         isActive:
 *           type: boolean
 */

export const productCreateSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  price: z.number().min(0, 'O preço não pode ser negativo.'),
  imageUrl: z.string().url('URL da imagem inválida.').optional().or(z.literal('')),
  category: z.enum(['prato', 'sobremesa'], {
    errorMap: () => ({ message: 'A categoria deve ser "prato" ou "sobremesa".' }),
  }),
  stock: z.number().int().min(0, 'O estoque não pode ser negativo.'),
  isActive: z.boolean().default(true).optional(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.').optional(),
  description: z.string().min(1, 'A descrição é obrigatória.').optional(),
  price: z.number().min(0, 'O preço não pode ser negativo.').optional(),
  imageUrl: z.string().url('URL da imagem inválida.').optional().or(z.literal('')),
  category: z.enum(['prato', 'sobremesa'], {
    errorMap: () => ({ message: 'A categoria deve ser "prato" ou "sobremesa".' }),
  }).optional(),
  stock: z.number().int().min(0, 'O estoque não pode ser negativo.').optional(),
  isActive: z.boolean().optional(),
});
