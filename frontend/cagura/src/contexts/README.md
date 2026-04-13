# `contexts/` & `hooks/` Directories

## Contexts (`contexts/`)
**React Context Providers** for managing global state.
Examples: `AuthContext.tsx`, `CartContext.tsx`.

In the legacy app, user session and cart data were directly modified in `localStorage` by UI scripts. In React, we use Context so that when the cart changes, the nav bar badge updates automatically without manual DOM manipulation.

Providers should wrap the relevant parts of the application tree in `App.tsx` or `main.tsx`.

## Hooks (`hooks/`)
**Custom React Hooks** that encapsulate reusable state or logic.
Examples: `useAuth()`, `useCart()`, `useDebounce()`.

If you write a Context, always write a custom hook companion to consume it cleanly. It prevents developers from having to import `useContext` and the Context object manually everywhere.

```tsx
// hooks/useAuth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
```
