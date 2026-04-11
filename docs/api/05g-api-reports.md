# API: Reports

**Base path:** `/api/reports`  
**Authorization required:** Admin (all endpoints)

This module provides administrative reporting endpoints that aggregate order and revenue data. These endpoints power the admin dashboard's reporting view.

---

## Endpoint Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/reports/orders` | Admin | Order summary: total count and revenue |
| GET | `/api/reports/orders/by-status` | Admin | Order count broken down by status |
| GET | `/api/reports/products/top-selling` | Admin | Top 5 best-selling products by units sold |

---

## GET `/api/reports/orders`

Returns a high-level summary of all orders on the platform. Supports optional date-range filtering.

**Authorization:** `Bearer <Admin token>`

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | date | No | Start of date range (ISO 8601: `2025-04-01`) |
| `to` | date | No | End of date range (ISO 8601: `2025-04-30`) |

### Example Requests

```
GET /api/reports/orders
GET /api/reports/orders?from=2025-04-01&to=2025-04-30
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Order report generated.",
  "data": {
    "totalOrders": 87,
    "totalRevenue": 12450.75,
    "averageOrderValue": 143.11,
    "reportPeriod": {
      "from": "2025-04-01",
      "to": "2025-04-30"
    }
  }
}
```

---

## GET `/api/reports/orders/by-status`

Returns the number of orders grouped by their current status.

**Authorization:** `Bearer <Admin token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Order status breakdown retrieved.",
  "data": {
    "Pending": 12,
    "Processing": 8,
    "Shipped": 34,
    "Delivered": 33
  }
}
```

---

## GET `/api/reports/products/top-selling`

Returns the top 5 best-selling products, ranked by total units sold across all orders.

**Authorization:** `Bearer <Admin token>`

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Top selling products retrieved.",
  "data": [
    {
      "rank": 1,
      "productId": 1,
      "productName": "Wireless Headphones",
      "totalUnitsSold": 42,
      "totalRevenue": 3779.58
    },
    {
      "rank": 2,
      "productId": 5,
      "productName": "USB-C Hub",
      "totalUnitsSold": 38,
      "totalRevenue": 1329.62
    },
    {
      "rank": 3,
      "productId": 3,
      "productName": "Running Shoes",
      "totalUnitsSold": 31,
      "totalRevenue": 2169.69
    }
  ]
}
```

> **Implementation note:** All report data is computed by querying `OrderItems` joined with `Orders` and `Products`. For a class project, this is fine. In a high-traffic production environment, these aggregations would typically be pre-computed and cached (e.g., using a background job or a materialized view in SQL Server) to avoid heavy queries on every request.
