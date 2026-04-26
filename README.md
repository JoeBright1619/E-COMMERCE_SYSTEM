<div align="center">
  <img src="./frontend/cagura/public/assets/hero_bg.png" alt="CAGURA Banner" width="100%" style="border-radius: 10px;" />
  <br/>
  <h1>🛍️ CAGURA E-Commerce System</h1>
  <p><strong>A Premium Full-Stack E-Commerce Platform</strong></p>
  
  [![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](#)
  [![Backend](https://img.shields.io/badge/Backend-Render-blue?logo=render)](#)
  [![.NET](https://img.shields.io/badge/.NET-10.0-purple?logo=dotnet)](#)
  [![React](https://img.shields.io/badge/React-18-blue?logo=react)](#)
</div>

<br/>

## ✨ Overview

Welcome to the **CAGURA E-Commerce System**. This project is a complete, end-to-end e-commerce solution built with a modern, decoupled architecture. It features a beautifully designed React frontend and a robust, high-performance C# .NET 10 backend. 

CAGURA is designed to provide a seamless shopping experience for customers and a comprehensive management dashboard for administrators.

### 🌐 Live Deployments
* **Frontend (Vercel):** [https://e-commerce-system-ten.vercel.app](https://e-commerce-system-ten.vercel.app)
* **Backend API (Render):** [https://e-commerce-system-7tlc.onrender.com/swagger](https://e-commerce-system-7tlc.onrender.com/swagger)

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
* **Framework:** React 18 with TypeScript
* **Build Tool:** Vite
* **Styling:** Custom CSS with responsive, modern design (Glassmorphism & animations)
* **State Management:** React Context API (AuthContext, CartContext)
* **Routing:** React Router v6
* **Hosting:** Vercel (CI/CD Integrated)

### Backend (Server-Side)
* **Framework:** C# ASP.NET Core 10.0 Web API
* **Database:** PostgreSQL (Hosted on Neon)
* **ORM:** Entity Framework Core
* **Authentication:** JWT (JSON Web Tokens) with BCrypt hashing
* **Media Storage:** Cloudinary
* **Email Service:** MailKit (SMTP)
* **Hosting:** Render (Dockerized Container)

---

## 🚀 Key Features

### For Customers
* **Secure Authentication:** JWT-based login and registration.
* **Product Catalog:** Browse, search, and filter premium products by category.
* **Dynamic Shopping Cart:** Add items, adjust quantities, and see real-time price calculations.
* **Responsive Design:** A flawless shopping experience on both mobile and desktop screens.
* **Order History:** View past orders and current order statuses.

### For Administrators
* **Admin Dashboard:** A centralized control panel for managing the entire store.
* **Product Management:** Create, edit, delete, and upload product images directly to Cloudinary.
* **Order Fulfillment:** Track customer orders and update their statuses (Pending, Shipped, Delivered).
* **User Management:** View customer details and manage platform access.

---

## 📂 Project Structure

The repository is strictly divided into decoupled environments:

```text
E-COMMERCE_SYSTEM/
├── backend/                  # C# .NET 10 Web API
│   ├── Controllers/          # API Route Handlers
│   ├── Models/               # Database Entities
│   ├── Services/             # Business Logic (Cloudinary, Email, Auth)
│   ├── Data/                 # EF Core DbContext & Migrations
│   └── Dockerfile            # Production Docker Image Config
│
├── frontend/cagura/          # React + Vite Single Page Application
│   ├── src/
│   │   ├── components/       # Reusable UI Components
│   │   ├── pages/            # Page Views (Home, Shop, Admin Dashboard)
│   │   ├── services/         # Axios API Integrations
│   │   └── contexts/         # Global State Management
│   └── package.json          # Frontend Dependencies
│
└── docs/                     # Architectural Documentation
```

---

## ⚙️ CI/CD Pipeline & DevOps

This project utilizes modern DevOps practices to ensure continuous integration and deployment:

1. **Frontend Pipeline:** 
   - Connected directly to GitHub via **Vercel**.
   - Pushes to the `master` branch automatically trigger a production build.
2. **Backend Pipeline:** 
   - Connected via **Render**.
   - Uses a custom `.NET 10.0` `Dockerfile` to build and containerize the application.
   - Pushes to the `backend` tracking branch automatically trigger a zero-downtime deployment.
3. **Environment Management:** 
   - All sensitive secrets (JWT Keys, Database URLs, Cloudinary APIs) are strictly managed via Cloud Environment Variables, preventing hardcoded credentials in the repository.

---

## 👥 Collaboration & Workflow

This project follows a strict branching and collaboration strategy:
- `master`: Protected branch. Represents the live, production-ready code.
- `develop`: Integration branch. All feature branches merge here first for testing.
- `feature/*`: Branches dedicated to building new features.
- `backend`: Deployment tracking branch for the Render backend service.

> **Note for Contributors:** Never commit directly to `master`. Always create a feature branch, submit a Pull Request, and ensure all tests and builds pass before merging.

---
<div align="center">
  <i>Built with passion and modern web technologies.</i>
</div>
