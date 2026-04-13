# `pages/` Directory

## What goes here?
**Top-level views or routes** in the application. 
Examples: `Home.tsx`, `Login.tsx`, `Cart.tsx`, `ProductDetail.tsx`, `Checkout.tsx`.

## Rules
1. **Routing:** Each file in here should generally map exactly to a Route in our React Router configuration.
2. **State & Orchestration:** Pages are responsible for fetching data from `services/` (usually triggered by a `useEffect` or via a library like React Query) and coordinating `components/`.
3. **Don't get too fat:** If a page file is getting massively long, you likely need to extract pieces of the UI into `src/components/`.

## Migration from Legacy
Your job is to look at the legacy HTML files (`legacy/frontend/*.html`), and recreate those screens here. The `<nav>` and `<footer>` should NOT be duplicated in every page; they should be in an overarching App layout shell.
