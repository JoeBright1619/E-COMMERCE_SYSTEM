import type { ProductResponseDto } from '../types';

const NEW_PRODUCT_WINDOW_DAYS = 30;

export function isProductNew(createdAt: string, now: Date = new Date()): boolean {
  const createdTime = Date.parse(createdAt);

  if (Number.isNaN(createdTime)) {
    return false;
  }

  const ageMs = now.getTime() - createdTime;
  return ageMs >= 0 && ageMs <= NEW_PRODUCT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export function withDerivedProductFields(product: ProductResponseDto): ProductResponseDto & { isNew: boolean } {
  return {
    ...product,
    isNew: isProductNew(product.createdAt),
  };
}
