using backend.Models;

namespace backend.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetByUserIdAsync(int userId);
        Task<Order?> GetByIdAsync(int id);
        Task<Order> CreateAsync(Order order);
        Task<Order> UpdateAsync(Order order);
        Task<IEnumerable<OrderItem>> GetOrderItemsAsync(int orderId);
        Task<IEnumerable<Order>> GetAllAsync();
    }
}
