# Frontend Development Guide & Best Practices

Welcome to the frontend codebase for CAGURA! This project is built using **React, Vite, and TypeScript**.

Our goal is to transition from our legacy prototype (HTML, vanilla JS, local storage) into a modern, scalable, and maintainable Single-Page Application (SPA). Because we are working as a team, it is critical that we follow a consistent structure and stick to best practices. 

This guide outlines how we structure our code, how we fetch data, and general rules to ensure code quality.

---

## 📂 Project Structure

Inside `src/`, you'll find a pre-defined folder structure. **Do not put files randomly in `src/`.** Every file belongs in one of these carefully purposed directories:

| Directory | Purpose |
| :--- | :--- |
| `assets/` | Static files like images, SVGs, global CSS, and fonts. |
| `components/` | Reusable UI components. Examples: `Button`, `Navbar`, `ProductCard`, `Footer`. They should NOT manage global state or talk to APIs directly. |
| `pages/` | Top-level route components. Examples: `Home`, `Login`, `Cart`, `ProductDetail`. Each page is responsible for fetching data and combining `components`. |
| `contexts/` | React Context providers for global state. Examples: `AuthContext`, `CartContext`. |
| `hooks/` | Custom React hooks. Examples: `useAuth()`, `useCart()`, `useDebounce()`. |
| `services/` | API calling logic. We use Axios. **Never use `fetch()` or `axios.get()` directly inside a component.** Put that logic here and export a service function. |
| `types/` | TypeScript interfaces and types. Keeps our data models consistent with the backend API. |
| `utils/` | Shared helper functions. Examples: `formatCurrency()`, `formatDate()`, `validators`. |

Check the `README.md` file inside each directory for more specific rules and examples.

---

## 🛑 Essential React Best Practices

### 1. Functional Components & Hooks
We only use Functional Components and Hooks. **No Class Components.**
```tsx
// Good
export function ProductCard({ product }: Props) {
  return <div>{product.name}</div>;
}

// Bad (Do not use)
class ProductCard extends React.Component { ... }
```

### 2. State Management (No Local Storage Logic in UI)
In the legacy prototype, we relied heavily on `localStorage.getItem('cart')`. 
- **Do not read/write `localStorage` inside components.** 
- Global state (Auth, Cart) should be managed via Context (`src/contexts/`). Components should just consume cleanly via hooks (`const { cart } = useCart()`).
- Tokens will be stored securely and managed by the API interceptors, not randomly inside UI components.

### 3. API Calls (Separation of Concerns)
Components should **ask for data**, they shouldn't know **how to fetch it**.
```tsx
// BAD: Don't do this inside a component
const res = await axios.get('https://localhost:5000/api/products');

// GOOD: Use the generic service layer
const products = await productService.getAllProducts();
```

### 4. Component Splitting
If a file becomes larger than 200 lines, it's a sign that you should break it down into smaller, reusable components inside `src/components/`. Keep the `pages/` thin.

### 5. Type Safety (TypeScript)
We chose TypeScript for a reason. 
- Avoid using `any`.
- Define the shape of props using `interface` or `type`.
- Keep API response models centralized in `src/types/`.

### 6. Clean DOM & Styling
We continue to use CSS/Bootstrap for styling. Keep `classNames` clean. If logic dictates a class, use template literals or a library like `clsx`/`classnames`.

```tsx
// Good
<div className={`btn ${isActive ? 'btn-primary' : 'btn-outline-primary'}`}>
```

---

## 🚀 Getting Started

1. Set up your `.env` file referencing the backend.
2. Run `npm install` and `npm run dev`.
3. Read the micro-READMEs in the `src/` subfolders.
4. Begin by replacing the dummy components in `src/pages` with the legacy HTML templates, chopping them up into React components.

Happy coding!
