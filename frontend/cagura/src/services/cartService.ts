import api from './api';
import type { CartAddDto, CartResponseDto, CartUpdateDto } from '../types';

export const cartService = {
  async getCart(): Promise<CartResponseDto> {
    return (await api.get('/cart')) as CartResponseDto;
  },

  async addItem(payload: CartAddDto): Promise<void> {
    await api.post('/cart', payload);
  },

  async updateItem(id: number, payload: CartUpdateDto): Promise<void> {
    await api.put(`/cart/${id}`, payload);
  },

  async removeItem(id: number): Promise<void> {
    await api.delete(`/cart/${id}`);
  },
};
