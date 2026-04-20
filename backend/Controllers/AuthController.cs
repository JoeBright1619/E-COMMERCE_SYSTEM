using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register(RegisterRequestDto request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return StatusCode(201, ApiResponse<AuthResponseDto>.SuccessResult(result, "Registration successful"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResult(ex.Message));
            }
            catch
            {
                return StatusCode(500, ApiResponse<AuthResponseDto>.ErrorResult("An error occurred during registration"));
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginRequestDto request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Login successful"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResult(ex.Message));
            }
            catch
            {
                return StatusCode(500, ApiResponse<AuthResponseDto>.ErrorResult("An error occurred during login"));
            }
        }

        [HttpGet("test")]
        [Authorize]
        public ActionResult<ApiResponse<string>> TestAuth()
        {
            var userEmail = User.Identity?.Name;
            var userRole = User.FindFirst("role")?.Value;
            
            return Ok(ApiResponse<string>.SuccessResult($"Hello {userEmail}! Your role is: {userRole}"));
        }
    }
}
