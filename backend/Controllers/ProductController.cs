using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ICloudinaryService _cloudinaryService;

        public ProductController(IProductService productService, ICloudinaryService cloudinaryService)
        {
            _productService = productService;
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost("upload-image")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<string>>> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(ApiResponse<string>.ErrorResult("No file uploaded"));
                }

                var imageUrl = await _cloudinaryService.UploadImageAsync(file.OpenReadStream(), file.FileName);
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return StatusCode(500, ApiResponse<string>.ErrorResult("Image upload failed to return a valid URL"));
                }
                return Ok(ApiResponse<string>.SuccessResult(imageUrl, "Image uploaded successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResult($"Image upload failed: {ex.Message}"));
            }
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponseDto>>>> GetAllProducts(
            [FromQuery] string? search, 
            [FromQuery] int? categoryId, 
            [FromQuery] bool? isActive = true)
        {
            try
            {
                var products = await _productService.GetAllProductsAsync(search, categoryId, isActive);
                return Ok(ApiResponse<IEnumerable<ProductResponseDto>>.SuccessResult(products, "Products retrieved successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<ProductResponseDto>>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductResponseDto>>> GetProductById(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound(ApiResponse<ProductResponseDto>.ErrorResult($"Product with ID {id} not found"));
                }
                return Ok(ApiResponse<ProductResponseDto>.SuccessResult(product));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ProductResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<ProductResponseDto>>> CreateProduct([FromBody] ProductCreateDto productDto)
        {
            try
            {
                var product = await _productService.CreateProductAsync(productDto);
                return StatusCode(201, ApiResponse<ProductResponseDto>.SuccessResult(product, "Product created successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<ProductResponseDto>.ErrorResult(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ProductResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<ProductResponseDto>>> UpdateProduct(int id, [FromBody] ProductUpdateDto productDto)
        {
            try
            {
                var updatedProduct = await _productService.UpdateProductAsync(id, productDto);
                if (updatedProduct == null)
                {
                    return NotFound(ApiResponse<ProductResponseDto>.ErrorResult($"Product with ID {id} not found"));
                }
                return Ok(ApiResponse<ProductResponseDto>.SuccessResult(updatedProduct, "Product updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<ProductResponseDto>.ErrorResult(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ProductResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteProduct(int id)
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
