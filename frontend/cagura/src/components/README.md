# `components/` Directory

## What goes here?
**Reusable UI pieces** that make up your application. 
Examples: `Button`, `Navbar`, `Footer`, `ProductCard`, `CartItem`, `Modal`.

## Rules
1. **Dumb components:** Components here should ideally be "dumb" or "presentational". They receive data via `props` and emit events via callbacks (`onClick`, `onChange`).
2. **No API calls:** A `ProductCard` should not call the backend. The Page or a higher-order Container should fetch the data and pass it to the `ProductCard`.
3. **Folders for complexity:** If a component is complex and has its own CSS, put it in a folder:
   ```
   components/
     ProductCard/
       index.tsx
       ProductCard.css
   ```
4. **Sub-grouping:** For a large project, group these by domain: `components/common/`, `components/layout/`, `components/shop/`.

## Why?
Keeps our UI consistent. If we need to change how a button looks across the entire app, we only update `components/common/Button.tsx`.
