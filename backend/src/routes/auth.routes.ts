import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { UserRole } from '@prisma/client';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operações de autenticação e gerenciamento de usuários.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token de acesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Credenciais inválidas ou requisição malformada.
 *       500:
 *         description: Erro interno do servidor.
 */
authRouter.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário (apenas para ADMIN).
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Dados inválidos ou usuário já existe.
 *       401:
 *         description: Não autorizado (token ausente ou inválido).
 *       403:
 *         description: Acesso negado (apenas ADMINs podem registrar usuários).
 *       500:
 *         description: Erro interno do servidor.
 */
authRouter.post('/register', authenticateToken, authorizeRoles([UserRole.ADMIN]), validate(registerSchema), register);

export { authRouter };
