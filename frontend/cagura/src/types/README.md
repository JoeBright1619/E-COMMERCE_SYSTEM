# `types/` Directory

## What goes here?
**TypeScript interfaces and types** that define the shape of your data.

## Rules
1. **Match the backend:** The types defined here should perfectly map to the JSON shapes returned by our ASP.NET Core API. (e.g., `interface Product`, `interface User`).
2. **Centralized Definitions:** If a data model is used across multiple components or services, define it here and export it. Do not define `interface Product` randomly at the top of 5 different component files.
3. **No logic:** This folder should strictly contain `.ts` files with type definitions and `export` statements. No runtime logic.
