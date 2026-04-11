# API: Shopping Cart

**Base path:** `/api/cart`  
**Authorization required:** Client (all endpoints require a valid JWT token)

The cart is persistent — it is stored in the database against the authenticated user's account. Items remain in the cart across sessions until the customer checks out or manually removes them.

---

## Endpoint Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cart` | Client | Get the current user's cart |
| POST | `/api/cart` | Client | Add a product to the cart |
| PUT | `/api/cart/{itemId}` | Client | Update the quantity of a cart item |
| DELETE | `/api/cart/{itemId}` | Client | Remove a specific item from the cart |
| DELETE | `/api/cart` | Client | Clear the entire cart |

---

## GET `/api/cart`

Returns the contents of the authenticated user's cart, including product details and a calculated total.

**Authorization:** `Bearer <token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Cart retrieved successfully.",
  "data": {
    "items": [
      {
        "cartItemId": 3,
        "productId": 1,
        "productName": "Wireless Headphones",
        "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/headphones.jpg",
        "unitPrice": 89.99,
        "quantity": 2,
        "subtotal": 179.98
      },
      {
        "cartItemId": 4,
        "productId": 5,
        "productName": "USB-C Hub",
        "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/hub.jpg",
        "unitPrice": 34.99,
        "quantity": 1,
        "subtotal": 34.99
      }
    ],
    "totalItems": 3,
    "cartTotal": 214.97
  }
}
```

---

## POST `/api/cart`

Adds a product to the cart. If the product is already in the cart, the quantity is incremented rather than creating a duplicate entry.

**Authorization:** `Bearer <token>`

### Request Body

```json
{
  "productId": 1,
  "quantity": 2
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `productId` | int | Yes | Must reference an existing product |
| `quantity` | int | Yes | Must be greater than 0 |

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Item added to cart.",
  "data": {
    "cartItemId": 3,
    "productId": 1,
    "productName": "Wireless Headphones",
    "quantity": 2,
    "unitPrice": 89.99,
    "subtotal": 179.98
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Invalid quantity | `"Quantity must be greater than 0."` |
| `401` | Missing token | `"Authentication required."` |
| `404` | Product not found | `"Product with ID 1 was not found."` |

---

## PUT `/api/cart/{itemId}`

Updates the quantity of a specific item already in the cart. Setting the quantity to `0` is equivalent to removing the item.

**Authorization:** `Bearer <token>`

### Path Parameter

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | int | The ID of the cart item (not the product ID) |

### Request Body

```json
{
  "quantity": 3
}
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Cart item updated.",
  "data": {
    "cartItemId": 3,
    "productId": 1,
    "quantity": 3,
    "subtotal": 269.97
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Quantity is negative | `"Quantity cannot be negative."` |
| `403` | Item belongs to a different user | `"Access denied."` |
| `404` | Cart item not found | `"Cart item with ID 3 was not found."` |

---

## DELETE `/api/cart/{itemId}`

Removes a single item from the cart.

**Authorization:** `Bearer <token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Item removed from cart.",
  "data": null
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `403` | Item belongs to a different user | `"Access denied."` |
| `404` | Cart item not found | `"Cart item with ID 3 was not found."` |

---

## DELETE `/api/cart`

Clears all items from the authenticated user's cart.

**Authorization:** `Bearer <token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Cart cleared successfully.",
  "data": null
}
```

> **Note:** The cart is also automatically cleared by the server when a successful order is placed via `POST /api/orders`. Clients do not need to call this endpoint after checkout.
