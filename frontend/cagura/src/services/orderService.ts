import api from './api';
import type { OrderResponseDto, UpdateStatusDto } from '../types';

export const orderService = {
  async create(dto: { shippingAddress: string; paymentMethod?: string }): Promise<void> {
    await api.post('/orders', dto);
  },

  async getMyOrders(): Promise<OrderResponseDto[]> {
    return (await api.get('/orders/my')) as OrderResponseDto[];
  },

  async getAll(): Promise<OrderResponseDto[]> {
    return (await api.get('/orders')) as OrderResponseDto[];
  },

  async updateStatus(id: number, payload: UpdateStatusDto): Promise<void> {
    await api.put(`/orders/${id}/status`, payload);
  },
};
