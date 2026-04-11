# System Architecture

## Overview

CAGURA follows a **three-tier client-server architecture**, cleanly separating presentation, business logic, and data persistence into independent layers. Each tier communicates only with its direct neighbour, making each layer independently testable, replaceable, and scalable.

```
┌─────────────────────────────────────────────────┐
│              CLIENT TIER (Browser)              │
│           React SPA  (Vite + Axios)             │
└────────────────────┬────────────────────────────┘
                     │  HTTPS / REST (JSON)
                     ▼
┌─────────────────────────────────────────────────┐
│            APPLICATION TIER (Server)            │
│        ASP.NET Core Web API  (C#)               │
│  ┌───────────┐  ┌──────────┐  ┌─────────────┐  │
│  │Controllers│→ │ Services │→ │ Repositories│  │
│  └───────────┘  └──────────┘  └──────┬──────┘  │
│                                       │ EF Core │
└───────────────────────────────────────┼─────────┘
                                        │
┌───────────────────────────────────────▼─────────┐
│              DATA TIER (Persistence)            │
│           Microsoft SQL Server                  │
└─────────────────────────────────────────────────┘
```

External services (Cloudinary for images, Gmail SMTP for email) are called from the **Application Tier**  the frontend never communicates with them directly.

---

## Component Responsibilities

### Frontend  React (Vite)

The frontend is a **Single-Page Application (SPA)** built with React. After the initial HTML/JS bundle is served, all navigation happens client-side without full page reloads.

| Responsibility | Detail |
|---------------|--------|
| Routing | React Router client-side routing for pages (Home, Product Detail, Cart, Orders, Admin) |
| API Communication | Axios all HTTP requests to the backend; JWT token attached via Axios request interceptor |
| State Management | React Context API or local component state for cart, auth session, and UI state |
| Authentication | JWT stored in `localStorage`; decoded on the client to determine the current user's role |
| Role-Based UI | Admin-only pages and controls are conditionally rendered based on the decoded JWT role claim |

**Key pages:**

| Page | Access | Description |
|------|--------|-------------|
| `/` | Public | Product catalog with category filter and search |
| `/products/:id` | Public | Product detail with reviews and ratings |
| `/cart` | Client | Shopping cart |
| `/orders` | Client | Personal order history |
| `/login`, `/register` | Public | Auth forms |
| `/admin/products` | Admin | Product management (CRUD + image upload) |
| `/admin/orders` | Admin | All orders + status management |
| `/admin/categories` | Admin | Category management |

---

### Backend ASP.NET Core Web API

The backend is a **stateless RESTful API** built with ASP.NET Core. It processes all business logic, enforces authorization, and is the only layer that talks to the database or external services.

The backend is organized into four explicit layers:

```
Controllers  →  Services  →  Repositories  →  EF Core DbContext  →  SQL Server
```

| Layer | Responsibility |
|-------|---------------|
| **Controllers** | Accept HTTP requests, validate input (model binding), call the service layer, return HTTP responses. No business logic here. |
| **Services** | Contain all business logic (e.g. cart total calculation, order placement, price snapshot). Orchestrate calls to repositories and external services. |
| **Repositories** | Wrap EF Core queries. Abstract data access so the service layer never writes raw LINQ directly. Makes unit testing easier. |
| **DTOs (Data Transfer Objects)** | Decouple the API contract from the database model. Input DTOs for requests; output DTOs for responses. Entity models are never returned directly. |
| **Middleware** | Global error handling, JWT authentication, CORS policy. |

**Key backend projects/folders:**

```
/backend
  ├── Controllers/        # HTTP endpoints (one controller per resource)
  ├── Services/           # Business logic interfaces and implementations
  ├── Repositories/       # Data access interfaces and implementations
  ├── Models/             # EF Core entity models (maps to DB tables)
  ├── DTOs/               # Request and response shapes
  ├── Middleware/         # Global error handler, custom middleware
  ├── Helpers/            # JWT generation, BCrypt utilities, Cloudinary helper
  ├── Data/               # AppDbContext, DB seeding
  └── appsettings.json    # Configuration (connection string, JWT secret, Cloudinary keys)
```

---

### Database SQL Server (via EF Core)

SQL Server stores all persistent application data. The schema is managed entirely through **EF Core code-first migrations** the C# entity models are the source of truth, not hand-written SQL.

See [`04-database.md`](./04-database.md) for full schema, relationships, and design decisions.

---

### External Services

| Service | Purpose | How it's integrated |
|---------|---------|---------------------|
| **Cloudinary** | Product image storage and delivery | Admin uploads an image via the frontend → backend receives the file → backend uploads to Cloudinary via SDK → Cloudinary URL stored in the `Products` table |
| **Gmail SMTP (MailKit)** | Transactional email (registration confirmation, order confirmation) | Backend service calls MailKit on trigger events; credentials stored in `appsettings.json` (or environment variables in production) |

---

## Data Flow

### Typical Authenticated Request (e.g. Place an Order)

```
1. Customer clicks "Place Order" in the React app
2. Axios sends POST /api/orders
   → Authorization: Bearer <JWT token> in the header
3. ASP.NET Core middleware validates the JWT
   → Extracts userId and role from token claims
4. OrdersController receives the request
   → Validates the request body (DTO model binding)
5. OrdersController calls OrderService.CreateOrderAsync(userId, dto)
6. OrderService:
   a. Fetches the customer's cart from CartRepository
   b. Calculates the total amount
   c. Creates an Order entity and its OrderItems (with price snapshots)
   d. Clears the cart
   e. Calls EmailService.SendOrderConfirmationAsync(...)
7. OrderRepository saves the order to SQL Server via EF Core
8. EmailService sends a confirmation email via MailKit + Gmail SMTP
9. OrdersController returns 201 Created with the new order summary DTO
10. Axios receives the response → React updates the UI
```

### Unauthenticated Request (e.g. Browse Products)

```
1. React component mounts → Axios sends GET /api/products?categoryId=2
2. ASP.NET Core routes to ProductsController.GetAll(...)
   → No [Authorize] attribute → no token required
3. ProductService fetches products from ProductRepository (filtered by categoryId)
4. Returns a list of ProductResponseDto (excludes internal fields)
5. React renders the product cards
```

---

## Request Lifecycle (Middleware Pipeline)

Every incoming HTTP request passes through the following ASP.NET Core middleware pipeline:

```
Incoming Request
      │
      ▼
  CORS Policy          ← Allows requests from the React dev server / production domain
      │
      ▼
  Authentication       ← Validates JWT bearer token (if present)
      │
      ▼
  Authorization        ← Checks [Authorize] and [Authorize(Roles="Admin")] attributes
      │
      ▼
  Controller Action    ← Business logic via service layer
      │
      ▼
  Global Error Handler ← Catches unhandled exceptions → returns structured JSON error
      │
      ▼
Outgoing Response
```

---

## Project Structure

```
ECommerceSystem/
  ├── backend/         # ASP.NET Core Web API (C#)
  ├── frontend/        # React SPA (Vite + JavaScript)
  ├── legacy/          # Archived Razor Pages prototype (not in active development)
  └── docs/            # Project documentation (this folder)
```

> **About `/legacy`:** This folder contains an earlier Razor Pages proof-of-concept. It is archived and not part of the active system. It exists for reference only and should not be deployed.

---

## Scalability Notes

The current architecture is monolithic (single API process, one DB), which is appropriate for a class project. However, several design decisions keep future scaling straightforward:

| Decision | Scalability Benefit |
|----------|-------------------|
| Stateless JWT authentication | Multiple API instances can run behind a load balancer with no shared session state |
| Repository pattern | Swapping SQL Server for another database (or adding a caching layer like Redis) only requires changing the repository implementation |
| External image storage (Cloudinary) | Images are not stored on the server no sticky sessions or shared file system needed if the API is scaled horizontally |
| DTO separation | API contract is independent of the DB schema, allowing schema changes without breaking the client |
| Service layer isolation | Business logic can be extracted into microservices in the future without rewriting controllers |