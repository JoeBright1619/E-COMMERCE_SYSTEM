import api from './api';
import type { CategoryCreateDto, CategoryResponseDto, CategoryUpdateDto } from '../types';

export const categoryService = {
  async getAll(): Promise<CategoryResponseDto[]> {
    return (await api.get('/categories')) as CategoryResponseDto[];
  },

  async create(payload: CategoryCreateDto): Promise<CategoryResponseDto> {
    return (await api.post('/categories', payload)) as CategoryResponseDto;
  },

  async update(id: number, payload: CategoryUpdateDto): Promise<CategoryResponseDto> {
    return (await api.put(`/categories/${id}`, payload)) as CategoryResponseDto;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
