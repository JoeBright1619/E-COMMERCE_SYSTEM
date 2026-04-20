using backend.DTOs;
using backend.Helpers;
using backend.Models;
using backend.Repositories;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(
            IUserRepository userRepository, 
            IConfiguration configuration,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(request.Email))
            {
                throw new InvalidOperationException("Email already registered");
            }

            // Create new user
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Client",
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.CreateAsync(user);

            // Send welcome email
            try
            {
                await _emailService.SendEmailAsync(
                    createdUser.Email, 
                    "Welcome to CAGURA!", 
                    $"<h1>Welcome, {createdUser.Name}!</h1><p>Your account has been successfully created. Happy shopping!</p>");
            }
            catch
            {
                // Log error but don't fail registration
            }

            // Generate JWT token
            var expiryHours = _configuration.GetSection("JwtSettings").GetValue<int?>("ExpiryHours") ?? 24;
            var token = GenerateJwtToken(createdUser);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(expiryHours),
                User = MapToUserDto(createdUser)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new InvalidOperationException("Invalid email or password");
            }

            // Generate JWT token
            var expiryHours = _configuration.GetSection("JwtSettings").GetValue<int?>("ExpiryHours") ?? 24;
            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(expiryHours),
                User = MapToUserDto(user)
            };
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var issuer = jwtSettings["Issuer"] ?? "CaguraApi";
            var audience = jwtSettings["Audience"] ?? "CaguraClient";
            var expiryHours = jwtSettings.GetValue<int?>("ExpiryHours") ?? 24;

            return JwtHelper.GenerateToken(user.Email, user.Name, user.Role, user.Id, secretKey, issuer, audience, expiryHours);
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
