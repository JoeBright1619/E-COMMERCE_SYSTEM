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

        public async Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync(string? search = null, int? categoryId = null, bool? isActive = true)
        {
            var products = await _productRepository.GetAllAsync();
            
            var query = products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(lowerSearch) || 
                                       (p.Description != null && p.Description.ToLower().Contains(lowerSearch)));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (isActive.HasValue)
            {
                query = query.Where(p => p.IsActive == isActive.Value);
            }

            return query.Select(MapToResponseDto);
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

            // Partial update logic
            if (productDto.Name != null) existingProduct.Name = productDto.Name;
            if (productDto.Description != null) existingProduct.Description = productDto.Description;
            if (productDto.Price.HasValue) existingProduct.Price = productDto.Price.Value;
            if (productDto.ImageUrl != null) existingProduct.ImageUrl = productDto.ImageUrl;
            if (productDto.StockQuantity.HasValue) existingProduct.StockQuantity = productDto.StockQuantity.Value;
            if (productDto.IsActive.HasValue) existingProduct.IsActive = productDto.IsActive.Value;
            
            if (productDto.CategoryId.HasValue)
            {
                var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId.Value);
                if (category == null) throw new InvalidOperationException("Category not found");
                existingProduct.CategoryId = productDto.CategoryId.Value;
            }

            var updatedProduct = await _productRepository.UpdateAsync(existingProduct);
            return MapToResponseDto(updatedProduct);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteAsync(id);
        }

        private static ProductResponseDto MapToResponseDto(Product product)
        {
            var reviews = product.Reviews?.ToList() ?? new List<Review>();
            var averageRating = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : 0;

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
                CategoryName = product.Category?.Name ?? "Unknown",
                AverageRating = averageRating,
                ReviewCount = reviews.Count
            };
        }
    }
}
