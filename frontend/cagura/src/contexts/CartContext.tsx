import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Cart, CartItem, AddToCartRequest } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Fetch cart when user logs in
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch cart.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    setError(null);
    try {
      const request: AddToCartRequest = { productId, quantity };
      await cartService.addToCart(request);
      await fetchCart(); // Refresh cart
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add item to cart.';
      setError(message);
      throw err;
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    setError(null);
    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update cart.';
      setError(message);
      throw err;
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (itemId: number) => {
    setError(null);
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to remove item.';
      setError(message);
      throw err;
    }
  }, [fetchCart]);

  const clearCart_ = useCallback(async () => {
    setError(null);
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to clear cart.';
      setError(message);
      throw err;
    }
  }, []);

  // Fetch cart when auth changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart: clearCart_,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
