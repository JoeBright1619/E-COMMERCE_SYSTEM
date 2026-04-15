using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(MapToResponseDto);
        }

        public async Task<CategoryResponseDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return category == null ? null : MapToResponseDto(category);
        }

        public async Task<CategoryResponseDto> CreateCategoryAsync(CategoryCreateDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description
            };

            var createdCategory = await _categoryRepository.CreateAsync(category);
            return MapToResponseDto(createdCategory);
        }

        public async Task<CategoryResponseDto?> UpdateCategoryAsync(int id, CategoryUpdateDto categoryDto)
        {
            var existingCategory = await _categoryRepository.GetByIdAsync(id);
            if (existingCategory == null) return null;

            existingCategory.Name = categoryDto.Name;
            existingCategory.Description = categoryDto.Description;

            var updatedCategory = await _categoryRepository.UpdateAsync(existingCategory);
            return MapToResponseDto(updatedCategory);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            return await _categoryRepository.DeleteAsync(id);
        }

        private static CategoryResponseDto MapToResponseDto(Category category)
        {
            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }
    }
}
