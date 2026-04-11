# Database Design

## Overview

CAGURA uses **Microsoft SQL Server** as its relational database, managed through **Entity Framework Core (EF Core)** with a **code-first** approach. This means the database schema is defined in C# entity classes and applied to the database via EF Core migrations. Hand-written SQL is avoided for schema management.

All schema changes are version-controlled alongside the source code, making it straightforward to reproduce the exact database state at any point in the project's history.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Code-first migrations | Schema changes are tracked in code, reviewed in pull requests, and applied consistently across all environments |
| Separate `Roles` table | Roles are data-driven (not hardcoded enums), which makes adding new roles easier without a code change |
| `Price` snapshot on `OrderItems` | Stores the product price at time of purchase, not a live foreign key to the product price. This ensures historical order accuracy even if a product is repriced later |
| `CartItems` as a persistent table | Cart state is saved in the database so customers don't lose their cart on logout or browser close |
| Unique constraint on Reviews | `(UserId, ProductId)` prevents a customer from submitting duplicate reviews for the same product |
| `ImageUrl` on Products | Stores the Cloudinary-hosted URL rather than raw binary data; keeps the database lean and offloads image delivery to a CDN |

---

## Tables

### `Roles`

Stores the two system roles. Seeded at application startup.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `Name` | `nvarchar(50)` | NOT NULL, Unique | `"Admin"` or `"Client"` |

---

### `Users`

Stores all registered accounts (both Admins and Clients).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `Name` | `nvarchar(100)` | NOT NULL | Display name |
| `Email` | `nvarchar(150)` | NOT NULL, Unique | Used as login identifier |
| `PasswordHash` | `nvarchar(255)` | NOT NULL | BCrypt hash; plain-text password never stored |
| `RoleId` | `int` | FK -> Roles.Id | Determines access level |
| `CreatedAt` | `datetime2` | NOT NULL, Default: GETUTCDATE() | Account creation timestamp |

> Admin users are seeded at startup. The public `/api/auth/register` endpoint always assigns the `Client` role and cannot be overridden by the request body.

---

### `Categories`

Groups products into logical collections (e.g., Electronics, Clothing).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `Name` | `nvarchar(100)` | NOT NULL, Unique | Category label |

---

### `Products`

The core catalog table. Each product belongs to exactly one category.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `Name` | `nvarchar(200)` | NOT NULL | Product name |
| `Description` | `nvarchar(max)` | NULL allowed | Detailed product description |
| `Price` | `decimal(18, 2)` | NOT NULL | Current selling price |
| `ImageUrl` | `nvarchar(500)` | NULL allowed | Cloudinary-hosted image URL |
| `CategoryId` | `int` | FK -> Categories.Id | Product's category |
| `CreatedAt` | `datetime2` | NOT NULL, Default: GETUTCDATE() | When the product was added |

---

### `CartItems`

Represents the current shopping cart for each customer. A customer's cart is a collection of rows in this table keyed by their `UserId`.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `UserId` | `int` | FK -> Users.Id | Owner of the cart |
| `ProductId` | `int` | FK -> Products.Id | The product added to cart |
| `Quantity` | `int` | NOT NULL, > 0 | Number of units |
| `AddedAt` | `datetime2` | NOT NULL, Default: GETUTCDATE() | When the item was added |

> **Unique constraint:** `(UserId, ProductId)` — adding the same product again increments the quantity rather than inserting a duplicate row.

---

### `Orders`

Represents a completed purchase. Created when a customer checks out their cart.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `UserId` | `int` | FK -> Users.Id | The customer who placed the order |
| `TotalAmount` | `decimal(18, 2)` | NOT NULL | Sum of all `OrderItems.Price * Quantity` at time of checkout |
| `Status` | `nvarchar(50)` | NOT NULL, Default: `'Pending'` | Order lifecycle stage |
| `CreatedAt` | `datetime2` | NOT NULL, Default: GETUTCDATE() | When the order was placed |

**Order status lifecycle:**

```
Pending  →  Processing  →  Shipped  →  Delivered
```

Admins can move an order forward through these stages. Customers can view the current status but cannot change it.

---

### `OrderItems`

Line items for each order. Each row represents one product in one order, with its price locked at checkout time.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `OrderId` | `int` | FK -> Orders.Id | Parent order |
| `ProductId` | `int` | FK -> Products.Id | The product purchased |
| `Quantity` | `int` | NOT NULL, > 0 | Units purchased |
| `UnitPrice` | `decimal(18, 2)` | NOT NULL | Price per unit **at the time of purchase** |

> `UnitPrice` is a snapshot, not a live reference to `Products.Price`. This is intentional: if a product is repriced after an order is placed, the order history remains accurate.

---

### `Reviews`

Stores customer ratings and written reviews for products.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `Id` | `int` | PK, Identity | Auto-incremented |
| `UserId` | `int` | FK -> Users.Id | The reviewer |
| `ProductId` | `int` | FK -> Products.Id | The reviewed product |
| `Rating` | `int` | NOT NULL, 1–5 | Star rating |
| `Comment` | `nvarchar(1000)` | NULL allowed | Written review text |
| `CreatedAt` | `datetime2` | NOT NULL, Default: GETUTCDATE() | When the review was posted |
| `UpdatedAt` | `datetime2` | NULL allowed | Last edited timestamp |

> **Unique constraint:** `(UserId, ProductId)` — one review per customer per product, enforced at the database level.

---

## Relationships

```
Roles       ──< Users           (One role → many users)
Users       ──< Orders          (One user → many orders)
Users       ──< CartItems       (One user → many cart items)
Users       ──< Reviews         (One user → many reviews)
Orders      ──< OrderItems      (One order → many line items)
Products    ──< OrderItems      (One product → many order line items)
Products    ──< CartItems       (One product → many cart entries)
Products    ──< Reviews         (One product → many reviews)
Categories  ──< Products        (One category → many products)
```

---

## Entity Relationship Diagram (ERD)

```
┌──────────┐       ┌───────────────┐       ┌─────────────┐
│  Roles   │       │    Users      │       │  Categories │
│──────────│       │───────────────│       │─────────────│
│ Id (PK)  │──────<│ Id (PK)       │       │ Id (PK)     │
│ Name     │       │ Name          │       │ Name        │
└──────────┘       │ Email         │       └──────┬──────┘
                   │ PasswordHash  │              │
                   │ RoleId (FK)   │       ┌──────▼──────────────┐
                   │ CreatedAt     │       │      Products        │
                   └──┬────────────┘       │─────────────────────│
                      │                    │ Id (PK)              │
          ┌───────────┼──────────┐         │ Name                 │
          │           │          │         │ Description          │
   ┌──────▼───┐  ┌────▼────┐  ┌─▼──────►──│ Price                │
   │ CartItems│  │ Orders  │  │Reviews │   │ ImageUrl             │
   │──────────│  │─────────│  │────────│   │ CategoryId (FK)      │
   │ Id (PK)  │  │ Id (PK) │  │Id (PK) │   │ CreatedAt            │
   │ UserId   │  │ UserId  │  │UserId  │   └──────────────────────┘
   │ ProductId│  │ Total   │  │ProdId  │
   │ Quantity │  │ Status  │  │Rating  │
   │ AddedAt  │  │ CreatedAt  │Comment │
   └──────────┘  └────┬────┘  │CreatedAt
                       │       └────────┘
                  ┌────▼──────────┐
                  │  OrderItems   │
                  │───────────────│
                  │ Id (PK)       │
                  │ OrderId (FK)  │
                  │ ProductId (FK)│
                  │ Quantity      │
                  │ UnitPrice     │
                  └───────────────┘
```

---

## Data Integrity Rules

| Rule | Enforcement |
|------|------------|
| Passwords never stored in plain text | BCrypt hashing applied in the service layer before saving |
| Foreign keys enforce referential integrity | Configured in EF Core `OnModelCreating` with cascading rules |
| A category with products cannot be deleted | Checked in the service layer before calling `DELETE` |
| A customer submits only one review per product | Unique index on `Reviews(UserId, ProductId)` |
| Admin role cannot be self-assigned via registration | `RoleId` is hardcoded to `Client` in the register service; not taken from request body |
| Order price is immutable after placement | `UnitPrice` on `OrderItems` is a snapshot; product price changes do not affect historical orders |

---

## Seed Data

The following data is seeded automatically when the application runs for the first time (or after a fresh migration):

| Table | Seeded Records |
|-------|---------------|
| `Roles` | `Admin`, `Client` |
| `Users` | One default admin account (email + hashed password from config) |
| `Categories` | Sample categories (e.g., Electronics, Clothing, Books) |

> Seed credentials for the admin account should be defined in `appsettings.Development.json` and overridden via environment variables in production. Never commit real credentials to the repository.