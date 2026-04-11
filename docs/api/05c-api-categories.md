# API: Categories

**Base path:** `/api/categories`

---

## Endpoint Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | Get all categories |
| GET | `/api/categories/{id}` | Public | Get a single category by ID |
| POST | `/api/categories` | Admin | Create a new category |
| PUT | `/api/categories/{id}` | Admin | Update a category name |
| DELETE | `/api/categories/{id}` | Admin | Delete a category |

---

## GET `/api/categories`

Returns all categories. Used to populate the category filter on the product catalog page.

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": [
    { "id": 1, "name": "Electronics" },
    { "id": 2, "name": "Clothing" },
    { "id": 3, "name": "Books" }
  ]
}
```

---

## GET `/api/categories/{id}`

Returns a single category by ID.

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Category retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Electronics"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `404` | Category not found | `"Category with ID 1 was not found."` |

---

## POST `/api/categories`

Creates a new product category.

**Authorization:** `Bearer <Admin token>`

### Request Body

```json
{
  "name": "Sports & Outdoors"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | Min 2 characters, Max 100 characters, must be unique |

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Category created successfully.",
  "data": {
    "id": 4,
    "name": "Sports & Outdoors"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `400` | Missing or empty name | `"Category name is required."` |
| `403` | Non-admin token | `"Access denied. Admin role required."` |
| `409` | Name already exists | `"A category with this name already exists."` |

---

## PUT `/api/categories/{id}`

Updates the name of an existing category.

**Authorization:** `Bearer <Admin token>`

### Request Body

```json
{
  "name": "Sports & Fitness"
}
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Category updated successfully.",
  "data": {
    "id": 4,
    "name": "Sports & Fitness"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `404` | Category not found | `"Category with ID 4 was not found."` |
| `409` | Duplicate name | `"A category with this name already exists."` |
| `403` | Non-admin token | `"Access denied. Admin role required."` |

---

## DELETE `/api/categories/{id}`

Deletes a category by ID.

**Authorization:** `Bearer <Admin token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Category deleted successfully.",
  "data": null
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| `404` | Category not found | `"Category with ID 4 was not found."` |
| `400` | Category has associated products | `"Cannot delete a category that has products assigned to it. Reassign or delete the products first."` |
| `403` | Non-admin token | `"Access denied. Admin role required."` |

> **Business rule:** A category with one or more assigned products cannot be deleted. This is enforced in the service layer before the database call is made.
