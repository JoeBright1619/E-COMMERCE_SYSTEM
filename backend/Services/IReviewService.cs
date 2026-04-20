using backend.DTOs;

namespace backend.Services
{
    public interface IReviewService
    {
        Task<ApiResponse<ReviewResponseDto>> CreateReviewAsync(int userId, ReviewCreateDto reviewDto);
        Task<ApiResponse<ReviewResponseDto>> UpdateReviewAsync(int userId, int reviewId, ReviewUpdateDto reviewDto);
        Task<ApiResponse<bool>> DeleteReviewAsync(int userId, int reviewId);
        Task<ApiResponse<ProductReviewListDto>> GetProductReviewsAsync(int productId);
        Task<ApiResponse<IEnumerable<ReviewResponseDto>>> GetUserReviewsAsync(int userId);
    }
}
