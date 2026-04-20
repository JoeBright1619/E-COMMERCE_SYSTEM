using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/cart")]
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
                return Ok(ApiResponse<CartResponseDto>.SuccessResult(cart, "Cart retrieved successfully."));
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

        [HttpPost]
        public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> AddToCart(CartAddDto cartDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _cartService.AddToCartAsync(userId, cartDto);
                return StatusCode(201, ApiResponse<CartItemResponseDto>.SuccessResult(cartItem, "Item added to cart."));
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

        [HttpPut("{cartItemId}")]
        public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> UpdateCartItem(int cartItemId, CartUpdateDto updateDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _cartService.UpdateCartItemAsync(userId, cartItemId, updateDto);
                if (cartItem == null)
                {
                    return NotFound(ApiResponse<CartItemResponseDto>.ErrorResult($"Cart item with ID {cartItemId} was not found."));
                }
                return Ok(ApiResponse<CartItemResponseDto>.SuccessResult(cartItem, "Cart item updated."));
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

        [HttpDelete("{cartItemId}")]
        public async Task<ActionResult<ApiResponse<string>>> RemoveFromCart(int cartItemId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _cartService.RemoveFromCartAsync(userId, cartItemId);
                if (!result)
                {
                    return NotFound(ApiResponse<string>.ErrorResult($"Cart item with ID {cartItemId} was not found."));
                }
                return Ok(ApiResponse<string>.SuccessResult(null, "Item removed from cart."));
            }
            catch
            {
                return StatusCode(500, ApiResponse<string>.ErrorResult("An error occurred while removing item from cart"));
            }
        }

        [HttpDelete]
        public async Task<ActionResult<ApiResponse<string>>> ClearCart()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _cartService.ClearCartAsync(userId);
                return Ok(ApiResponse<string>.SuccessResult(null, "Cart cleared successfully."));
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
