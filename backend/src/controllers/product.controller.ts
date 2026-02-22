import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar um novo produto
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, imageUrl, category, stock, isActive } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        category,
        stock,
        isActive,
      },
    });

    res.status(201).json({ message: 'Produto criado com sucesso!', product });
  } catch (error) {
    next(error);
  }
};

// Obter todos os produtos com paginação e filtros
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize, category, active } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limit = parseInt(pageSize as string) || 10;
    const skip = (pageNumber - 1) * limit;

    const whereClause: any = {};
    if (category) {
      whereClause.category = category as string;
    }
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }

    const [products, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    res.status(200).json({
      page: pageNumber,
      pageSize: limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Obter produto por ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Atualizar produto
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, stock, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        imageUrl,
        category,
        stock,
        isActive,
      },
    });

    res.status(200).json({ message: 'Produto atualizado com sucesso!', product });
  } catch (error) {
    next(error);
  }
};

// Deletar produto
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Produto deletado com sucesso!' });
  } catch (error) {
    next(error);
  }
};

// Ativar/desativar produto
export const toggleProductActiveStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
      },
    });

    res.status(200).json({ message: 'Status do produto atualizado com sucesso!', product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

