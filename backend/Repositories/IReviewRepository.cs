using backend.Models;

namespace backend.Repositories
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetByProductIdAsync(int productId);
        Task<IEnumerable<Review>> GetByUserIdAsync(int userId);
        Task<Review?> GetByIdAsync(int id);
        Task<Review?> GetByUserAndProductAsync(int userId, int productId);
        Task<Review> CreateAsync(Review review);
        Task<Review> UpdateAsync(Review review);
        Task<bool> DeleteAsync(int id);
    }
}
