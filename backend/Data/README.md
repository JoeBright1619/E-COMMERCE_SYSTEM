# `Data/` Directory

## What goes here?
**Entity Framework Core Context & Seeding Logic.**
Examples: `AppDbContext.cs`, `DbInitializer.cs`.

## Rules
1. **`AppDbContext` Configuration:** Put your `DbSet<T>` properties and `protected override void OnModelCreating` configuration here.
2. **Migrations:** When you run `dotnet ef migrations add`, the generated migration files will automatically be placed in a `Migrations/` folder adjacent to this. Do not edit those generated files.
3. **Seeding:** Write scripts to insert the `Admin` role/user and mock product data in `DbInitializer.cs`.
