export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: 'prato' | 'sobremesa';
  isActive: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  type: 'prato' | 'sobremesa';
}

export interface Order {
  id: string;
  orderNumber: number;
  customerId: string;
  customer: Customer;
  deliveryType: 'entrega' | 'retirada';
  deliveryAddress?: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pendente' | 'confirmado' | 'cancelado';
  status: 'novo' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  observations?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyMenu {
  id: string;
  date: string;
  dish1Id: string;
  dish2Id: string;
  dessert1Id: string;
  dessert2Id: string;
  dishes: Product[];
  desserts: Product[];
  isActive: boolean;
  maxOrders: number;
  availableSlots?: number;
  ordersToday?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  pixCity: string;
  id: string;
  deliveryFee: number;
  pixKey: string;
  pixName: string;
  orderDeadline: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
  maxDailyOrders: number;
  isAcceptingOrders: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  type: 'prato' | 'sobremesa';
}

export interface CreateOrderData {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: {
    productId: string;
    quantity: number;
    type: 'prato' | 'sobremesa';
  }[];
  deliveryType: 'entrega' | 'retirada';
  observations?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
