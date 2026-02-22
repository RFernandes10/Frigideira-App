import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { ReactNode } from 'react';
import { Product } from '@/types';

// Mock do react-hot-toast para não dar erro nos testes
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct: Product = {
  id: '1',
  name: 'Bife Acebolado',
  description: 'Bife com cebola',
  price: 18.0,
  category: 'prato',
  isActive: true,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockDessert: Product = {
  id: '2',
  name: 'Pudim',
  description: 'Pudim de leite',
  price: 5.0,
  category: 'sobremesa',
  isActive: true,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should start with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it('should add a dish to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 'prato');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.name).toBe('Bife Acebolado');
    expect(result.current.total).toBe(18.0);
  });

  it('should increase quantity if item already exists', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 'prato');
    });
    
    act(() => {
      result.current.addItem(mockProduct, 'prato');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.total).toBe(36.0);
  });

  it('should calculate total correctly with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 'prato'); // 18.0
    });
    
    act(() => {
      result.current.addItem(mockDessert, 'sobremesa'); // 5.0
    });

    expect(result.current.total).toBe(23.0);
    expect(result.current.itemsCount).toBe(2);
  });

  it('should respect the limit of 2 different dishes', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const dish2 = { ...mockProduct, id: 'dish2', name: 'Prato 2' };
    const dish3 = { ...mockProduct, id: 'dish3', name: 'Prato 3' };

    act(() => {
      result.current.addItem(mockProduct, 'prato');
    });
    act(() => {
      result.current.addItem(dish2, 'prato');
    });
    act(() => {
      result.current.addItem(dish3, 'prato');
    });

    expect(result.current.items).toHaveLength(2);
  });

  it('should remove items correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 'prato');
    });
    
    act(() => {
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });
});
