import api from './api';
import type { ProductReviewListDto, ReviewCreateDto, ReviewResponseDto, ReviewUpdateDto } from '../types';

export const reviewService = {
  async getProductReviews(productId: number): Promise<ProductReviewListDto> {
    return (await api.get(`/products/${productId}/reviews`)) as ProductReviewListDto;
  },

  async create(payload: ReviewCreateDto): Promise<ReviewResponseDto> {
    return (await api.post('/reviews', payload)) as ReviewResponseDto;
  },

  async update(reviewId: number, payload: ReviewUpdateDto): Promise<ReviewResponseDto> {
    return (await api.put(`/reviews/${reviewId}`, payload)) as ReviewResponseDto;
  },

  async remove(reviewId: number): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  },

  async getMine(): Promise<ReviewResponseDto[]> {
    return (await api.get('/reviews/my')) as ReviewResponseDto[];
  },
};
