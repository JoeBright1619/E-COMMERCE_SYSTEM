// Common
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
}

// Auth
export interface RegisterRequestDto {
    name: string;
    email: string;
    password?: string;
}

export interface LoginRequestDto {
    email: string;
    password?: string;
}

export interface UserDto {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponseDto {
    token: string;
    expiresAt: string;
    user: UserDto;
}

// Product
export interface ProductCreateDto {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    stockQuantity: number;
    categoryId: number;
}

export interface ProductUpdateDto {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    stockQuantity?: number;
    isActive?: boolean;
    categoryId?: number;
}

export interface ProductResponseDto {
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    stockQuantity: number;
    isActive: boolean;
    createdAt: string;
    categoryId: number;
    categoryName: string;
    averageRating: number;
    reviewCount: number;
}

// Category
export interface CategoryCreateDto {
    name: string;
    description?: string;
}

export interface CategoryUpdateDto {
    name: string;
    description?: string;
}

export interface CategoryResponseDto {
    id: number;
    name: string;
    description: string | null;
}

// Cart
export interface CartAddDto {
    productId: number;
    quantity: number;
}

export interface CartUpdateDto {
    quantity: number;
}

export interface CartItemResponseDto {
    id: number;
    productId: number;
    productName: string;
    productDescription: string | null;
    productPrice: number;
    productImageUrl: string | null;
    productStockQuantity: number;
    quantity: number;
    subtotal: number;
    addedAt: string;
}

export interface CartResponseDto {
    items: CartItemResponseDto[];
    totalItems: number;
    totalAmount: number;
}

// Order
export interface OrderCreateDto {
    shippingAddress: string;
}

export interface OrderItemResponseDto {
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface OrderResponseDto {
    orderId: number;
    userId: number | null;
    customerName: string;
    totalAmount: number;
    status: string;
    shippingAddress: string;
    createdAt: string;
    itemCount: number;
    items: OrderItemResponseDto[];
}

export interface UpdateStatusDto {
    status: string;
}

// Review
export interface ReviewCreateDto {
    productId: number;
    rating: number;
    comment?: string;
}

export interface ReviewUpdateDto {
    rating: number;
    comment?: string;
}

export interface ReviewResponseDto {
    reviewId: number;
    productId: number;
    productName: string;
    productImageUrl: string | null;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string | null;
    userId: number;
    reviewerName: string;
}

export interface ProductReviewListDto {
    productId: number;
    productName: string;
    averageRating: number;
    reviewCount: number;
    reviews: ReviewResponseDto[];
}

// Report
export interface BestSellerDto {
    productName: string;
    quantitySold: number;
    totalRevenue: number;
}

export interface OrderStatusCountDto {
    status: string;
    count: number;
}

export interface DashboardStatsDto {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    topProducts: BestSellerDto[];
    ordersByStatus: OrderStatusCountDto[];
}

export interface DailyOrderSummaryDto {
    date: string;
    orderCount: number;
    revenue: number;
}

export interface OrderSummaryReportDto {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    ordersByStatus: OrderStatusCountDto[];
    dailySummary: DailyOrderSummaryDto[];
}
