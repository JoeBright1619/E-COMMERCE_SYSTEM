# API: Orders

**Base path:** `/api/orders`  
**Authorization required:** Client or Admin (see per-endpoint access level)

---

## Endpoint Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Client | Place a new order from the cart |
| GET | `/api/orders/my` | Client | Get the authenticated user's order history |
| GET | `/api/orders/{id}` | Client | Get full details of a specific order |
| GET | `/api/orders` | Admin | Get all orders on the platform |
| PUT | `/api/orders/{id}/status` | Admin | Update the status of an order |

---

## POST `/api/orders`

Places a new order using the items currently in the authenticated customer's cart.

**Authorization:** `Bearer <Client token>`

The server will:
1. Fetch the customer's current cart
2. Calculate the total from current product prices
3. Create the order and lock in `UnitPrice` on each `OrderItem`
4. Clear the customer's cart
5. Send an order confirmation email to the customer

### Request Body

No body required. The order is built from the authenticated user's current cart.

```json
{}
```

> Optionally, a `shippingAddress` field can be added in future iterations.

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Order placed successfully. A confirmation email has been sent.",
  "data": {
    "orderId": 14,
    "status": "Pending",
    "totalAmount": 214.97,
    "createdAt": "2025-04-11T12:00:00Z",
    "items": [
      {
        "productId": 1,
        "productName": "Wireless Headphones",
        "quantity": 2,
        "unitPrice": 89.99,
        "subtotal": 179.98
      },
      {
        "productId": 5,
        "productName": "USB-C Hub",
        "quantity": 1,
        "unitPrice": 34.99,
        "subtotal": 34.99
      }
    ]
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Cart is empty | `"Your cart is empty. Add items before placing an order."` |
| `401` | Missing token | `"Authentication required."` |

---

## GET `/api/orders/my`

Returns the authenticated customer's personal order history, sorted by most recent first.

**Authorization:** `Bearer <token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Orders retrieved successfully.",
  "data": [
    {
      "orderId": 14,
      "totalAmount": 214.97,
      "status": "Shipped",
      "createdAt": "2025-04-11T12:00:00Z",
      "itemCount": 3
    },
    {
      "orderId": 9,
      "totalAmount": 49.99,
      "status": "Delivered",
      "createdAt": "2025-03-20T09:30:00Z",
      "itemCount": 1
    }
  ]
}
```

---

## GET `/api/orders/{id}`

Returns the full details of a single order — including all line items.

Customers can only view their own orders. Admins can view any order.

**Authorization:** `Bearer <token>`

### Path Parameter

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | int | The order ID |

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Order retrieved successfully.",
  "data": {
    "orderId": 14,
    "userId": 5,
    "customerName": "Jane Doe",
    "status": "Shipped",
    "totalAmount": 214.97,
    "createdAt": "2025-04-11T12:00:00Z",
    "items": [
      {
        "productId": 1,
        "productName": "Wireless Headphones",
        "quantity": 2,
        "unitPrice": 89.99,
        "subtotal": 179.98
      },
      {
        "productId": 5,
        "productName": "USB-C Hub",
        "quantity": 1,
        "unitPrice": 34.99,
        "subtotal": 34.99
      }
    ]
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `403` | Customer trying to view another user's order | `"Access denied."` |
| `404` | Order not found | `"Order with ID 14 was not found."` |

---

## GET `/api/orders`

Returns all orders placed on the platform. Admin only.

**Authorization:** `Bearer <Admin token>`

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `Pending`, `Processing`, `Shipped`, `Delivered` |
| `from` | date | No | Filter orders placed on or after this date (ISO 8601: `2025-04-01`) |
| `to` | date | No | Filter orders placed on or before this date |

### Example Requests

```
GET /api/orders
GET /api/orders?status=Pending
GET /api/orders?from=2025-04-01&to=2025-04-11
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "All orders retrieved.",
  "data": [
    {
      "orderId": 14,
      "customerId": 5,
      "customerName": "Jane Doe",
      "totalAmount": 214.97,
      "status": "Pending",
      "createdAt": "2025-04-11T12:00:00Z"
    }
  ]
}
```

---

## PUT `/api/orders/{id}/status`

Updates the status of an order. Admin only. Status must follow the valid lifecycle sequence.

**Authorization:** `Bearer <Admin token>`

**Valid status values:** `Pending`, `Processing`, `Shipped`, `Delivered`

### Request Body

```json
{
  "status": "Processing"
}
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Order status updated to 'Processing'.",
  "data": {
    "orderId": 14,
    "status": "Processing"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Invalid status value | `"Invalid status. Accepted values: Pending, Processing, Shipped, Delivered."` |
| `403` | Non-admin token | `"Access denied. Admin role required."` |
| `404` | Order not found | `"Order with ID 14 was not found."` |
