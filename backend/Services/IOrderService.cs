using backend.DTOs;

namespace backend.Services
{
    public interface IOrderService
    {
        Task<ApiResponse<OrderResponseDto>> CreateOrderAsync(int userId);
        Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetUserOrdersAsync(int userId);
        Task<ApiResponse<OrderResponseDto>> GetOrderByIdAsync(int orderId, int userId, string userRole);
        Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetAllOrdersAsync(string? status = null, DateTime? fromDate = null, DateTime? toDate = null); // Admin only
        Task<ApiResponse<OrderResponseDto>> UpdateOrderStatusAsync(int orderId, string status);
    }
}
