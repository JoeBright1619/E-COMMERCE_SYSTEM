# API: Authentication

**Base path:** `/api/auth`  
**Authorization required:** None (all endpoints are public)

---

## Endpoint Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new customer account |
| POST | `/api/auth/login` | Log in and receive a JWT token |

---

## POST `/api/auth/register`

Registers a new customer account. The role is always set to `Client` by the server — it cannot be specified in the request body.

On success, a welcome email is sent to the provided email address via MailKit + Gmail SMTP.

### Request Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | Min 2 characters |
| `email` | string | Yes | Valid email format, must be unique |
| `password` | string | Yes | Min 8 characters |

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Registration successful. A confirmation email has been sent.",
  "data": {
    "id": 5,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "Client"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Missing or invalid fields | `"Name, email, and password are required."` |
| `409` | Email already registered | `"An account with this email already exists."` |

---

## POST `/api/auth/login`

Authenticates a user and returns a signed JWT token. The token must be included in the `Authorization: Bearer` header for all protected requests.

### Request Body

```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-04-12T14:30:00Z",
    "user": {
      "id": 5,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "Client"
    }
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Missing fields | `"Email and password are required."` |
| `401` | Invalid credentials | `"Invalid email or password."` |

> **Security note:** The error message for invalid credentials does not reveal whether the email exists in the system. Both a wrong email and a wrong password return the same `401` response. This prevents user enumeration attacks.
