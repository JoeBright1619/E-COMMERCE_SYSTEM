# API: Products

**Base path:** `/api/products`

---

## Endpoint Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | Get all products (with optional filters) |
| GET | `/api/products/{id}` | Public | Get a single product by ID |
| POST | `/api/products` | Admin | Create a new product |
| PUT | `/api/products/{id}` | Admin | Update an existing product |
| DELETE | `/api/products/{id}` | Admin | Delete a product |

---

## GET `/api/products`

Returns the full product catalog. Supports optional filtering and searching via query parameters.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | int | No | Filter products by category |
| `search` | string | No | Filter by product name (partial match, case-insensitive) |

### Example Requests

```
GET /api/products
GET /api/products?categoryId=2
GET /api/products?search=laptop
GET /api/products?categoryId=2&search=laptop
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "Noise-cancelling over-ear headphones.",
      "price": 89.99,
      "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/headphones.jpg",
      "categoryId": 2,
      "categoryName": "Electronics",
      "averageRating": 4.3,
      "reviewCount": 12,
      "createdAt": "2025-03-01T10:00:00Z"
    }
  ]
}
```

---

## GET `/api/products/{id}`

Returns the full details of a single product, including its category and average rating.

### Path Parameter

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | int | The product ID |

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Product retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "Noise-cancelling over-ear headphones with 30-hour battery life.",
    "price": 89.99,
    "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/headphones.jpg",
    "categoryId": 2,
    "categoryName": "Electronics",
    "averageRating": 4.3,
    "reviewCount": 12,
    "createdAt": "2025-03-01T10:00:00Z"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `404` | Product not found | `"Product with ID 1 was not found."` |

---

## POST `/api/products`

Creates a new product. Admin only. Image upload is handled as a separate step (see image upload note below).

**Authorization:** `Bearer <Admin token>`

### Request Body

```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling over-ear headphones with 30-hour battery life.",
  "price": 89.99,
  "categoryId": 2,
  "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/headphones.jpg"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | Max 200 characters |
| `description` | string | No | Max 2000 characters |
| `price` | decimal | Yes | Must be greater than 0 |
| `categoryId` | int | Yes | Must reference an existing category |
| `imageUrl` | string | No | Must be a valid URL if provided |

> **Image upload flow:** The frontend uploads the image directly to Cloudinary via the backend's `/api/products/upload-image` helper endpoint (which signs the upload). The returned Cloudinary URL is then included in this request body as `imageUrl`.

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": 7,
    "name": "Wireless Headphones",
    "price": 89.99,
    "categoryId": 2,
    "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/headphones.jpg",
    "createdAt": "2025-04-11T10:00:00Z"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Missing required fields | `"Name, price, and categoryId are required."` |
| `400` | Price is zero or negative | `"Price must be greater than 0."` |
| `401` | No token provided | `"Authentication required."` |
| `403` | Non-admin token | `"Access denied. Admin role required."` |
| `404` | Category not found | `"Category with ID 2 was not found."` |

---

## PUT `/api/products/{id}`

Updates an existing product. Only the fields included in the request body are updated (partial update).

**Authorization:** `Bearer <Admin token>`

### Request Body

```json
{
  "name": "Wireless Headphones Pro",
  "price": 109.99,
  "description": "Updated description.",
  "categoryId": 2,
  "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/headphones-pro.jpg"
}
```

All fields are optional. Only provided fields are updated.

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "id": 1,
    "name": "Wireless Headphones Pro",
    "price": 109.99,
    "categoryId": 2,
    "imageUrl": "https://res.cloudinary.com/cagura/image/upload/v1/products/headphones-pro.jpg"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `404` | Product not found | `"Product with ID 1 was not found."` |
| `403` | Non-admin token | `"Access denied. Admin role required."` |

---

## DELETE `/api/products/{id}`

Deletes a product permanently.

**Authorization:** `Bearer <Admin token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Product deleted successfully.",
  "data": null
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `404` | Product not found | `"Product with ID 1 was not found."` |
| `403` | Non-admin token | `"Access denied. Admin role required."` |

> **Note:** Deleting a product that has associated `OrderItems` may be restricted or handled with a soft-delete strategy to preserve order history integrity. This behavior should be enforced in the service layer.
