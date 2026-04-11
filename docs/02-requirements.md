# System Requirements

This document maps the functional and non-functional requirements of the CAGURA E-Commerce System. Every requirement here is traceable to a feature in either the frontend, backend API, or database layer.

---

## Functional Requirements

Functional requirements describe **what the system must do** the specific behaviours and capabilities exposed to users.

### FR-1: Authentication & Account Management

| ID | Requirement | Role | Implementation |
|----|-------------|------|----------------|
| FR-1.1 | Users can register a new account with name, email, and password | Public | `POST /api/auth/register` |
| FR-1.2 | Registered users can log in and receive a JWT token | Public | `POST /api/auth/login` |
| FR-1.3 | Passwords are stored as secure hashes (never plain text) | System | BCrypt hashing on registration |
| FR-1.4 | JWT tokens carry role claims used for authorization | System | Token includes `role: Admin` or `role: Client` |
| FR-1.5 | A confirmation email is sent upon successful registration | System | MailKit + Gmail SMTP |
| FR-1.6 | Admin accounts are seeded at startup; self-registration as Admin is blocked | System | DB seed + role validation on register endpoint |

---

### FR-2: Product Management

| ID | Requirement | Role | Implementation |
|----|-------------|------|----------------|
| FR-2.1 | Admins can create a new product with name, description, price, category, and image | Admin | `POST /api/products` |
| FR-2.2 | Admins can update any product field | Admin | `PUT /api/products/{id}` |
| FR-2.3 | Admins can delete a product | Admin | `DELETE /api/products/{id}` |
| FR-2.4 | All users (including unauthenticated) can browse the product catalog | Public | `GET /api/products` |
| FR-2.5 | All users can view the details of a single product | Public | `GET /api/products/{id}` |
| FR-2.6 | Products can be filtered by category | Public | `GET /api/products?categoryId={id}` |
| FR-2.7 | Products can be searched by name keyword | Public | `GET /api/products?search={keyword}` |
| FR-2.8 | Product images are uploaded to Cloudinary and the URL stored in the database | Admin | Cloudinary SDK in backend |

---

### FR-3: Category Management

| ID | Requirement | Role | Implementation |
|----|-------------|------|----------------|
| FR-3.1 | Admins can create, update, and delete categories | Admin | `POST/PUT/DELETE /api/categories` |
| FR-3.2 | All users can retrieve the list of all categories | Public | `GET /api/categories` |
| FR-3.3 | A category cannot be deleted if it has associated products | System | FK constraint + validation in service layer |

---

### FR-4: Shopping Cart

| ID | Requirement | Role | Implementation |
|----|-------------|------|----------------|
| FR-4.1 | Authenticated customers can add products to their cart | Client | `POST /api/cart` |
| FR-4.2 | Customers can update item quantities in the cart | Client | `PUT /api/cart/{itemId}` |
| FR-4.3 | Customers can remove items from the cart | Client | `DELETE /api/cart/{itemId}` |
| FR-4.4 | Customers can view the contents of their cart | Client | `GET /api/cart` |
| FR-4.5 | Cart is cleared automatically after a successful order is placed | System | Service layer on order creation |

---

### FR-5: Order Management

| ID | Requirement | Role | Implementation |
|----|-------------|------|----------------|
| FR-5.1 | Authenticated customers can place an order from their cart | Client | `POST /api/orders` |
| FR-5.2 | An order confirmation email is sent after successful placement | System | MailKit + Gmail SMTP |
| FR-5.3 | Customers can view their personal order history | Client | `GET /api/orders/my` |
| FR-5.4 | Admins can view all orders placed on the platform | Admin | `GET /api/orders` |
| FR-5.5 | Admins can update the status of any order | Admin | `PUT /api/orders/{id}/status` |
| FR-5.6 | Order statuses follow a defined lifecycle | System | `Pending → Processing → Shipped → Delivered` |
| FR-5.7 | Each order stores a snapshot of item prices at time of purchase | System | `Price` column on `OrderItems` table |

> **Design note on FR-5.7:** Prices on `OrderItems` are stored at the time the order is placed, not referenced live from the `Products` table. This ensures historical order accuracy even if a product's price changes later.

---

### FR-6: Reviews & Ratings

| ID | Requirement | Role | Implementation |
|----|-------------|------|----------------|
| FR-6.1 | Authenticated customers can submit a star rating (1–5) and a written review for any product | Client | `POST /api/reviews` |
| FR-6.2 | Customers can edit their own review | Client | `PUT /api/reviews/{id}` |
| FR-6.3 | Customers can delete their own review | Client | `DELETE /api/reviews/{id}` |
| FR-6.4 | All users can view reviews for a product | Public | `GET /api/products/{id}/reviews` |
| FR-6.5 | A customer can only have one active review per product | System | Unique constraint on `(UserId, ProductId)` in Reviews table |
| FR-6.6 | Average rating is calculated and returned with each product | System | Computed in the service layer or as a DB view |

---

### FR-7: Reporting (Admin)

| ID | Requirement | Role | Implementation |
|----|-------------|------|----------------|
| FR-7.1 | Admins can view a summary of all orders (count, total revenue) | Admin | `GET /api/reports/orders` |
| FR-7.2 | Admins can filter orders by date range or status | Admin | Query parameters on orders endpoint |

---

## Non-Functional Requirements

Non-functional requirements describe **how the system behaves** quality attributes that apply across all features.

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-1 | **Security** | All passwords are hashed using BCrypt before storage. Plain-text passwords are never persisted or logged. |
| NFR-2 | **Security** | Protected API endpoints require a valid JWT bearer token. Tokens expire after a configurable duration (default: 24 hours). |
| NFR-3 | **Security** | Role-based authorization is enforced at the API layer customers cannot access Admin-only endpoints even with a valid token. |
| NFR-4 | **Maintainability** | Backend follows a layered architecture: Controllers → Services → Repositories → Database. Business logic lives in the service layer. |
| NFR-5 | **Maintainability** | Database schema is managed via EF Core code-first migrations. All schema changes are version-controlled. |
| NFR-6 | **Usability** | The frontend is fully responsive and usable on desktop and mobile screen sizes. |
| NFR-7 | **API Design** | All API responses follow a consistent JSON envelope format with `success`, `data`, and `message` fields. |
| NFR-8 | **Error Handling** | API returns meaningful HTTP status codes (`400`, `401`, `403`, `404`, `500`) with descriptive error messages. |
| NFR-9 | **Documentation** | All API endpoints are documented with request/response examples in `05-api.md`. |
| NFR-10 | **Scalability** | The stateless API design allows horizontal scaling (multiple instances) without session-sharing concerns. |

---

## Requirements Traceability Summary

| Feature Area | Functional Reqs | Non-Functional Reqs |
|-------------|----------------|---------------------|
| Authentication | FR-1.1 – FR-1.6 | NFR-1, NFR-2, NFR-3 |
| Products | FR-2.1 – FR-2.8 | NFR-4, NFR-7, NFR-8 |
| Categories | FR-3.1 – FR-3.3 | NFR-4, NFR-5 |
| Cart | FR-4.1 – FR-4.5 | NFR-2, NFR-7 |
| Orders | FR-5.1 – FR-5.7 | NFR-2, NFR-3, NFR-7 |
| Reviews | FR-6.1 – FR-6.6 | NFR-2, NFR-7, NFR-8 |
| Reporting | FR-7.1 – FR-7.2 | NFR-3, NFR-7 |