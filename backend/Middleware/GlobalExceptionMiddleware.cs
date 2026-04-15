using System.Net;
using System.Text.Json;
using backend.DTOs;

namespace backend.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = exception switch
            {
                ArgumentException => CreateErrorResponse("Invalid argument provided", HttpStatusCode.BadRequest),
                InvalidOperationException => CreateErrorResponse("Invalid operation", HttpStatusCode.BadRequest),
                UnauthorizedAccessException => CreateErrorResponse("Unauthorized access", HttpStatusCode.Unauthorized),
                KeyNotFoundException => CreateErrorResponse("Resource not found", HttpStatusCode.NotFound),
                _ => CreateErrorResponse("An internal server error occurred", HttpStatusCode.InternalServerError)
            };

            context.Response.StatusCode = (int)response.StatusCode;
            
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response.ApiResponse, jsonOptions));
        }

        private static (ApiResponse ApiResponse, HttpStatusCode StatusCode) CreateErrorResponse(string message, HttpStatusCode statusCode)
        {
            var apiResponse = ApiResponse.ErrorResult(message);
            return (apiResponse, statusCode);
        }
    }
}
