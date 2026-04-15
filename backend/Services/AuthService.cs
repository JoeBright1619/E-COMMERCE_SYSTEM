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

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
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

            // Generate JWT token
            var token = GenerateJwtToken(createdUser);

            return new AuthResponseDto
            {
                Token = token,
                Email = createdUser.Email,
                Name = createdUser.Name,
                Role = createdUser.Role
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new InvalidOperationException("Invalid email or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new InvalidOperationException("Invalid email or password");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role
            };
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var issuer = jwtSettings["Issuer"] ?? "CaguraApi";
            var audience = jwtSettings["Audience"] ?? "CaguraClient";

            return JwtHelper.GenerateToken(user.Email, user.Name, user.Role, user.Id, secretKey, issuer, audience);
        }
    }
}
