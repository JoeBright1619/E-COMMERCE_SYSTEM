# Team Contributions

## Team Overview

CAGURA was built by a team of three developers working across a shared GitHub repository. The team adopted a feature-branch Git workflow, merging directly into the `develop` branch and communicating changes. Only the team lead merges `develop` into the `master` branch.

> **Note to team:** Replace "Member 2" and "Member 3" with real names before submitting the final documentation.

---

## Team Members

### Bright - Team Leader & Backend Lead

**Primary responsibility:** System architecture, backend development, authentication, project coordination, and cross-stack refinement (assisting both frontend and backend developers by refining their code and adding missing features).

| Area | Contribution |
|------|-------------|
| Architecture | Designed the three-tier architecture (React SPA, ASP.NET Core API, SQL Server) and defined the folder structure and layer separation for the backend |
| Authentication | Implemented JWT-based authentication, BCrypt password hashing, and role-based authorization using ASP.NET Core middleware |
| Backend foundation | Set up the ASP.NET Core Web API project, EF Core DbContext, code-first migrations, and database seeding |
| Integration | Connected the React frontend to the ASP.NET Core backend API, resolved CORS configuration, and standardized the API response envelope |
| External services | Integrated Cloudinary for product image uploads and MailKit + Gmail SMTP for transactional email notifications |
| Git & project management | Managed the repository, enforced the branching strategy, reviewed pull requests, and coordinated team task assignments |
| Documentation | Led and authored the technical documentation for this project |
| Cross-stack Refinement | Assisted in frontend components and backend endpoints by refining logic, fixing bugs, and implementing missed features |

---

### Albert - Frontend Developer

**Primary responsibility:** React SPA development and frontend-backend integration.

| Area | Contribution |
|------|-------------|
| React setup | Initialized the Vite + React project and set up React Router for client-side navigation |
| UI components | Built reusable React components for the product catalog, product detail page, cart, and order history |
| Admin dashboard | Developed the admin-facing pages for product management, category management, and order status updates |
| API integration | Integrated all frontend pages with the backend REST API using Axios, including JWT token attachment via request interceptors |
| Auth UI | Implemented the registration and login forms with client-side validation and error handling |
| Responsive design | Ensured all pages are usable across desktop and mobile screen sizes |

---

### Thoti - Backend Developer

**Primary responsibility:** Backend CRUD operations, database design, and reporting.

| Area | Contribution |
|------|-------------|
| Product & category API | Implemented the Products and Categories controllers, service classes, and repository layer |
| Order processing | Built the order placement logic including cart-to-order conversion, price snapshotting, and cart clearance |
| Reviews module | Implemented the reviews and ratings endpoints including the unique-per-user constraint and average rating calculation |
| Database design | Contributed to the database schema design; defined entity models for Products, Categories, Orders, OrderItems, CartItems, and Reviews |
| Reporting endpoints | Implemented the admin reporting endpoints (order summary, status breakdown, top-selling products) |
| EF Core migrations | Generated and applied EF Core migrations as the schema evolved during development |

---

## Collaboration Strategy

### Git Workflow

The team used a **feature-branch workflow** on a single shared monorepo branching off `develop`.

```
master (PROTECTED - Bright only)
  └── develop (Integration Branch)
        └── feature/auth-setup           (Bright)
  └── feature/product-crud         (Member 3)
  └── feature/react-components     (Member 2)
  └── feature/cart-and-orders      (Member 3)
  └── feature/frontend-integration (Member 2)
  └── feature/reviews-module       (Member 3)
  └── feature/email-notifications  (Bright)
  └── feature/image-uploads        (Bright)
  └── docs/technical-documentation (Bright)
```

| Practice | Detail |
|----------|--------|
| Branching | Each feature or fix is developed on a dedicated branch named `feature/description` or `fix/description` (branching from `develop`) |
| Merging | All completed branches are merged directly into `develop`. NEVER merge into `master`. |
| Code Review | Dropped for simplicity. Team must communicate immediately after a merge instead. |
| Commit messages | Conventional commit format used: `feat(frontend):`, `fix(backend):`, `docs(backend):` |
| Master Branch | Protected. Only the Team Leader merges `develop` releases into `master`. |

---

### Communication & Task Management

| Practice | Tool / Method |
|----------|---------------|
| Task assignment | Divided by feature area at project kickoff; tracked in a shared list |
| Progress updates | Regular check-ins to discuss blockers and coordinate integration |
| Code conflicts | Resolved collaboratively when merging to `develop` |
| Documentation | Maintained in the `/docs` folder of the same repository alongside the code |

---

## Responsibility Matrix

The table below summarizes which team member owns each major system area:

| System Area | Bright | Albert | Thoti |
|-------------|:------:|:--------:|:--------:|
| System Architecture | Lead | | |
| Backend Setup (API, EF Core, DB seed) | Lead | | Support |
| Authentication & JWT | Lead | | |
| Product & Category API | Refine | | Lead |
| Cart & Order API | Refine | | Lead |
| Reviews & Ratings API | Refine | | Lead |
| Reporting API | Refine | | Lead |
| Cloudinary Integration | Lead | | |
| Email Notifications | Lead | | |
| React UI Components | Refine | Lead | |
| React Router & Auth UI | Refine | Lead | |
| Frontend-Backend Integration | Support | Lead | |
| Database Schema Design | Lead | | Support |
| EF Core Migrations | Lead | | Support |
| Documentation | Lead | | |