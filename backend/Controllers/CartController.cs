using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<CartResponseDto>>> GetCart()
        {
            try
            {
                var userId = GetCurrentUserId();
                var cart = await _cartService.GetCartAsync(userId);
                return Ok(ApiResponse<CartResponseDto>.SuccessResult(cart));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<CartResponseDto>.ErrorResult(ex.Message));
            }
            catch
            {
                return StatusCode(500, ApiResponse<CartResponseDto>.ErrorResult("An error occurred while fetching the cart"));
            }
        }

        [HttpPost("add")]
        public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> AddToCart(CartAddDto cartDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _cartService.AddToCartAsync(userId, cartDto);
                return Ok(ApiResponse<CartItemResponseDto>.SuccessResult(cartItem, "Item added to cart successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<CartItemResponseDto>.ErrorResult(ex.Message));
            }
            catch
            {
                return StatusCode(500, ApiResponse<CartItemResponseDto>.ErrorResult("An error occurred while adding item to cart"));
            }
        }

        [HttpPut("update/{productId}")]
        public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> UpdateCartItem(int productId, CartUpdateDto updateDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _cartService.UpdateCartItemAsync(userId, productId, updateDto);
                if (cartItem == null)
                {
                    return NotFound(ApiResponse<CartItemResponseDto>.ErrorResult("Cart item not found"));
                }
                return Ok(ApiResponse<CartItemResponseDto>.SuccessResult(cartItem, "Cart item updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<CartItemResponseDto>.ErrorResult(ex.Message));
            }
            catch
            {
                return StatusCode(500, ApiResponse<CartItemResponseDto>.ErrorResult("An error occurred while updating cart item"));
            }
        }

        [HttpDelete("remove/{productId}")]
        public async Task<ActionResult<ApiResponse<string>>> RemoveFromCart(int productId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _cartService.RemoveFromCartAsync(userId, productId);
                if (!result)
                {
                    return NotFound(ApiResponse<string>.ErrorResult("Cart item not found"));
                }
                return Ok(ApiResponse<string>.SuccessResult("Item removed from cart successfully"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<string>.ErrorResult("An error occurred while removing item from cart"));
            }
        }

        [HttpDelete("clear")]
        public async Task<ActionResult<ApiResponse<string>>> ClearCart()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _cartService.ClearCartAsync(userId);
                if (!result)
                {
                    return NotFound(ApiResponse<string>.ErrorResult("Cart is already empty"));
                }
                return Ok(ApiResponse<string>.SuccessResult("Cart cleared successfully"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<string>.ErrorResult("An error occurred while clearing cart"));
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new InvalidOperationException("User ID not found in token");
            }
            return userId;
        }
    }
}
