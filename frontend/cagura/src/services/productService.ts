import { apiClient } from './apiClient';
import { Product, Category, ApiResponse } from '../types';

export const productService = {
  async getAllProducts(categoryId?: number, search?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', String(categoryId));
    if (search) params.append('search', search);

    const queryString = params.toString();
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products${queryString ? `?${queryString}` : ''}`
    );
    return response.data.data || [];
  },

  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data.data || [];
  },
};
