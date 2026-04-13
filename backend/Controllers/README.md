# `Controllers/` Directory

## What goes here?
**ASP.NET Core API Controllers**.
Examples: `AuthController.cs`, `ProductsController.cs`, `OrdersController.cs`.

## Rules
1. **No Business Logic:** Controllers should be extremely thin. Their only job is to:
   - Accept the incoming HTTP Request (with DTOs).
   - Call a method in the `Services/` layer.
   - Return the correct HTTP Response Code (200 OK, 201 Created, 400 Bad Request, 404 Not Found) wrapped in our standard API Envelope.
2. **Authorization Enforcement:** This is where `[Authorize]` and `[Authorize(Roles = "Admin")]` annotations go.
3. **Route standard:** Always use `[Route("api/[controller]")]`.
