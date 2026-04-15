using backend.DTOs;

namespace backend.Services
{
    public interface ICartService
    {
        Task<CartResponseDto> GetCartAsync(int userId);
        Task<CartItemResponseDto> AddToCartAsync(int userId, CartAddDto cartDto);
        Task<CartItemResponseDto?> UpdateCartItemAsync(int userId, int productId, CartUpdateDto updateDto);
        Task<bool> RemoveFromCartAsync(int userId, int productId);
        Task<bool> ClearCartAsync(int userId);
    }
}
