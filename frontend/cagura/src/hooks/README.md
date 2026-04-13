# `hooks/` Directory

## What goes here?
**Custom React Hooks** (`useSomething`).

Custom hooks allow you to extract complex state logic out of your UI components so it can be reused or simply kept organized.

## Common Examples
1. **Context Consumers:** Wrappers around `useContext` to ensure safe consumption (e.g., `useAuth()`, `useCart()`). See `contexts/README.md`.
2. **UI Logic:** `useDebounce(value, delay)`, `useWindowSize()`, `useOnClickOutside()`.
3. **Data Fetching:** Abstracting away `useEffect` data fetching logic (e.g., `useProducts()`) if you aren't using a data-fetching library like React Query or SWR.
