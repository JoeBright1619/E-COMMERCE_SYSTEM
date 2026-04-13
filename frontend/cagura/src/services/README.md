# `services/` Directory

## What goes here?
**API calling logic and external service integrations.**
Examples: `api.ts` (base Axios instance), `authService.ts`, `productService.ts`.

## Rules
1. **Strict Separation:** React components (`pages/` and `components/`) should **never** import `axios` directly. They must import a function from these services.
2. **Type Safety:** Service functions should be strictly typed to return specific TypeScript configurations from `src/types/`. 
3. **Error Handling:** Centralize your error handling (such as auto-redirects on 401 Unauthorized) in an Axios interceptor inside `api.ts`, so individual components don't have to worry about token expiration.

## Example Usage
```tsx
// DO NOT DO THIS inside a React component
const res = await axios.post('http://localhost:5000/api/auth/login', payload);

// DO THIS inside a React component
import { authService } from '../services/authService';
const user = await authService.login(payload);
```
