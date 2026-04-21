# Frontend Tick-Tasks Checklist

This checklist breaks down the actionable tasks from frontend-implementation-tasks.md into tickable items for tracking progress.

## P0 (Highest Priority)

- [x] Remove unconditional mock import from app startup
- [x] Gate mock mode behind env variable (if needed)
- [x] Make real API mode the default
- [x] Create shared frontend API types for backend DTOs in `src/types/`
- [x] Replace current `Product` type in `CartContext.tsx` with API-aligned type
- [x] Refactor UI components to use backend DTO field names (`name`, `imageUrl`, `categoryName`)
- [x] Decide/implement `isNew` logic (from `createdAt` or remove)
- [x] Update product rendering in `Home.tsx`, `Shop.tsx`, `ProductDetails.tsx`, `ProductCard.tsx`, `ManageProducts.tsx`
- [ ] Redesign cart types around backend DTOs (`CartResponseDto`, `CartItemResponseDto`)
- [ ] Store backend `cartItemId`/`id` in cart state
- [ ] Update `fetchCart()` to use backend DTO shape
- [ ] Update cart add/remove/update logic to use backend contract
- [ ] Do not auto-fetch cart for unauthenticated users
- [ ] Decide guest-cart strategy (no guest cart or merge after login)
- [ ] Update checkout to call `POST /api/orders` with no payload
- [ ] Replace mock profile order history with `GET /api/orders/my`
- [ ] Update admin orders page to use `GET /api/orders` and `PUT /api/orders/{id}/status`
- [ ] Align frontend order types with backend DTOs
- [ ] Remove unsupported `Cancelled` status from admin UI

## P1 (Important)

- [ ] Fetch and render real reviews on product details page
- [ ] Replace mock rating/review-count logic with backend data
- [ ] Add review submission/edit/delete UI
- [ ] Add "My Reviews" tab/page using `GET /api/reviews/my`
- [ ] Create category service for `GET /api/categories`
- [ ] Update category listing pages to use backend categories
- [ ] Add `/admin/categories` route and page
- [ ] Implement admin category CRUD
- [ ] Update admin sidebar to include Categories instead of Customers
- [ ] Replace mock dashboard stats with `GET /api/reports/dashboard`
- [ ] Align dashboard widgets with backend DTOs
- [ ] Add date-range reporting UI for `GET /api/reports/orders`
- [ ] Remove `/admin/customers` and nav if not in scope
- [ ] Add frontend auth types aligned with `AuthResponseDto`
- [ ] Store `expiresAt` with token/user and validate on load
- [ ] Add Axios 401/403 handling (clear session, redirect to login)
- [ ] Add dedicated service modules for each resource
- [ ] Move DTO-aligned interfaces to `src/types/`
- [ ] Refactor components/pages to use service modules and types

## Acceptance

- [ ] Frontend runs against real backend with mocks disabled
- [ ] Product pages render using backend DTOs
- [ ] Category filtering uses real backend data
- [ ] Cart works only for authenticated users
- [ ] Checkout creates orders via backend cart
- [ ] Profile shows real order history
- [ ] Admin orders page uses real endpoints
- [ ] Admin dashboard uses real report endpoints
- [ ] Reviews are visible and editable
- [ ] Admin categories page uses backend CRUD
- [ ] Unsupported admin pages/routes are removed or backed by real APIs
