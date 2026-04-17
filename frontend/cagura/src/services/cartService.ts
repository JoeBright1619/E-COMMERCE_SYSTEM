import { apiClient } from './apiClient';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, ApiResponse } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data!;
  },

  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    const response = await apiClient.post<ApiResponse<CartItem>>('/cart', data);
    return response.data.data!;
  },

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    const response = await apiClient.put<ApiResponse<CartItem>>(`/cart/${itemId}`, { quantity });
    return response.data.data!;
  },

  async removeFromCart(itemId: number): Promise<void> {
    await apiClient.delete(`/cart/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await apiClient.delete('/cart');
  },
};
