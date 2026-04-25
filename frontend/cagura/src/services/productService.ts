import api from './api';
import type { ProductCreateDto, ProductResponseDto, ProductUpdateDto } from '../types';

export const productService = {
  async getAll(params?: { search?: string; categoryId?: number; isActive?: boolean }): Promise<ProductResponseDto[]> {
    return (await api.get('/products', { params })) as ProductResponseDto[];
  },

  async getById(id: number): Promise<ProductResponseDto> {
    return (await api.get(`/products/${id}`)) as ProductResponseDto;
  },

  async create(payload: ProductCreateDto): Promise<ProductResponseDto> {
    return (await api.post('/products', payload)) as ProductResponseDto;
  },

  async update(id: number, payload: ProductUpdateDto): Promise<ProductResponseDto> {
    return (await api.put(`/products/${id}`, payload)) as ProductResponseDto;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
