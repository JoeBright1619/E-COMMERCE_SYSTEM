using backend.DTOs;

namespace backend.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync(string? search = null, int? categoryId = null, bool? isActive = true);
        Task<ProductResponseDto?> GetProductByIdAsync(int id);
        Task<IEnumerable<ProductResponseDto>> GetProductsByCategoryAsync(int categoryId);
        Task<ProductResponseDto> CreateProductAsync(ProductCreateDto productDto);
        Task<ProductResponseDto?> UpdateProductAsync(int id, ProductUpdateDto productDto);
        Task<bool> DeleteProductAsync(int id);
    }
}
