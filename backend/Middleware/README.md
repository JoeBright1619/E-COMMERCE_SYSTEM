# `Middleware/` Directory

## What goes here?
**Global ASP.NET HTTP Request Pipeline Interceptors.**
Examples: `GlobalExceptionMiddleware.cs`, `JwtMiddleware.cs` (if custom).

## Rules
1. **Global Error Handling:** Instead of writing `try/catch` in every single controller, we use a single global Exception Handling middleware here that catches any unhandled error and formats it into our JSON `ApiResponse` format with a 500 error code.
2. **Use in Program.cs:** Remember to register `app.UseMiddleware<GlobalExceptionMiddleware>()` in your `Program.cs`.
