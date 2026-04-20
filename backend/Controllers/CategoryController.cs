using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<CategoryResponseDto>>>> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Ok(ApiResponse<IEnumerable<CategoryResponseDto>>.SuccessResult(categories));
            }
            catch
            {
                return StatusCode(500, ApiResponse<IEnumerable<CategoryResponseDto>>.ErrorResult("An error occurred while fetching categories"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> GetCategory(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return NotFound(ApiResponse<CategoryResponseDto>.ErrorResult("Category not found"));
                }
                return Ok(ApiResponse<CategoryResponseDto>.SuccessResult(category));
            }
            catch
            {
                return StatusCode(500, ApiResponse<CategoryResponseDto>.ErrorResult("An error occurred while fetching the category"));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> CreateCategory(CategoryCreateDto categoryDto)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(categoryDto);
                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, ApiResponse<CategoryResponseDto>.SuccessResult(category, "Category created successfully"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<CategoryResponseDto>.ErrorResult("An error occurred while creating the category"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> UpdateCategory(int id, CategoryUpdateDto categoryDto)
        {
            try
            {
                var category = await _categoryService.UpdateCategoryAsync(id, categoryDto);
                if (category == null)
                {
                    return NotFound(ApiResponse<CategoryResponseDto>.ErrorResult("Category not found"));
                }
                return Ok(ApiResponse<CategoryResponseDto>.SuccessResult(category, "Category updated successfully"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<CategoryResponseDto>.ErrorResult("An error occurred while updating the category"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteCategory(int id)
        {
            try
            {
                var result = await _categoryService.DeleteCategoryAsync(id);
                if (!result)
                {
                    return NotFound(ApiResponse<string>.ErrorResult("Category not found"));
                }
                return Ok(ApiResponse<string>.SuccessResult("Category deleted successfully"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<string>.ErrorResult("An error occurred while deleting the category"));
            }
        }
    }
}
