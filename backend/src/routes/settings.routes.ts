import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

export const settingsRouter = Router();

const updateSettingsSchema = z.object({
  deliveryFee: z.number().min(0).optional(),
  pixKey: z.string().optional(),
  pixName: z.string().optional(),
  pixCity: z.string().optional(),
  orderDeadline: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  deliveryStartTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  deliveryEndTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  maxDailyOrders: z.number().int().positive().optional(),
  isAcceptingOrders: z.boolean().optional(),
});

// ========== ROTAS PÚBLICAS ==========

settingsRouter.get(
  "/",
  asyncHandler(
    async (
      _req: any,
      res: {
        json: (arg0: {
          deliveryFee: number;
          pixKey: string;
          pixName: string;
          pixCity: string;
          orderDeadline: string;
          deliveryStartTime: string;
          deliveryEndTime: string;
          maxDailyOrders: number;
          isAcceptingOrders: boolean;
          id: string;
          createdAt: Date;
          updatedAt: Date;
        }) => void;
      },
    ) => {
      let settings = await prisma.settings.findFirst();

      // Se existir mas a chave Pix estiver vazia, tentar carregar do .env
      if (settings && !settings.pixKey && process.env.PIX_KEY) {
        settings = await prisma.settings.update({
          where: { id: settings.id },
          data: {
            pixKey: process.env.PIX_KEY,
            pixName: process.env.PIX_NAME || settings.pixName,
            pixCity: process.env.PIX_CITY || settings.pixCity,
          },
        });
      }

      // Criar configurações padrão se não existir
      if (!settings) {
        settings = await prisma.settings.create({
          data: {
            deliveryFee: 2.0,
            pixKey: process.env.PIX_KEY || "",
            pixName: process.env.PIX_NAME || "Frigideira Roberto Fonseca",
            pixCity: process.env.PIX_CITY || "RIO DE JANEIRO",
            orderDeadline: "10:00",
            deliveryStartTime: "11:30",
            deliveryEndTime: "13:30",
            maxDailyOrders: 30,
            isAcceptingOrders: true,
          },
        });
      }

      res.json({ ...settings, whatsapp: process.env.WHATSAPP_PHONE_NUMBER || "" } as any);
    },
  ),
);

// ========== ROTAS PROTEGIDAS (ADMIN) ==========

settingsRouter.put(
  "/",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(
    async (
      req: { body: unknown },
      res: {
        json: (arg0: {
          deliveryFee: number;
          pixKey: string;
          pixName: string;
          pixCity: string;
          orderDeadline: string;
          deliveryStartTime: string;
          deliveryEndTime: string;
          maxDailyOrders: number;
          isAcceptingOrders: boolean;
          id: string;
          createdAt: Date;
          updatedAt: Date;
        }) => void;
      },
    ) => {
      const data = updateSettingsSchema.parse(req.body);

      let settings = await prisma.settings.findFirst();

      if (!settings) {
        settings = await prisma.settings.create({
          data: {
            deliveryFee: 2.0,
            pixKey: process.env.PIX_KEY || "",
            pixName: process.env.PIX_NAME || "Frigideira",
            pixCity: process.env.PIX_CITY || "SAO PAULO",
            orderDeadline: "10:00",
            deliveryStartTime: "11:30",
            deliveryEndTime: "13:30",
            maxDailyOrders: 30,
            isAcceptingOrders: true,
            ...data,
          },
        });
      } else {
        settings = await prisma.settings.update({
          where: { id: settings.id },
          data,
        });
      }

      res.json({ ...settings, whatsapp: process.env.WHATSAPP_PHONE_NUMBER || "" } as any);
    },
  ),
);

// PATCH /api/settings/toggle-orders - Ativar/desativar pedidos

settingsRouter.patch(
  "/toggle-orders",
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  asyncHandler(
    async (
      req: any,
      res: {
        json: (arg0: {
          deliveryFee: number;
          pixKey: string;
          pixName: string;
          pixCity: string;
          orderDeadline: string;
          deliveryStartTime: string;
          deliveryEndTime: string;
          maxDailyOrders: number;
          isAcceptingOrders: boolean;
          id: string;
          createdAt: Date;
          updatedAt: Date;
        }) => void;
      },
    ) => {
      let settings = await prisma.settings.findFirst();

      if (!settings) {
        settings = await prisma.settings.create({
          data: {
            deliveryFee: 2.0,
            pixKey: process.env.PIX_KEY || "",
            pixName: process.env.PIX_NAME || "Frigideira",
            pixCity: process.env.PIX_CITY || "SAO PAULO",
            orderDeadline: "10:00",
            deliveryStartTime: "11:30",
            deliveryEndTime: "13:30",
            maxDailyOrders: 30,
            isAcceptingOrders: true,
          },
        });
      }

      const updated = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          isAcceptingOrders: !settings.isAcceptingOrders,
        },
      });

      res.json({ ...updated, whatsapp: process.env.WHATSAPP_PHONE_NUMBER || "" } as any);
    },
  ),
);
