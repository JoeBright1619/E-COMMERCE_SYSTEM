using backend.Models;

namespace backend.Repositories
{
    public interface ICartItemRepository
    {
        Task<IEnumerable<CartItem>> GetByUserIdAsync(int userId);
        Task<CartItem?> GetByUserAndProductAsync(int userId, int productId);
        Task<CartItem> CreateAsync(CartItem cartItem);
        Task<CartItem> UpdateAsync(CartItem cartItem);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteByUserAndProductAsync(int userId, int productId);
        Task<bool> ClearCartAsync(int userId);
    }
}
