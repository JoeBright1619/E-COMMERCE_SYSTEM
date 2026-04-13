# 🛒 CAGURA E-Commerce System

Welcome to the **CAGURA E-Commerce System** repository! This is a full-stack, web-based E-Commerce platform built using modern client-server architecture. It supports customers browsing, adding to cart, and placing orders, as well as an admin portal for managing the store.

This project is broken into a deeply documented ASP.NET Core backend API and a React Single-Page Application frontend.

---

## 📖 Official Documentation

To fully understand this platform, please refer to our dedicated `docs/` folder. We have maintained complete documentation detailing architecture, API contracts, databases, and requirements.

| Document | Topic |
| :--- | :--- |
| [`docs/01-overview.md`](./docs/01-overview.md) | High-level project scope, goals, and technical stack. |
| [`docs/02-requirements.md`](./docs/02-requirements.md) | Full tracing of Functional and Non-Functional requirements. |
| [`docs/03-architecture.md`](./docs/03-architecture.md) | Our 4-layer backend architecture and React SPA data flows. |
| [`docs/04-database.md`](./docs/04-database.md) | SQL Server database schemas, ERD, and EF Core decisions. |
| [`docs/api/05-api.md`](./docs/api/05-api.md) | The master RESTful API contract for the frontend to consume. |
| [`docs/06-team.md`](./docs/06-team.md) | Team structure, responsibilities, and our internal workflows. |
| [`docs/07-setup.md`](./docs/07-setup.md) | **Step-by-step instructions for running this application locally.** |

---

## 💻 Codebase Structure

The code is strictly separated into independent environments:

- **[`/backend`](./backend/README.md):** The ASP.NET Core Web API. (See its inner `README` for backend coding standards).
- **[`/frontend/cagura`](./frontend/cagura/README.md):** The modern Vite + React + TypeScript frontend. (See its inner `README` for frontend coding standards).
- **[`/legacy`](./legacy):** An archived prototype using basic HTML and JS. It remains for reference purposes only.

---

## 🛠 Team Collaboration & Git Best Practices

> **CRITICAL:** We enforce a strict workflow to ensure our `develop` branch remains stable for integration, and our `master` branch is protected for production. All developers **MUST** read and follow the collaboration strategy detailed in [`docs/06-team.md`](./docs/06-team.md).

Here is a summary of our non-negotiable Git practices:

### 1. Branch Naming
Never commit directly to `master` or `develop`. Always create a new branch from `develop` for your work.
Include the type of work in your branch name:
- `feature/short-description` (e.g., `feature/product-reviews`)
- `fix/short-description` (e.g., `fix/cart-calculation`)

### 2. Commit Messages
We use **Conventional Commits** and mandate specifying whether the change is for the frontend or backend. Your commit message must clearly explain what was done.
- `feat(frontend): add user registration UI logic`
- `fix(backend): resolve cors issue on login endpoint`
- `docs(backend): update api endpoint schemas`
- `refactor(frontend): move token generation to helpers folder`

### 3. Merging & Communication
Since this is a class project, we are bypassing strict Pull Requests (PRs) in favor of keeping things direct. When your feature is complete, you will merge your branch into `develop`. **Never merge into `master`**—only the team lead handles `master` merges.

**Crucially, you must communicate with the team immediately after merging.** If you run into merge conflicts, reach out to the team to resolve them together so you don't overwrite someone else's work.

### 4. Step-by-Step Git Commands Guide

Here is exactly what you need to type in your terminal to safely contribute:

**1. Update your local machine and create a new branch:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

**2. Make your changes and commit them:**
```bash
git add .
git commit -m "feat(frontend): describe your feature here"
```

**3. Merge your branch into develop and push:**
```bash
git checkout develop
git pull origin develop              # Fetch any new changes your teammates made
git merge feature/your-feature-name  # Merge your work
git push origin develop              # Push the updated develop branch to GitHub
```

### 5. API Contracts
If your feature relies on data structures that haven't been completed by the backend yet, coordinate with the backend lead. Do not build UI on completely random data schemas—stick to the models defined in [`docs/api`](./docs/api/05-api.md).

---

## 🚀 Getting Started

If you are a new developer setting up your machine for the first time, skip straight to:
👉 **[The Official Project Setup Instructions](./docs/07-setup.md)**
