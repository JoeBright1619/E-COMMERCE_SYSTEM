using backend.Data;
using backend.Repositories;
using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        public ReviewService(IReviewRepository reviewRepository, IProductRepository productRepository, IUserRepository userRepository)
        {
            _reviewRepository = reviewRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<ReviewResponseDto>> CreateReviewAsync(int userId, ReviewCreateDto reviewDto)
        {
            try
            {
                // Check if user already reviewed this product
                var existingReview = await _reviewRepository.GetByUserAndProductAsync(userId, reviewDto.ProductId);
                if (existingReview != null)
                {
                    return ApiResponse<ReviewResponseDto>.ErrorResult("You have already reviewed this product");
                }

                // Verify product exists
                var product = await _productRepository.GetByIdAsync(reviewDto.ProductId);
                if (product == null)
                {
                    return ApiResponse<ReviewResponseDto>.ErrorResult("Product not found");
                }

                // Create review
                var review = new Review
                {
                    ProductId = reviewDto.ProductId,
                    UserId = userId,
                    Rating = reviewDto.Rating,
                    Comment = reviewDto.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                var createdReview = await _reviewRepository.CreateAsync(review);
                var user = await _userRepository.GetByIdAsync(userId);

                // Map to response DTO
                var reviewResponse = new ReviewResponseDto
                {
                    ReviewId = createdReview.Id,
                    ProductId = createdReview.ProductId,
                    ProductName = product.Name,
                    ProductImageUrl = product.ImageUrl,
                    UserId = createdReview.UserId,
                    ReviewerName = user?.Name ?? "Unknown",
                    Rating = createdReview.Rating,
                    Comment = createdReview.Comment,
                    CreatedAt = createdReview.CreatedAt
                };

                return ApiResponse<ReviewResponseDto>.SuccessResult(reviewResponse, "Review created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<ReviewResponseDto>.ErrorResult($"Failed to create review: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ReviewResponseDto>> UpdateReviewAsync(int userId, int reviewId, ReviewUpdateDto reviewDto)
        {
            try
            {
                var review = await _reviewRepository.GetByIdAsync(reviewId);
                if (review == null)
                {
                    return ApiResponse<ReviewResponseDto>.ErrorResult("Review not found");
                }

                if (review.UserId != userId)
                {
                    return ApiResponse<ReviewResponseDto>.ErrorResult("Access denied");
                }

                // Update review
                review.Rating = reviewDto.Rating;
                review.Comment = reviewDto.Comment;
                review.CreatedAt = DateTime.UtcNow; // Updated date

                await _reviewRepository.UpdateAsync(review);

                // Get updated review with product info
                var updatedReview = await _reviewRepository.GetByIdAsync(reviewId);

                // Map to response DTO
                var reviewResponse = new ReviewResponseDto
                {
                    ReviewId = updatedReview.Id,
                    ProductId = updatedReview.ProductId,
                    ProductName = updatedReview.Product?.Name ?? "Unknown",
                    ProductImageUrl = updatedReview.Product?.ImageUrl,
                    UserId = updatedReview.UserId,
                    ReviewerName = updatedReview.User?.Name ?? "Unknown",
                    Rating = updatedReview.Rating,
                    Comment = updatedReview.Comment,
                    CreatedAt = updatedReview.CreatedAt
                };

                return ApiResponse<ReviewResponseDto>.SuccessResult(reviewResponse, "Review updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<ReviewResponseDto>.ErrorResult($"Failed to update review: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteReviewAsync(int userId, int reviewId)
        {
            try
            {
                var review = await _reviewRepository.GetByIdAsync(reviewId);
                if (review == null)
                {
                    return ApiResponse<bool>.ErrorResult("Review not found");
                }

                if (review.UserId != userId)
                {
                    return ApiResponse<bool>.ErrorResult("Access denied");
                }

                await _reviewRepository.DeleteAsync(reviewId);

                return ApiResponse<bool>.SuccessResult(true, "Review deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Failed to delete review: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ProductReviewListDto>> GetProductReviewsAsync(int productId)
        {
            try
            {
                var reviews = (await _reviewRepository.GetByProductIdAsync(productId)).ToList();
                var product = await _productRepository.GetByIdAsync(productId);
                
                if (product == null)
                {
                    return ApiResponse<ProductReviewListDto>.ErrorResult("Product not found");
                }

                var averageRating = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : 0;

                var result = new ProductReviewListDto
                {
                    ProductId = productId,
                    ProductName = product.Name,
                    AverageRating = averageRating,
                    ReviewCount = reviews.Count,
                    Reviews = reviews.Select(r => new ReviewResponseDto
                    {
                        ReviewId = r.Id,
                        ProductId = r.ProductId,
                        ProductName = product.Name,
                        ProductImageUrl = product.ImageUrl,
                        UserId = r.UserId,
                        ReviewerName = r.User?.Name ?? "Unknown",
                        Rating = r.Rating,
                        Comment = r.Comment,
                        CreatedAt = r.CreatedAt
                    })
                };

                return ApiResponse<ProductReviewListDto>.SuccessResult(result, "Reviews retrieved successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductReviewListDto>.ErrorResult($"Failed to get product reviews: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<ReviewResponseDto>>> GetUserReviewsAsync(int userId)
        {
            try
            {
                var reviews = await _reviewRepository.GetByUserIdAsync(userId);
                var user = await _userRepository.GetByIdAsync(userId);

                var reviewResponses = reviews.Select(r => new ReviewResponseDto
                {
                    ReviewId = r.Id,
                    ProductId = r.ProductId,
                    ProductName = r.Product?.Name ?? "Unknown",
                    ProductImageUrl = r.Product?.ImageUrl,
                    UserId = r.UserId,
                    ReviewerName = user?.Name ?? "Unknown",
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                });

                return ApiResponse<IEnumerable<ReviewResponseDto>>.SuccessResult(reviewResponses);
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<ReviewResponseDto>>.ErrorResult($"Failed to get user reviews: {ex.Message}");
            }
        }
    }
}
