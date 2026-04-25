import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import type { CartAddDto, CartItemResponseDto, CartResponseDto, CartUpdateDto } from '../types';

interface CartContextType {
  items: CartItemResponseDto[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItemResponseDto[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const applyCartState = useCallback((cart: CartResponseDto) => {
    setItems(cart.items);
    setItemCount(cart.totalItems);
    setTotalPrice(cart.totalAmount);
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setItemCount(0);
      setTotalPrice(0);
      return;
    }

    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      applyCartState(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load your cart');
    } finally {
      setIsLoading(false);
    }
  }, [applyCartState, isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    const existing = items.find(i => i.productId === productId);
    if (existing) {
      const remaining = existing.productStockQuantity - existing.quantity;
      if (remaining <= 0) {
        toast.error('You already have the maximum available quantity in your cart');
        return;
      }
      if (quantity > remaining) {
        toast.error(`Only ${remaining} more can be added (${existing.productStockQuantity} total available)`);
        return;
      }
    }

    try {
      const payload: CartAddDto = { productId, quantity };
      await cartService.addItem(payload);
      await fetchCart();
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to update your cart');
      return;
    }

    const item = items.find(i => i.id === cartItemId);
    if (item && quantity > item.productStockQuantity) {
      toast.error(`Only ${item.productStockQuantity} available`);
      return;
    }

    try {
      const payload: CartUpdateDto = { quantity };
      await cartService.updateItem(cartItemId, payload);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to update your cart');
      return;
    }

    try {
      await cartService.removeItem(cartItemId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => {
    setItems([]);
    setItemCount(0);
    setTotalPrice(0);
  };

  return (
    <CartContext.Provider value={{ 
      items, itemCount, totalPrice, isLoading, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
