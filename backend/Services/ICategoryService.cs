using backend.DTOs;

namespace backend.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<CategoryResponseDto?> GetCategoryByIdAsync(int id);
        Task<CategoryResponseDto> CreateCategoryAsync(CategoryCreateDto categoryDto);
        Task<CategoryResponseDto?> UpdateCategoryAsync(int id, CategoryUpdateDto categoryDto);
        Task<bool> DeleteCategoryAsync(int id);
    }
}
