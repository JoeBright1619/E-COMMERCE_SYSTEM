# API Documentation Overview

CAGURA exposes a RESTful JSON API built on ASP.NET Core. This document defines the conventions, authentication mechanism, and standard response format that apply to every endpoint in the system.

Detailed endpoint documentation is split into separate files by resource:

| File | Resource |
|------|----------|
| [05a-api-auth.md](./05a-api-auth.md) | Authentication (register, login) |
| [05b-api-products.md](./05b-api-products.md) | Products (catalog, CRUD, image upload) |
| [05c-api-categories.md](./05c-api-categories.md) | Categories |
| [05d-api-cart.md](./05d-api-cart.md) | Shopping Cart |
| [05e-api-orders.md](./05e-api-orders.md) | Orders and order status |
| [05f-api-reviews.md](./05f-api-reviews.md) | Product Reviews and Ratings |
| [05g-api-reports.md](./05g-api-reports.md) | Admin Reporting |

---

## Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `https://localhost:5000/api` |
| Production | `https://<your-domain>/api` |

All endpoint paths in this documentation are relative to the base URL above.

---

## Authentication

CAGURA uses **JWT Bearer Token** authentication.

### How to authenticate

1. Call `POST /api/auth/login` with valid credentials
2. Receive a `token` string in the response
3. Include the token in the `Authorization` header of every subsequent protected request:

```
Authorization: Bearer <your-token-here>
```

### Token details

| Property | Value |
|----------|-------|
| Format | JSON Web Token (JWT) |
| Algorithm | HS256 |
| Expiry | 24 hours (configurable in `appsettings.json`) |
| Claims included | `userId`, `email`, `role` (`Admin` or `Client`) |

> Tokens are not automatically refreshed. The client must re-authenticate after expiry. Token refresh is a future enhancement.

---

## Authorization Levels

Endpoints are protected using one of three access levels:

| Level | Description | Header Required |
|-------|-------------|-----------------|
| **Public** | No authentication required | None |
| **Client** | Any authenticated user (Admin or Client) | `Authorization: Bearer <token>` |
| **Admin** | Admin role only | `Authorization: Bearer <token>` (must carry `role: Admin` claim) |

---

## Standard Response Format

All API responses follow a consistent JSON envelope:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { }
}
```

- `success`: Always `true` for 2xx responses
- `message`: Human-readable summary of the result
- `data`: The response payload (object, array, or `null` for operations with no return value)

### Error Response

```json
{
  "success": false,
  "message": "A descriptive error message explaining what went wrong.",
  "data": null
}
```

---

## HTTP Status Codes

| Code | Meaning | When used |
|------|---------|-----------|
| `200 OK` | Request succeeded | Successful GET, PUT, DELETE |
| `201 Created` | Resource created | Successful POST that creates a resource |
| `400 Bad Request` | Invalid input | Validation errors, missing required fields |
| `401 Unauthorized` | Missing or invalid token | Token absent, expired, or malformed |
| `403 Forbidden` | Insufficient permissions | Valid token but wrong role (e.g. Client accessing Admin endpoint) |
| `404 Not Found` | Resource does not exist | Product, order, or user ID not found |
| `409 Conflict` | Duplicate resource | Email already registered, duplicate review |
| `500 Internal Server Error` | Unexpected server error | Unhandled exception (details logged server-side) |

---

## Request Conventions

- All request bodies must be `Content-Type: application/json`
- Date/time values are in **ISO 8601 UTC** format: `"2025-04-11T14:30:00Z"`
- IDs are always integers
- String fields are trimmed of leading/trailing whitespace by the API
- Pagination is not yet implemented; all list endpoints return all records

---

## CORS

During development, the API allows requests from `http://localhost:5173` (the Vite dev server default).

In production, the allowed origin must be updated in `appsettings.json` or through environment variables.