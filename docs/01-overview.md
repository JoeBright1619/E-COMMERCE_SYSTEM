# CAGURA E-Commerce System Overview

## Project Description

**CAGURA** is a full-stack, web-based E-Commerce platform built as an academic capstone project. It enables customers to discover and purchase products online while providing administrators with the tools to manage the product catalog, monitor orders, and maintain the platform.

The system is designed around a modern client-server architecture: a **React** single-page application (SPA) on the frontend communicates with an **ASP.NET Core Web API** on the backend, which in turn persists data to a **SQL Server** relational database via **Entity Framework Core**.

Although built as a class project, the architecture intentionally reflects real-world production patterns layered separation of concerns, JWT-based authentication, role-based access control, and a RESTful API contract making it a meaningful full-stack portfolio piece.

---

## Project Objectives

| # | Objective | Notes |
|---|-----------|-------|
| 1 | Provide a platform for customers to browse, cart, and purchase products | Core customer journey |
| 2 | Enable administrators to fully manage the product catalog | CRUD with category grouping |
| 3 | Implement secure authentication and role-based authorization | JWT + ASP.NET Identity roles |
| 4 | Track and manage customer orders end-to-end | From placement to admin review |
| 5 | Support product image uploads for a rich catalog experience | Via Cloudinary free tier |
| 6 | Allow customers to review and rate products | Star rating + written review |
| 7 | Send email notifications for key events (registration, order confirmation) | Via Gmail SMTP / MailKit — free |
| 8 | Demonstrate full-stack proficiency using React and ASP.NET Core | Academic deliverable |
| 9 | Maintain clean, documented, and maintainable code | Suitable for team collaboration |

---

## System Users & Roles

The platform supports two distinct user roles, each with its own set of permissions and interface views.

### 1. Administrator (`Admin`)

Administrators have elevated access to manage the platform. They interact primarily through protected API endpoints and a dedicated admin dashboard on the frontend.

**Capabilities:**
- Create, update, and delete products and categories
- View all customer orders across the platform
- Update order statuses (e.g., Pending → Processing → Shipped → Delivered)
- Access sales reporting (order summaries, revenue overview)
- Manage registered user accounts (future scope)

> **Note:** Admin accounts are seeded directly into the database during setup. Self-registration as an Admin is not permitted through the public registration endpoint.

---

### 2. Customer (`Client`)

Customers are end-users of the storefront. They register through the public interface and interact with products and the order system.

**Capabilities:**
- Register a new account and log in securely
- Receive a welcome email upon successful registration
- Browse the product catalog (filtered by category, searchable)
- View individual product details, including uploaded images
- Add and remove items from a persistent shopping cart
- Place orders and receive an email order confirmation
- View personal order history and order status
- Submit a star rating and written review for purchased products
- Edit or delete their own reviews

---

## Technology Stack

| Layer | Technology | Version / Notes |
|-------|-----------|-----------------|
| **Frontend** | React (via Vite) | SPA, component-based UI |
| **HTTP Client** | Axios | REST API communication |
| **Backend** | ASP.NET Core Web API | C#, RESTful, stateless |
| **ORM** | Entity Framework Core | Code-first migrations |
| **Database** | Microsoft SQL Server | Relational, ACID-compliant |
| **Authentication** | JSON Web Tokens (JWT) | Stateless auth, role claims |
| **Image Storage** | Cloudinary (free tier) | 25 GB storage, 25 GB bandwidth/month |
| **Email Service** | MailKit + Gmail SMTP | Free; uses a Gmail app password |
| **Version Control** | Git & GitHub | Feature-branch workflow |

---

## Key Design Principles

- **Separation of Concerns:** Frontend, backend, and database are independently maintained layers with well-defined contracts (REST API).
- **Stateless API:** The backend does not maintain session state. Each request is authenticated via a JWT bearer token in the `Authorization` header.
- **Code-First Database:** The database schema is managed through EF Core migrations, keeping schema changes versioned alongside code changes.
- **Role-Based Authorization:** API endpoints are protected at the controller level using `[Authorize(Roles = "Admin")]` or `[Authorize]` attributes, ensuring customers cannot access admin-only resources.

---

## Scope & Limitations

CAGURA is scoped as a class project but includes several real-world features implemented using free-tier tools:

### Included in Scope

| Feature | Implementation |
|---------|---------------|
| Product image uploads | Cloudinary free tier (uploaded via the admin dashboard) |
| Email notifications | MailKit + Gmail SMTP (registration confirmation, order confirmation) |
| Product reviews & ratings | Star rating (1–5) + written comment; stored in database |

### Out of Scope (Future Enhancements)

The following are intentionally excluded but the architecture is designed to accommodate them with minimal structural changes:

- **Payment gateway** (e.g., Stripe, PayPal) — orders are placed but payment is simulated
- **Real-time order tracking** (e.g., SignalR WebSockets)
- **Inventory / stock management** (stock-level tracking, low-stock alerts)
- **Admin user management** (promote/demote roles, ban accounts)
- **Discount codes and promotions**

> These are natural next steps and the database schema and API layers are intentionally structured to make adding them straightforward.