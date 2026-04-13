# CAGURA Backend Guide & Best Practices

Welcome to the backend project for **CAGURA**! This is an ASP.NET Core Web API built with C# and Entity Framework Core (SQL Server).

Our architecture is strictly broken down into 4 main layers to ensure Separation of Concerns. This makes testing, maintaining, and scaling the codebase far easier. 

## 📂 Project Structure

This project uses standard ASP.NET Core directory structures mixed with layered architecture conventions. **Do not place code directly in the root directory.**

| Directory | Purpose |
| :--- | :--- |
| `Controllers/` | HTTP Endpoints. Responsible for routing, validating DTOs, and returning HTTP Status Codes. **No business logic here.** |
| `Services/` | The core Business Logic of our application. All calculations, rules, and orchestrations happen here. |
| `Repositories/` | Data Access Layer. Only this layer talks to EF Core (`DbContext`). Protects Services from raw LINQ. |
| `Models/` | C# Entity definitions that perfectly mirror the physical Database tables via EF Core. |
| `DTOs/` | Data Transfer Objects. We NEVER accept or return raw `Models/` entities over the API. We map them to DTOs. |
| `Data/` | The `AppDbContext`, and classes for seeding initial data. |
| `Middleware/` | Global HTTP pipeline handlers (e.g. Exception Handler, Authentication configuration). |
| `Helpers/` | Small reusable utilities (e.g. Password Hashing, JWT Generator). |

Each folder has a small `README.md` with rules to help you ensure you are putting the right code in the right place.

---

## 🛑 Essential Backend Best Practices

### 1. DTOs are Mandatory
Never accept a `Model` as a controller parameter, and never return a `Model` back to the user. Always use a DTO. This prevents mass-assignment vulnerabilities and hides internal DB structures.
```csharp
// BAD
public ActionResult<User> Register(User user) { ... }

// GOOD
public ActionResult<AuthResponseDto> Register(RegisterRequestDto request) { ... }
```

### 2. Dependency Injection
Use ASP.NET Core’s built-in DI container (`Program.cs`). Never use `new ()` to instantiate Services or Repositories.
```csharp
// In Program.cs
builder.Services.AddScoped<IProductService, ProductService>();

// In Controller
public ProductsController(IProductService productService) { ... }
```

### 3. Asynchronous Code Everywhere
For all DB calls or I/O operations, use `async/await`. Do not use `.Result` or `.Wait()`.
```csharp
// GOOD
var products = await _productRepository.GetAllAsync();
```

### 4. Code-First EF Core Migrations
Do not modify the database manually via SQL Server Management Studio.
1. Update classes in `Models/`.
2. Run `dotnet ef migrations add MeaningfulName`
3. Run `dotnet ef database update`

## 🚀 Getting Started
Check out `../docs/07-setup.md` for full instructions on configuring `appsettings.Development.json` and running this API localy. 
