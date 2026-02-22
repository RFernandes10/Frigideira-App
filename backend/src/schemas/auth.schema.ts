import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: O endereço de e-mail do usuário.
 *           example: "novo.admin@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: A senha do usuário (mínimo 6 caracteres).
 *           example: "senha123"
 *         role:
 *           type: string
 *           enum: [ADMIN, CUSTOMER]
 *           description: O papel do usuário (ADMIN ou CUSTOMER).
 *           example: "ADMIN"
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: O endereço de e-mail do usuário para login.
 *           example: "usuario@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: A senha do usuário para login.
 *           example: "senhaSecreta"
 */

export const registerSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  role: z.enum(['ADMIN', 'CUSTOMER']).optional(), // Permite definir a role, opcional por enquanto
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});
