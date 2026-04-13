# `utils/` Directory

## What goes here?
**Shared helper functions** and utility constants that don't belong in a specific component.

## Rules
1. **Pure Functions:** Utilities should ideally be "pure functions". They take inputs, do some formatting or calculation, and return outputs. They should not rely on global state or React hooks.
2. **Examples:** 
   - `formatCurrency(amount: number): string`
   - `formatDate(isoDate: string): string`
   - `validators.isValidEmail(email: string): boolean`
3. **No UI Logic:** Do not put React Components or JSX into this folder.
