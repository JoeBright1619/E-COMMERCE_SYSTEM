# `Helpers/` Directory

## What goes here?
**Small, reusable utility or integration classes.**
Examples: `JwtHelper.cs`, `CloudinaryService.cs`, `EmailService.cs`.

## Rules
1. **Self-Contained:** These classes should generally be self-contained tools with a single purpose.
2. **Not core business logic:** If the logic dictates app flow (like pricing logic), put it in `Services/`. If it's just "Here is a string, hash it using BCrypt", put it in `Helpers/`.
