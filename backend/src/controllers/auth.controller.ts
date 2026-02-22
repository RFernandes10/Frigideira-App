import { Request, Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body; // Add role to destructuring

  try {
    // No need for email/password check here, Zod validation middleware handles it
    // if (!email || !password) {
    //   return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    // }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Usuário já existe com este email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the role for the new user
    const newUserRole = role && Object.values(UserRole).includes(role) ? role : UserRole.USER;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: newUserRole,
      },
      select: {
        id: true,
        email: true,
        role: true,
      }
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET não está definido nas variáveis de ambiente.');
      return res.status(500).json({ message: 'Erro de configuração do servidor.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    res.status(200).json({ message: 'Login realizado com sucesso!', token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};
