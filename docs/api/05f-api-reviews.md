# API: Reviews & Ratings

**Base path:** `/api/reviews`  
**Authorization required:** Client for write operations; Public for reads

---

## Endpoint Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products/{productId}/reviews` | Public | Get all reviews for a product |
| POST | `/api/reviews` | Client | Submit a review for a product |
| PUT | `/api/reviews/{id}` | Client | Update your own review |
| DELETE | `/api/reviews/{id}` | Client | Delete your own review |

---

## GET `/api/products/{productId}/reviews`

Returns all reviews submitted for a specific product, including the average rating.

### Path Parameter

| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | int | The product to fetch reviews for |

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Reviews retrieved successfully.",
  "data": {
    "productId": 1,
    "productName": "Wireless Headphones",
    "averageRating": 4.3,
    "reviewCount": 3,
    "reviews": [
      {
        "reviewId": 7,
        "userId": 5,
        "reviewerName": "Jane Doe",
        "rating": 5,
        "comment": "Excellent sound quality. Very comfortable.",
        "createdAt": "2025-04-10T08:00:00Z",
        "updatedAt": null
      },
      {
        "reviewId": 8,
        "userId": 9,
        "reviewerName": "John Smith",
        "rating": 4,
        "comment": "Great value for the price.",
        "createdAt": "2025-04-09T15:30:00Z",
        "updatedAt": null
      }
    ]
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `404` | Product not found | `"Product with ID 1 was not found."` |

---

## POST `/api/reviews`

Submits a new review and star rating for a product. A customer can only submit one review per product.

**Authorization:** `Bearer <token>`

### Request Body

```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Excellent sound quality. Very comfortable to wear for long sessions."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `productId` | int | Yes | Must reference an existing product |
| `rating` | int | Yes | Must be between 1 and 5 (inclusive) |
| `comment` | string | No | Max 1000 characters |

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Review submitted successfully.",
  "data": {
    "reviewId": 7,
    "productId": 1,
    "rating": 5,
    "comment": "Excellent sound quality. Very comfortable to wear for long sessions.",
    "createdAt": "2025-04-11T10:00:00Z"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Rating out of range | `"Rating must be between 1 and 5."` |
| `400` | Comment too long | `"Comment cannot exceed 1000 characters."` |
| `401` | Missing token | `"Authentication required."` |
| `404` | Product not found | `"Product with ID 1 was not found."` |
| `409` | Review already exists | `"You have already reviewed this product. Use PUT to update your review."` |

---

## PUT `/api/reviews/{id}`

Updates an existing review. A customer can only edit their own reviews.

**Authorization:** `Bearer <token>`

### Path Parameter

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | int | The review ID to update |

### Request Body

```json
{
  "rating": 4,
  "comment": "Great headphones, but the ear cushions wear out after a few months."
}
```

All fields are optional. Only provided fields are updated.

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Review updated successfully.",
  "data": {
    "reviewId": 7,
    "rating": 4,
    "comment": "Great headphones, but the ear cushions wear out after a few months.",
    "updatedAt": "2025-04-12T09:15:00Z"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Rating out of range | `"Rating must be between 1 and 5."` |
| `403` | Review belongs to a different user | `"Access denied. You can only edit your own reviews."` |
| `404` | Review not found | `"Review with ID 7 was not found."` |

---

## DELETE `/api/reviews/{id}`

Deletes a review. A customer can only delete their own reviews.

**Authorization:** `Bearer <token>`

### Path Parameter

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | int | The review ID to delete |

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Review deleted successfully.",
  "data": null
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `403` | Review belongs to a different user | `"Access denied. You can only delete your own reviews."` |
| `404` | Review not found | `"Review with ID 7 was not found."` |
