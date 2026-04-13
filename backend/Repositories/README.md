# `Repositories/` Directory

## What goes here?
**Data Access Abstractions.**
Examples: `IProductRepository.cs`, `ProductRepository.cs`.

## Rules
1. **EF Core Isolation:** This is the ONLY layer that is allowed to inject `AppDbContext` and write Entity Framework LINQ queries.
2. **Simple CRUD:** Keep repository methods simple. `GetByIdAsync()`, `AddAsync()`, `SaveChangesAsync()`.
3. **Why do we use this?** By abstracting EF Core, our `Services/` layer becomes incredibly easy to unit test using Mocks, and if we ever move queries to raw SQL (Dapper) for performance, we only change things here.
