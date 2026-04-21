using backend.Data;
using backend.Repositories;
using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartService _cartService;
        private readonly IProductRepository _productRepository;

        public OrderService(IOrderRepository orderRepository, ICartService cartService, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _cartService = cartService;
            _productRepository = productRepository;
        }

        public async Task<ApiResponse<OrderResponseDto>> CreateOrderAsync(int userId)
        {
            try
            {
                // Get user's cart
                var cart = await _cartService.GetCartAsync(userId);
                if (cart == null || !cart.Items.Any())
                {
                    return ApiResponse<OrderResponseDto>.ErrorResult("Cart is empty or not found");
                }

                // Create order from cart items
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Pending",
                    TotalAmount = cart.TotalAmount,
                    OrderItems = new List<OrderItem>()
                };

                // Convert cart items to order items and validate stock
                foreach (var cartItem in cart.Items)
                {
                    var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
                    if (product == null)
                    {
                        return ApiResponse<OrderResponseDto>.ErrorResult($"Product {cartItem.ProductId} not found");
                    }

                    if (product.StockQuantity < cartItem.Quantity)
                    {
                        return ApiResponse<OrderResponseDto>.ErrorResult($"Insufficient stock for product {product.Name}. Available: {product.StockQuantity}, Requested: {cartItem.Quantity}");
                    }

                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                        UnitPrice = product.Price // Snapshot price at time of order
                    });

                    // Update stock
                    product.StockQuantity -= cartItem.Quantity;
                    await _productRepository.UpdateAsync(product);
                }

                // Create the order
                var createdOrder = await _orderRepository.CreateAsync(order);

                // Clear the cart
                await _cartService.ClearCartAsync(userId);

                // Reload to get navigation properties
                var finalOrder = await _orderRepository.GetByIdAsync(createdOrder.Id);

                return ApiResponse<OrderResponseDto>.SuccessResult(MapToResponseDto(finalOrder!), "Order created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderResponseDto>.ErrorResult($"Failed to create order: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetUserOrdersAsync(int userId)
        {
            try
            {
                var orders = await _orderRepository.GetByUserIdAsync(userId);
                return ApiResponse<IEnumerable<OrderResponseDto>>.SuccessResult(orders.Select(MapToResponseDto));
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<OrderResponseDto>>.ErrorResult($"Failed to get orders: {ex.Message}");
            }
        }

        public async Task<ApiResponse<OrderResponseDto>> GetOrderByIdAsync(int orderId, int userId, string userRole)
        {
            try
            {
                var order = await _orderRepository.GetByIdAsync(orderId);
                if (order == null)
                {
                    return ApiResponse<OrderResponseDto>.ErrorResult("Order not found");
                }

                if (userRole != "Admin" && order.UserId != userId)
                {
                    return ApiResponse<OrderResponseDto>.ErrorResult("Access denied");
                }

                return ApiResponse<OrderResponseDto>.SuccessResult(MapToResponseDto(order));
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderResponseDto>.ErrorResult($"Failed to get order: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetAllOrdersAsync(string? status = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            try
            {
                var orders = await _orderRepository.GetAllAsync();
                
                var query = orders.AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(o => o.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate <= toDate.Value);
                }

                return ApiResponse<IEnumerable<OrderResponseDto>>.SuccessResult(query.ToList().Select(MapToResponseDto));
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<OrderResponseDto>>.ErrorResult($"Failed to get all orders: {ex.Message}");
            }
        }

        public async Task<ApiResponse<OrderResponseDto>> UpdateOrderStatusAsync(int orderId, string status)
        {
            try
            {
                var order = await _orderRepository.GetByIdAsync(orderId);
                if (order == null)
                {
                    return ApiResponse<OrderResponseDto>.ErrorResult("Order not found");
                }

                var validTransitions = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase)
                {
                    { "Pending", new List<string> { "Processing", "Cancelled" } },
                    { "Processing", new List<string> { "Shipped", "Cancelled" } },
                    { "Shipped", new List<string> { "Delivered", "Cancelled" } },
                    { "Delivered", new List<string>() },
                    { "Cancelled", new List<string>() }
                };

                if (!validTransitions.ContainsKey(order.Status) || !validTransitions[order.Status].Contains(status, StringComparer.OrdinalIgnoreCase))
                {
                    return ApiResponse<OrderResponseDto>.ErrorResult($"Invalid status transition from {order.Status} to {status}");
                }

                order.Status = status;
                await _orderRepository.UpdateAsync(order);

                return ApiResponse<OrderResponseDto>.SuccessResult(MapToResponseDto(order), "Order status updated");
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderResponseDto>.ErrorResult($"Failed to update order status: {ex.Message}");
            }
        }

        private static OrderResponseDto MapToResponseDto(Order order)
        {
            var orderItems = order.OrderItems.Select(oi => new OrderItemResponseDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? "Unknown",
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList();

            return new OrderResponseDto
            {
                OrderId = order.Id,
                UserId = order.UserId,
                CustomerName = order.User?.Name ?? "Customer",
                CreatedAt = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                Items = orderItems,
                ItemCount = orderItems.Sum(i => i.Quantity)
            };
        }
    }
}
