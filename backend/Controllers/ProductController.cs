using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponseDto>>>> GetAllProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(ApiResponse<IEnumerable<ProductResponseDto>>.SuccessResult(products));
            }
            catch
            {
                return StatusCode(500, ApiResponse<IEnumerable<ProductResponseDto>>.ErrorResult("An error occurred while fetching products"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductResponseDto>>> GetProduct(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound(ApiResponse<ProductResponseDto>.ErrorResult("Product not found"));
                }
                return Ok(ApiResponse<ProductResponseDto>.SuccessResult(product));
            }
            catch
            {
                return StatusCode(500, ApiResponse<ProductResponseDto>.ErrorResult("An error occurred while fetching the product"));
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponseDto>>>> GetProductsByCategory(int categoryId)
        {
            try
            {
                var products = await _productService.GetProductsByCategoryAsync(categoryId);
                return Ok(ApiResponse<IEnumerable<ProductResponseDto>>.SuccessResult(products));
            }
            catch
            {
                return StatusCode(500, ApiResponse<IEnumerable<ProductResponseDto>>.ErrorResult("An error occurred while fetching products by category"));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<ProductResponseDto>>> CreateProduct(ProductCreateDto productDto)
        {
            try
            {
                var product = await _productService.CreateProductAsync(productDto);
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, ApiResponse<ProductResponseDto>.SuccessResult(product, "Product created successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<ProductResponseDto>.ErrorResult(ex.Message));
            }
            catch
            {
                return StatusCode(500, ApiResponse<ProductResponseDto>.ErrorResult("An error occurred while creating the product"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<ProductResponseDto>>> UpdateProduct(int id, ProductUpdateDto productDto)
        {
            try
            {
                var product = await _productService.UpdateProductAsync(id, productDto);
                if (product == null)
                {
                    return NotFound(ApiResponse<ProductResponseDto>.ErrorResult("Product not found"));
                }
                return Ok(ApiResponse<ProductResponseDto>.SuccessResult(product, "Product updated successfully"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<ProductResponseDto>.ErrorResult("An error occurred while updating the product"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteProduct(int id)
        {
            try
            {
                var result = await _productService.DeleteProductAsync(id);
                if (!result)
                {
                    return NotFound(ApiResponse<string>.ErrorResult("Product not found"));
                }
                return Ok(ApiResponse<string>.SuccessResult("Product deleted successfully"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<string>.ErrorResult("An error occurred while deleting the product"));
            }
        }
    }
}
