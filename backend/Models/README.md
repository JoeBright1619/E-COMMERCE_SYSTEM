# `Models/` Directory

## What goes here?
**Entity Classes representing Database Tables.**
Examples: `User.cs`, `Product.cs`, `Order.cs`, `CartItem.cs`.

## Rules
1. **No Logic:** These are plain C# objects (POCOs) containing properties mapped to database columns.
2. **Navigation Properties:** Use `virtual` properties for EF Core relationships (e.g., `public virtual Category Category { get; set; }`).
3. **Don't return these in APIs:** Never return these directly from a Controller to the client. This exposes DB structures and navigation properties. Map them to `DTOs/` first.
