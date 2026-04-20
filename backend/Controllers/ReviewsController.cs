using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("/api/products/{productId}/reviews")]
        public async Task<IActionResult> GetProductReviews(int productId)
        {
            try
            {
                var result = await _reviewService.GetProductReviewsAsync(productId);
                if (!result.Success)
                {
                    return NotFound(result);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ProductReviewListDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto reviewDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _reviewService.CreateReviewAsync(userId, reviewDto);
                if (result.Success)
                {
                    return StatusCode(201, result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ReviewResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPut("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] ReviewUpdateDto reviewDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _reviewService.UpdateReviewAsync(userId, reviewId, reviewDto);
                if (result.Success)
                {
                    return Ok(result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ReviewResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpDelete("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _reviewService.DeleteReviewAsync(userId, reviewId);
                if (result.Success)
                {
                    return Ok(result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetUserReviews()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _reviewService.GetUserReviewsAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<ReviewResponseDto>>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new InvalidOperationException("Invalid user token");
            }
            return userId;
        }
    }
}
