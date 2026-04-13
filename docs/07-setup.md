# Project Setup Guide

This guide explains how to get CAGURA running on a local development machine from scratch. Follow each section in order: database first, then backend, then frontend.

---

## Prerequisites

Ensure the following tools are installed before proceeding:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0 | dotnet.microsoft.com |
| [Node.js](https://nodejs.org) | 18.x LTS | nodejs.org |
| [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) | 2019 or later | microsoft.com (Developer Edition is free) |
| [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) | Any recent | microsoft.com (optional but recommended) |
| [Git](https://git-scm.com/) | Any recent | git-scm.com |

### Verify installations

Run these in your terminal to confirm everything is ready:

```bash
dotnet --version      # Should print 8.x.x
node --version        # Should print 18.x.x or above
npm --version         # Should print 9.x.x or above
git --version         # Any version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/ECommerceSystem.git
cd ECommerceSystem
```

---

## 2. External Services Setup

Before running the application, you need free accounts for two external services.

### Cloudinary (Product Image Uploads)

1. Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. From your dashboard, note down:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Gmail SMTP (Email Notifications)

1. Use an existing Gmail account or create one
2. Enable **2-Step Verification** on the account
3. Generate an **App Password**:
   - Go to Google Account > Security > App Passwords
   - Create a new app password for "Mail"
   - Note down the 16-character password

> Never commit real credentials to Git. Add them to `appsettings.Development.json` only (which is in `.gitignore`), or use environment variables.

---

## 3. Backend Setup

### Step 1: Navigate to the backend folder

```bash
cd backend
```

### Step 2: Configure the application

Open `appsettings.json` and review the default settings. Then create `appsettings.Development.json` in the same folder and add your local overrides:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CaguraDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "your-long-random-secret-key-at-least-32-characters",
    "Issuer": "CaguraApi",
    "Audience": "CaguraClient",
    "ExpiryHours": 24
  },
  "Cloudinary": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "EmailSettings": {
    "SenderEmail": "your-gmail@gmail.com",
    "SenderName": "CAGURA Shop",
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "AppPassword": "your-16-char-app-password"
  },
  "AdminSeed": {
    "Name": "Admin",
    "Email": "admin@cagura.com",
    "Password": "Admin@1234"
  }
}
```

> `appsettings.Development.json` is already listed in `.gitignore` to prevent accidental credential commits.

### Step 3: Restore NuGet packages

```bash
dotnet restore
```

### Step 4: Apply database migrations

This creates the database and all tables in SQL Server:

```bash
dotnet ef database update
```

> If you get a "command not found" error, install the EF Core CLI tools globally first:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

### Step 5: Run the backend

```bash
dotnet run
```

The API will start at:
- `https://localhost:5000` (HTTPS)
- `http://localhost:5001` (HTTP)

You can verify it is running by visiting `https://localhost:5000/api/categories` in your browser — it should return an empty JSON array.

---

## 4. Frontend Setup

Open a new terminal window and navigate to the frontend folder.

### Step 1: Navigate to the frontend folder

```bash
cd frontend
```

### Step 2: Install Node dependencies

```bash
npm install
```

### Step 3: Configure the API base URL

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_BASE_URL=https://localhost:5000/api
```

> The `.env` file is already in `.gitignore`. Do not commit API URLs or secrets in environment files.

### Step 4: Start the development server

```bash
npm run dev
```

The React app will start at `http://localhost:5173`.

Open your browser and navigate to `http://localhost:5173` to see the storefront.

---

## 5. Default Credentials

After running migrations, the following admin account is seeded automatically:

| Field | Value |
|-------|-------|
| Email | `admin@cagura.com` |
| Password | `Admin@1234` |
| Role | Admin |

> Change these credentials immediately after first login, especially before any deployment.

---

## 6. Project Running Summary

Once both servers are running, your local environment looks like this:

| Service | URL |
|---------|-----|
| React Frontend | `http://localhost:5173` |
| ASP.NET Core API | `https://localhost:5000/api` |
| SQL Server Database | `localhost` (default instance) |

---

## 7. Common Issues & Fixes

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| `dotnet ef` not found | EF Core CLI not installed | Run `dotnet tool install --global dotnet-ef` |
| SSL certificate error in browser | .NET dev cert not trusted | Run `dotnet dev-certs https --trust` |
| CORS error in browser | Frontend URL not in allowed origins | Confirm `VITE_API_BASE_URL` matches the backend's configured CORS origin |
| Cannot connect to SQL Server | SQL Server not running or wrong connection string | Start SQL Server service; check `Server=` value in connection string |
| `npm install` fails | Node version too old | Upgrade to Node 18 LTS or above |
| Email not sending | Wrong Gmail app password or 2FA not enabled | Re-generate the Gmail app password; ensure 2-Step Verification is on |
| Images not uploading | Wrong Cloudinary credentials | Double-check Cloud Name, API Key, and API Secret in `appsettings.Development.json` |

---

## 8. Resetting the Database

If you need to start from a clean database state:

```bash
# From the /backend folder:
dotnet ef database drop --force
dotnet ef database update
```

This drops and recreates the database, re-runs all migrations, and re-seeds the default admin account and categories.

---

## 9. Environment Variables Reference

A full reference of all configuration keys required by the backend:

| Key | Description |
|-----|-------------|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string |
| `JwtSettings:SecretKey` | Secret used to sign JWT tokens (min 32 characters) |
| `JwtSettings:ExpiryHours` | Token validity duration in hours |
| `Cloudinary:CloudName` | Cloudinary cloud name from dashboard |
| `Cloudinary:ApiKey` | Cloudinary API key |
| `Cloudinary:ApiSecret` | Cloudinary API secret |
| `EmailSettings:SenderEmail` | Gmail address used to send emails |
| `EmailSettings:AppPassword` | Gmail app password (16-character) |
| `AdminSeed:Email` | Email for the seeded admin account |
| `AdminSeed:Password` | Password for the seeded admin account |