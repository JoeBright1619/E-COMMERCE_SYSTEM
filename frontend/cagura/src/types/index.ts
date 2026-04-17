/* ==================== Authentication Types ==================== */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Client';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Client';
}

/* ==================== Product Types ==================== */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

/* ==================== Cart Types ==================== */
export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  cartTotal: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

/* ==================== API Response Envelope ==================== */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}
