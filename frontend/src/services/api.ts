import axios from "axios";
import { Product, Order, DailyMenu, Settings, CreateOrderData } from "@/types";

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || "http://localhost:3333/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ⭐ Se receber erro 401 ou 403, significa que o token expirou ou é inválido
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpar dados de autenticação
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // O redirecionamento para login admin foi removido, pois a interface de admin no frontend foi removida.
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Erro ao processar requisição";
    console.error("API Error:", message);
    throw new Error(message);
  },
);

export const productsApi = {
  getAll: async (category?: "prato" | "sobremesa"): Promise<Product[]> => {
    const params = category ? { category } : {};
    const { data } = await api.get("/products", { params });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.post("/products", productData);
    return data;
  },

  update: async (
    id: string,
    productData: Partial<Product>,
  ): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  toggle: async (id: string): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}/toggle`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const ordersApi = {
  getAll: async (filters?: {
    status?: string;
    date?: string;
  }): Promise<Order[]> => {
    const { data } = await api.get("/orders", { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  create: async (orderData: CreateOrderData): Promise<Order> => {
    const { data } = await api.post("/orders", orderData);
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  updatePayment: async (id: string, paymentStatus: string): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/payment`, {
      paymentStatus,
    });
    return data;
  },

  getStats: async (): Promise<any> => {
    const { data } = await api.get("/orders/stats/today");
    return data;
  },
};

export const menuApi = {
  getToday: async (): Promise<{ menu: DailyMenu | null; message?: string }> => {
    const { data } = await api.get("/menu/today");
    return data;
  },

  getAll: async (): Promise<DailyMenu[]> => {
    const { data } = await api.get("/menu/all");
    return data;
  },

  getById: async (id: string): Promise<DailyMenu> => {
    const { data } = await api.get(`/menu/${id}`);
    return data;
  },

  create: async (menuData: Partial<DailyMenu>): Promise<DailyMenu> => {
    const { data } = await api.post("/menu", menuData);
    return data;
  },

  update: async (
    id: string,
    menuData: Partial<DailyMenu>,
  ): Promise<DailyMenu> => {
    const { data } = await api.put(`/menu/${id}`, menuData);
    return data;
  },

  toggle: async (id: string): Promise<DailyMenu> => {
    const { data } = await api.patch(`/menu/${id}/toggle`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/menu/${id}`);
  },
};

export const settingsApi = {
  get: async (): Promise<Settings> => {
    const { data } = await api.get("/settings");
    return data;
  },

  update: async (settingsData: Partial<Settings>): Promise<Settings> => {
    const { data } = await api.put("/settings", settingsData);
    return data;
  },

  toggleOrders: async (): Promise<Settings> => {
    const { data } = await api.patch("/settings/toggle-orders");
    return data;
  },
};

export default api;
