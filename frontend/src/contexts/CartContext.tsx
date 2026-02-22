import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartContextData {
  items: CartItem[];
  addItem: (product: Product, type: 'prato' | 'sobremesa') => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemsCount: number;
  hasDish: boolean;
  hasDessert: boolean;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('@frigideira:cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('@frigideira:cart', JSON.stringify(items));
  }, [items]);

  const hasDish = items.some(item => item.type === 'prato');
  const hasDessert = items.some(item => item.type === 'sobremesa');

  const addItem = (product: Product, type: 'prato' | 'sobremesa') => {
    const existingItem = items.find(item => item.product.id === product.id);

    // Se o item já existe, apenas aumenta a quantidade
    if (existingItem) {
      setItems(items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success('Quantidade atualizada!');
      return;
    }

    // Se for um item novo, aplica as regras
    if (type === 'prato') {
      const dishCount = items.filter(item => item.type === 'prato').length;
      if (dishCount >= 2) {
        toast.error('Você já pode escolher até dois pratos. Remova um para adicionar outro.');
        return;
      }
    }

    if (type === 'sobremesa') {
      const dessertCount = items.filter(item => item.type === 'sobremesa').length;
      if (dessertCount >= 2) {
        toast.error('Você já pode escolher até duas sobremesas. Remova uma para adicionar outra.');
        return;
      }
    }

    // Adiciona o novo item
    setItems([...items, { product, quantity: 1, type }]);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.product.id !== productId));
    toast.success('Item removido do carrinho');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(items.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Carrinho limpo');
  };

  const total = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemsCount,
        hasDish,
        hasDessert,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
