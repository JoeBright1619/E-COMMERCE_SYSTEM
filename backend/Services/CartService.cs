using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class CartService : ICartService
    {
        private readonly ICartItemRepository _cartItemRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        public CartService(ICartItemRepository cartItemRepository, IProductRepository productRepository, IUserRepository userRepository)
        {
            _cartItemRepository = cartItemRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        public async Task<CartResponseDto> GetCartAsync(int userId)
        {
            // Verify user exists
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var cartItems = await _cartItemRepository.GetByUserIdAsync(userId);
            var itemDtos = cartItems.Select(MapToCartItemResponseDto);

            return new CartResponseDto
            {
                Items = itemDtos,
                TotalItems = itemDtos.Sum(i => i.Quantity),
                TotalAmount = itemDtos.Sum(i => i.Subtotal)
            };
        }

        public async Task<CartItemResponseDto> AddToCartAsync(int userId, CartAddDto cartDto)
        {
            // Verify user and product exist
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var product = await _productRepository.GetByIdAsync(cartDto.ProductId);
            if (product == null || !product.IsActive)
                throw new InvalidOperationException("Product not found or inactive");

            if (product.StockQuantity < cartDto.Quantity)
                throw new InvalidOperationException("Insufficient stock");

            // Check if item already exists in cart
            var existingCartItem = await _cartItemRepository.GetByUserAndProductAsync(userId, cartDto.ProductId);

            if (existingCartItem != null)
            {
                // Update quantity
                int newQuantity = existingCartItem.Quantity + cartDto.Quantity;
                if (product.StockQuantity < newQuantity)
                    throw new InvalidOperationException($"Insufficient stock. Only {product.StockQuantity} available, and you already have {existingCartItem.Quantity} in cart.");

                existingCartItem.Quantity = newQuantity;
                var updatedItem = await _cartItemRepository.UpdateAsync(existingCartItem);
                return MapToCartItemResponseDto(updatedItem);
            }
            else
            {
                // Add new item
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = cartDto.ProductId,
                    Quantity = cartDto.Quantity,
                    AddedAt = DateTime.UtcNow
                };

                var createdItem = await _cartItemRepository.CreateAsync(cartItem);
                return MapToCartItemResponseDto(createdItem);
            }
        }

        public async Task<CartItemResponseDto?> UpdateCartItemAsync(int userId, int cartItemId, CartUpdateDto updateDto)
        {
            var cartItems = await _cartItemRepository.GetByUserIdAsync(userId);
            var cartItem = cartItems.FirstOrDefault(ci => ci.Id == cartItemId);
            if (cartItem == null) return null;

            // Check if product has enough stock
            var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
            if (product != null && product.StockQuantity < updateDto.Quantity)
                throw new InvalidOperationException("Insufficient stock");

            cartItem.Quantity = updateDto.Quantity;
            var updatedItem = await _cartItemRepository.UpdateAsync(cartItem);
            return MapToCartItemResponseDto(updatedItem);
        }

        public async Task<bool> RemoveFromCartAsync(int userId, int cartItemId)
        {
            var cartItems = await _cartItemRepository.GetByUserIdAsync(userId);
            var cartItem = cartItems.FirstOrDefault(ci => ci.Id == cartItemId);
            if (cartItem == null) return false;

            return await _cartItemRepository.DeleteAsync(cartItemId);
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            return await _cartItemRepository.ClearCartAsync(userId);
        }

        private static CartItemResponseDto MapToCartItemResponseDto(CartItem cartItem)
        {
            return new CartItemResponseDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product?.Name ?? "Unknown",
                ProductDescription = cartItem.Product?.Description,
                ProductPrice = cartItem.Product?.Price ?? 0,
                ProductImageUrl = cartItem.Product?.ImageUrl,
                ProductStockQuantity = cartItem.Product?.StockQuantity ?? 0,
                Quantity = cartItem.Quantity,
                Subtotal = (cartItem.Product?.Price ?? 0) * cartItem.Quantity,
                AddedAt = cartItem.AddedAt
            };
        }
    }
}
