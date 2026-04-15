using backend.DTOs;
using backend.Models;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;

        public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(MapToResponseDto);
        }

        public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            return product == null ? null : MapToResponseDto(product);
        }

        public async Task<IEnumerable<ProductResponseDto>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _productRepository.GetByCategoryAsync(categoryId);
            return products.Select(MapToResponseDto);
        }

        public async Task<ProductResponseDto> CreateProductAsync(ProductCreateDto productDto)
        {
            // Verify category exists
            var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException("Category not found");

            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                ImageUrl = productDto.ImageUrl,
                StockQuantity = productDto.StockQuantity,
                CategoryId = productDto.CategoryId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var createdProduct = await _productRepository.CreateAsync(product);
            return MapToResponseDto(createdProduct);
        }

        public async Task<ProductResponseDto?> UpdateProductAsync(int id, ProductUpdateDto productDto)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null) return null;

            existingProduct.Name = productDto.Name;
            existingProduct.Description = productDto.Description;
            existingProduct.Price = productDto.Price;
            existingProduct.ImageUrl = productDto.ImageUrl;
            existingProduct.StockQuantity = productDto.StockQuantity;
            existingProduct.IsActive = productDto.IsActive;

            var updatedProduct = await _productRepository.UpdateAsync(existingProduct);
            return MapToResponseDto(updatedProduct);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteAsync(id);
        }

        private static ProductResponseDto MapToResponseDto(Product product)
        {
            return new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                StockQuantity = product.StockQuantity,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? "Unknown"
            };
        }
    }
}
