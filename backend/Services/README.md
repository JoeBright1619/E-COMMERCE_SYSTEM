# `Services/` Directory

## What goes here?
**The Application's Brain (Business Logic).**
Examples: `IAuthService.cs`, `AuthService.cs`, `IProductService.cs`.

## Rules
1. **Interface First:** Always create an interface (e.g. `IOrderService`) and implement it in a class (`OrderService`). Register it in `Program.cs`.
2. **Orchestration:** A Service can inject multiple Repositories or even other Services. 
3. **Validations & Rules:** If a cart item quantity cannot be negative, or an order needs to lock price snapshots, that logic MUST live here, NOT in the controller.
4. **No DB Context:** Services should not interact directly with `AppDbContext`. They should ask `Repositories/` for data.
