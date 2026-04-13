# `DTOs/` Directory

## What goes here?
**Data Transfer Objects.** The shape of incoming requests and outgoing responses.
Examples: `LoginRequestDto.cs`, `ProductResponseDto.cs`, `ApiResponse.cs`.

## Rules
1. **Validation:** Use Data Annotations (`[Required]`, `[MinLength(5)]`, `[Range(1, 5)]`) on incoming Request DTO properties to let ASP.NET handle validation automatically.
2. **Flat structures usually:** Response DTOs should ideally be flattened arrays/objects suited for the frontend.
3. **Standard Envelope:** Make sure all outgoing data is wrapped in the standard `ApiResponse` generic class defined here.
