using backend.DTOs;

namespace backend.Services
{
    public interface ICartService
    {
        Task<CartResponseDto> GetCartAsync(int userId);
        Task<CartItemResponseDto> AddToCartAsync(int userId, CartAddDto cartDto);
        Task<CartItemResponseDto?> UpdateCartItemAsync(int userId, int cartItemId, CartUpdateDto updateDto);
        Task<bool> RemoveFromCartAsync(int userId, int cartItemId);
        Task<bool> ClearCartAsync(int userId);
    }
}
