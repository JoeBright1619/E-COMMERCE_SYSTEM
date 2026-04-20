using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateOrder()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _orderService.CreateOrderAsync(userId);
                if (result.Success)
                {
                    return CreatedAtAction(nameof(GetOrderById), new { id = result.Data?.OrderId }, result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<OrderResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetUserOrders()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _orderService.GetUserOrdersAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<OrderResponseDto>>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetOrderById(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "Client";
                
                var result = await _orderService.GetOrderByIdAsync(id, userId, userRole);
                if (result.Success)
                {
                    return Ok(result);
                }
                return NotFound(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<OrderResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders([FromQuery] string? status, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            try
            {
                var result = await _orderService.GetAllOrdersAsync(status, from, to);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<OrderResponseDto>>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusDto statusDto)
        {
            try
            {
                if (string.IsNullOrEmpty(statusDto.Status))
                {
                    return BadRequest("Status is required");
                }

                var result = await _orderService.UpdateOrderStatusAsync(id, statusDto.Status);
                if (result.Success)
                {
                    return Ok(result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<OrderResponseDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new InvalidOperationException("Invalid user token");
            }
            return userId;
        }
    }
}
