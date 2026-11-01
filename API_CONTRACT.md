# Nexa Store Admin Console — API Contract & Backend Specification

> **Version:** 1.0.0  
> **Base URL:** `https://api.nexa-store.com/api/v1` (or `http://localhost:5000/api/v1` in local development)  
> **Author:** Antigravity AI & Frontend Architecture Team  
> **Audience:** Backend Engineering Team, Frontend Developers, QA Automation

---

## Table of Contents
1. [Global Standards & Conventions](#1-global-standards--conventions)
   - [Authentication & Headers](#authentication--headers)
   - [Standard Response Envelope](#standard-response-envelope)
   - [Pagination & Metadata Standard](#pagination--metadata-standard)
   - [Standard Error Codes & Responses](#standard-error-codes--responses)
2. [Module 1: Dashboard Overview (`/admin/dashboard`)](#2-module-1-dashboard-overview)
   - [1.1 GET Dashboard KPIs](#11-get-dashboard-kpis)
   - [1.2 GET System Operational Status](#12-get-system-operational-status)
   - [1.3 GET Recent Orders Stream](#13-get-recent-orders-stream)
   - [1.4 GET Single Order Details (Quick Drawer)](#14-get-single-order-details-quick-drawer)
   - [1.5 PATCH Update Order Status](#15-patch-update-order-status)
   - [1.6 POST Cancel Order](#16-post-cancel-order)
3. [Module 2: Products & Catalog (`/admin/products`)](#3-module-2-products--catalog)
   - [2.1 GET Catalog KPI Metrics](#21-get-catalog-kpi-metrics)
   - [2.2 GET Master Products Catalog (Search & Faceted Filters)](#22-get-master-products-catalog)
   - [2.3 GET Single Product Details](#23-get-single-product-details)
   - [2.4 POST Create Product (New / Draft)](#24-post-create-product)
   - [2.5 PUT Update Product](#25-put-update-product)
   - [2.6 DELETE Delete Single Product](#26-delete-delete-single-product)
   - [2.7 PATCH Quick Toggle Product Status](#27-patch-quick-toggle-product-status)
   - [2.8 POST Bulk Status Update](#28-post-bulk-status-update)
   - [2.9 POST Bulk Price Update](#29-post-bulk-price-update)
   - [2.10 POST Bulk Delete Products](#210-post-bulk-delete-products)
   - [2.11 GET Export Catalog](#211-get-export-catalog)
   - [2.12 GET Check SKU Availability](#212-get-check-sku-availability)
   - [2.13 GET Check Slug Availability](#213-get-check-slug-availability)
4. [Module 3: Media & Assets (`/admin/media`)](#4-module-3-media--assets)
   - [3.1 POST Upload Media Asset (Image / Video / 3D .GLB)](#31-post-upload-media-asset)
   - [3.2 DELETE Delete Media Asset](#32-delete-delete-media-asset)
5. [Module 4: Categories & Taxonomy (`/admin/categories`)](#5-module-4-categories--taxonomy)
   - [4.1 GET Categories KPI Metrics](#41-get-categories-kpi-metrics)
   - [4.2 GET Categories Tree & List](#42-get-categories-tree--list)
   - [4.3 GET Single Category Details](#43-get-single-category-details)
   - [4.4 POST Create Category](#44-post-create-category)
   - [4.5 PUT Update Category](#45-put-update-category)
   - [4.6 DELETE Delete Category](#46-delete-delete-category)
   - [4.7 GET Check Category Slug Availability](#47-get-check-category-slug-availability)
6. [Enums & Types Dictionary](#6-enums--types-dictionary)

---

## 1. Global Standards & Conventions

### Authentication & Headers
All requests to `/api/v1/admin/*` require an active Admin session with Bearer JWT Token:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
Accept: application/json
```

For file uploads (Multipart Form Data):
```http
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

### Standard Response Envelope
All API endpoints must return the standardized response wrapper:

```typescript
interface ApiResponse<T> {
  success: boolean;       // true for 2xx, false for 4xx/5xx
  status: number;         // HTTP status code (200, 201, 400, etc.)
  message: string | null; // Human-readable feedback message or null
  data: T;                // Payload object or array
  meta: ApiMeta | null;   // Pagination or metadata (optional)
}
```

### Pagination & Metadata Standard
When returning lists, the `meta` object must provide:

```typescript
interface ApiMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

### Standard Error Codes & Responses
```json
{
  "success": false,
  "status": 400,
  "message": "Invalid request parameter: 'price' must be a positive number.",
  "data": null,
  "meta": null
}
```

Common status codes:
- `200 OK`: Successful read or update.
- `201 Created`: Successful resource creation.
- `400 Bad Request`: Validation failure or bad syntax.
- `401 Unauthorized`: Missing, expired, or invalid JWT token.
- `403 Forbidden`: Authenticated user lacks `ADMIN` or `OPERATIONS` privileges.
- `404 Not Found`: Resource ID does not exist.
- `409 Conflict`: Duplicate unique key (e.g., SKU or slug already in use).
- `422 Unprocessable Entity`: Business logic constraint violation (e.g. cannot delete product with pending active orders).
- `500 Internal Server Error`: Unhandled server exception.

---

## 2. Module 1: Dashboard Overview

### 1.1 GET Dashboard KPIs
Retrieve the 4 primary operational business metrics displayed at the top of the dashboard.

- **Endpoint:** `GET /api/v1/admin/dashboard/kpis`
- **Query Parameters:**
  - `range` *(optional, string, default: `"30d"`)*: `"today" | "7d" | "30d" | "90d" | "1y"`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "netRevenue": 128450.00,
    "netRevenueChange": "+14.2% vs last month",
    "totalOrders": 1248,
    "totalOrdersPending": 14,
    "catalogSkus": 428,
    "lowStockCount": 5,
    "conversionRate": 3.84,
    "conversionRateChange": "+0.4% from campaign"
  },
  "meta": null
}
```

---

### 1.2 GET System Operational Status
Retrieve real-time health telemetry of infrastructure services for the Command Strip.

- **Endpoint:** `GET /api/v1/admin/dashboard/system-status`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "gatewayStatus": "operational",
    "gatewayPingMs": 24,
    "cdnStatus": "operational",
    "cdnNodesCount": 28,
    "databaseStatus": "operational",
    "lastSyncTimestamp": "2026-11-01T13:45:00.000Z",
    "activeEnvironment": "production",
    "domain": "nexa-store.com",
    "appVersion": "v2.14.0"
  },
  "meta": null
}
```

---

### 1.3 GET Recent Orders Stream
Fetch paginated recent orders with search and fulfillment status tabs.

- **Endpoint:** `GET /api/v1/admin/orders`
- **Query Parameters:**
  - `page` *(optional, integer, default: `1`)*
  - `limit` *(optional, integer, default: `10`)*
  - `status` *(optional, string, default: `"all"`)*: `"all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"`
  - `search` *(optional, string)*: Order number, customer name, or email
  - `sortBy` *(optional, string, default: `"createdAt"`)*: `"createdAt" | "totalAmount"`
  - `sortOrder` *(optional, string, default: `"desc"`)*: `"asc" | "desc"`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": [
    {
      "id": "ord-88392",
      "orderNumber": "#NX-88392",
      "customerName": "Sophia Laurent",
      "customerEmail": "sophia.laurent@outlook.com",
      "customerAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      "orderDate": "Today",
      "orderTime": "11:42 AM",
      "totalAmount": 349.50,
      "currency": "USD",
      "paymentStatus": "paid",
      "fulfillmentStatus": "processing",
      "itemCount": 3,
      "deliveryAddress": "452 Maple Ave, Austin, TX 78701",
      "trackingNumber": "1Z9999999999999999"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 1248,
    "totalPages": 125,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 1.4 GET Single Order Details (Quick Drawer)
Fetch full itemized order breakdown and chronological lifecycle audit timeline.

- **Endpoint:** `GET /api/v1/admin/orders/:id`
- **Path Parameters:**
  - `id` *(required, string)*: e.g. `ord-88392`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "id": "ord-88392",
    "orderNumber": "#NX-88392",
    "customer": {
      "name": "Sophia Laurent",
      "email": "sophia.laurent@outlook.com",
      "phone": "+1 (555) 392-4819",
      "isVerified": true
    },
    "shippingAddress": {
      "street": "452 Maple Ave, Suite 3B",
      "city": "Austin",
      "state": "TX",
      "postalCode": "78701",
      "country": "United States"
    },
    "billingAddress": {
      "street": "452 Maple Ave, Suite 3B",
      "city": "Austin",
      "state": "TX",
      "postalCode": "78701",
      "country": "United States"
    },
    "payment": {
      "status": "paid",
      "method": "Visa ending in 4242",
      "transactionId": "ch_3Nzk472eZvKYlo2C1gQx0",
      "subtotal": 319.00,
      "tax": 20.50,
      "shippingFee": 10.00,
      "discount": 0.00,
      "total": 349.50,
      "currency": "USD"
    },
    "fulfillment": {
      "status": "processing",
      "carrier": "UPS Ground",
      "trackingNumber": "1Z9999999999999999",
      "estimatedDelivery": "2026-11-04"
    },
    "items": [
      {
        "id": "item-1",
        "productId": "prod-nx-aud-9420",
        "name": "AeroSound Pro Wireless ANC",
        "variant": "Midnight Black / Pro Edition",
        "sku": "NX-AUD-BLK-1Y",
        "quantity": 1,
        "unitPrice": 199.00,
        "totalPrice": 199.00,
        "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120"
      }
    ],
    "timeline": [
      {
        "id": "t-1",
        "title": "Payment Authorized & Captured",
        "timestamp": "Today, 11:42 AM",
        "completed": true
      },
      {
        "id": "t-2",
        "title": "Order Ingested to Fulfillment Center (Austin Hub)",
        "timestamp": "Today, 11:45 AM",
        "completed": true
      },
      {
        "id": "t-3",
        "title": "Awaiting Carrier Dispatch Pickup",
        "timestamp": "Pending",
        "completed": false
      }
    ]
  },
  "meta": null
}
```

---

### 1.5 PATCH Update Order Status
Modify payment or fulfillment status of an order.

- **Endpoint:** `PATCH /api/v1/admin/orders/:id/status`
- **Request Body:**
```json
{
  "fulfillmentStatus": "shipped",
  "trackingNumber": "1Z8392019482019283",
  "carrier": "FedEx Express",
  "notifyCustomer": true
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Order #NX-88392 status updated to 'shipped'.",
  "data": {
    "orderId": "ord-88392",
    "fulfillmentStatus": "shipped",
    "updatedAt": "2026-11-01T14:10:00.000Z"
  },
  "meta": null
}
```

---

### 1.6 POST Cancel Order
Cancel an order, record the formal reason, and trigger optional inventory restock and refund.

- **Endpoint:** `POST /api/v1/admin/orders/:id/cancel`
- **Request Body:**
```json
{
  "reason": "customer_request",
  "notes": "Customer called support requesting cancellation before dispatch.",
  "restockInventory": true,
  "issueRefund": true
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Order #NX-88392 has been cancelled. Inventory restocked and refund initiated.",
  "data": {
    "orderId": "ord-88392",
    "status": "cancelled",
    "refundAmount": 349.50,
    "cancelledAt": "2026-11-01T14:12:00.000Z"
  },
  "meta": null
}
```

---

## 3. Module 2: Products & Catalog

### 2.1 GET Catalog KPI Metrics
Retrieve the 4 catalog inventory status metrics.

- **Endpoint:** `GET /api/v1/admin/products/metrics`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "totalProducts": 428,
    "publishedCount": 394,
    "lowStockCount": 14,
    "draftCount": 20
  },
  "meta": null
}
```

---

### 2.2 GET Master Products Catalog
Search, filter, and paginate through products catalog.

- **Endpoint:** `GET /api/v1/admin/products`
- **Query Parameters:**
  - `page` *(optional, integer, default: `1`)*
  - `limit` *(optional, integer, default: `10`)*
  - `search` *(optional, string)*: Matches name, SKU, UPC, or brand
  - `category` *(optional, string, default: `"all"`)*: Category name or ID
  - `status` *(optional, string, default: `"all"`)*: `"all" | "published" | "draft" | "unpublished" | "archived"`
  - `stock` *(optional, string, default: `"all"`)*: `"all" | "in_stock" | "low_stock" | "out_of_stock"`
  - `brand` *(optional, string, default: `"all"`)*: Brand name filter
  - `sortBy` *(optional, string, default: `"updatedAt"`)*: `"name" | "price" | "stock" | "updatedAt"`
  - `sortOrder` *(optional, string, default: `"desc"`)*: `"asc" | "desc"`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": [
    {
      "id": "prod-nx-aud-9420",
      "name": "AeroSound Pro Wireless ANC",
      "variantLabel": "3 variants",
      "sku": "NX-AUD-9420",
      "upc": "84930211",
      "category": "Electronics & Audio",
      "brand": "AeroSound",
      "stockCount": 142,
      "stockState": "in_stock",
      "stockPercentage": 78,
      "stockNote": "14 reserved in carts",
      "price": 199.00,
      "originalPrice": 249.00,
      "costPrice": 108.00,
      "marginPercent": 45.7,
      "status": "published",
      "unitsSold30d": 144,
      "revenue30dText": "$28.6k revenue",
      "lastUpdatedDate": "Today, 11:20 AM",
      "lastUpdatedBy": "Alex W.",
      "imageUrl": "https://lh3.googleusercontent.com/..."
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 428,
    "totalPages": 43,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2.3 GET Single Product Details
Fetch complete product data to populate the Add/Edit form.

- **Endpoint:** `GET /api/v1/admin/products/:id`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "id": "prod-nx-aud-9420",
    "title": "AeroSound Studio Wireless Headphones Pro",
    "slug": "aerosound-studio-wireless-headphones-pro",
    "subtitle": "Flagship over-ear hybrid active noise cancelling headphones with 60h battery life",
    "descriptionHtml": "<p>Immerse yourself in precision-tuned acoustics...</p>",
    "mediaItems": [
      {
        "id": "img-1",
        "url": "https://lh3.googleusercontent.com/...",
        "alt": "Studio shot of matte black luxury headphones",
        "isPrimary": true
      }
    ],
    "videoUrl": "https://youtube.com/watch?v=example",
    "has3dAsset": true,
    "basePrice": 199.00,
    "comparePrice": 249.00,
    "costPrice": 82.50,
    "chargeTax": true,
    "taxProfile": "Standard Consumer Goods (8.25%)",
    "sku": "NX-AUD-PRO-BLK",
    "barcode": "840192837491",
    "stockCount": 225,
    "lowStockThreshold": 15,
    "outOfStockPolicy": "stop_selling",
    "hasVariants": true,
    "colorOptions": [
      { "id": "c-1", "label": "Midnight Black", "colorHex": "#0f172a" },
      { "id": "c-2", "label": "Matte Silver", "colorHex": "#cbd5e1" },
      { "id": "c-3", "label": "Navy Blue", "colorHex": "#1e3a8a" }
    ],
    "careOptions": [
      { "id": "w-1", "label": "Standard 1-Year", "extraPrice": 0 },
      { "id": "w-2", "label": "NexaCare+ 2-Year", "extraPrice": 29 }
    ],
    "variants": [
      {
        "id": "v-1",
        "title": "Midnight Black / Std 1Y",
        "colorHex": "#0f172a",
        "sku": "NX-AUD-BLK-1Y",
        "price": 199.00,
        "stock": 90,
        "isActive": true
      }
    ],
    "weight": 320,
    "weightUnit": "g",
    "length": 22,
    "width": 18,
    "height": 8,
    "dimensionUnit": "cm",
    "hsCode": "8518.30.2000",
    "shippingProfile": "Standard Fragile Electronics (Insured 2-Day)",
    "productStatus": "published",
    "cornerRibbon": "BESTSELLER",
    "category": "Electronics > Audio > Over-Ear Headphones",
    "brand": "Nexa Audio Labs (Internal)",
    "collections": [
      "Featured Highlights (Home Grid)",
      "Best Sellers 2025"
    ],
    "tags": ["anc", "wireless", "bluetooth 5.3"],
    "customerHighlights": [
      "42dB Hybrid Active Noise Cancellation",
      "60-Hour Total Battery Life with Fast Charge"
    ],
    "allowPhotoReviews": true,
    "featureInSpotlight": true
  },
  "meta": null
}
```

---

### 2.4 POST Create Product
Create and publish a new product or save as draft.

- **Endpoint:** `POST /api/v1/admin/products`
- **Request Body:**
```json
{
  "title": "AeroSound Studio Wireless Headphones Pro",
  "slug": "aerosound-studio-wireless-headphones-pro",
  "subtitle": "Flagship over-ear hybrid active noise cancelling headphones",
  "descriptionHtml": "<p>Immerse yourself in precision-tuned acoustics...</p>",
  "mediaItems": [
    {
      "url": "https://cdn.nexa-store.com/products/headphones-1.jpg",
      "alt": "Front view",
      "isPrimary": true
    }
  ],
  "videoUrl": "https://youtube.com/watch?v=...",
  "has3dAsset": false,
  "basePrice": 199.00,
  "comparePrice": 249.00,
  "costPrice": 82.50,
  "chargeTax": true,
  "taxProfile": "Standard Consumer Goods (8.25%)",
  "sku": "NX-AUD-PRO-BLK",
  "barcode": "840192837491",
  "stockCount": 225,
  "lowStockThreshold": 15,
  "outOfStockPolicy": "stop_selling",
  "hasVariants": true,
  "colorOptions": [
    { "label": "Midnight Black", "colorHex": "#0f172a" }
  ],
  "careOptions": [
    { "label": "Standard 1-Year", "extraPrice": 0 }
  ],
  "variants": [
    {
      "title": "Midnight Black / Std 1Y",
      "colorHex": "#0f172a",
      "sku": "NX-AUD-BLK-1Y",
      "price": 199.00,
      "stock": 225,
      "isActive": true
    }
  ],
  "weight": 320,
  "weightUnit": "g",
  "length": 22,
  "width": 18,
  "height": 8,
  "dimensionUnit": "cm",
  "hsCode": "8518.30.2000",
  "shippingProfile": "Standard Fragile Electronics (Insured 2-Day)",
  "productStatus": "published",
  "cornerRibbon": "BESTSELLER",
  "category": "Electronics & Audio",
  "brand": "AeroSound",
  "collections": ["Featured Highlights (Home Grid)"],
  "tags": ["anc", "wireless", "bluetooth 5.3"],
  "customerHighlights": [
    "42dB Hybrid Active Noise Cancellation"
  ],
  "allowPhotoReviews": true,
  "featureInSpotlight": true
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "status": 201,
  "message": "Product created and published successfully.",
  "data": {
    "id": "prod-nx-aud-9420",
    "sku": "NX-AUD-PRO-BLK",
    "slug": "aerosound-studio-wireless-headphones-pro",
    "productStatus": "published",
    "createdAt": "2026-11-01T15:00:00.000Z"
  },
  "meta": null
}
```

---

### 2.5 PUT Update Product
Update all metadata, inventory, variants, and pricing of an existing product.

- **Endpoint:** `PUT /api/v1/admin/products/:id`
- **Request Body:** Same schema as `POST /api/v1/admin/products`.
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Product #prod-nx-aud-9420 updated successfully.",
  "data": {
    "id": "prod-nx-aud-9420",
    "updatedAt": "2026-11-01T15:10:00.000Z"
  },
  "meta": null
}
```

---

### 2.6 DELETE Delete Single Product
Delete product from catalog (fails if product has active orders, soft-archives instead).

- **Endpoint:** `DELETE /api/v1/admin/products/:id`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Product successfully deleted.",
  "data": {
    "deletedId": "prod-nx-aud-9420"
  },
  "meta": null
}
```

---

### 2.7 PATCH Quick Toggle Product Status
- **Endpoint:** `PATCH /api/v1/admin/products/:id/status`
- **Request Body:**
```json
{
  "status": "archived" // "published" | "draft" | "unpublished" | "archived"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Product status changed to 'archived'.",
  "data": {
    "id": "prod-nx-aud-9420",
    "status": "archived"
  },
  "meta": null
}
```

---

### 2.8 POST Bulk Status Update
- **Endpoint:** `POST /api/v1/admin/products/bulk-status`
- **Request Body:**
```json
{
  "productIds": ["prod-1", "prod-2", "prod-3"],
  "status": "published" // "published" | "unpublished" | "archived"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Updated status for 3 products.",
  "data": {
    "affectedCount": 3
  },
  "meta": null
}
```

---

### 2.9 POST Bulk Price Update
Adjust retail price across selected products by percentage or fixed delta.

- **Endpoint:** `POST /api/v1/admin/products/bulk-price`
- **Request Body:**
```json
{
  "productIds": ["prod-1", "prod-2"],
  "adjustmentType": "percentage", // "percentage" | "fixed_amount"
  "value": 5.0 // +5%
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Adjusted pricing for 2 products (+5%).",
  "data": {
    "affectedCount": 2
  },
  "meta": null
}
```

---

### 2.10 POST Bulk Delete Products
- **Endpoint:** `POST /api/v1/admin/products/bulk-delete`
- **Request Body:**
```json
{
  "productIds": ["prod-1", "prod-2"]
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Deleted 2 products from catalog.",
  "data": {
    "deletedCount": 2
  },
  "meta": null
}
```

---

### 2.11 GET Export Catalog
Stream catalog download in CSV or JSON.

- **Endpoint:** `GET /api/v1/admin/products/export`
- **Query Parameters:**
  - `format` *(string, default: `"json"`)*: `"json" | "csv"`
- **Response:** File attachment stream (`Content-Disposition: attachment; filename="catalog-export-2026.json"`).

---

### 2.12 GET Check SKU Availability
- **Endpoint:** `GET /api/v1/admin/products/check-sku`
- **Query Parameters:**
  - `sku` *(required, string)*: e.g. `NX-AUD-PRO-BLK`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "available": true,
    "sku": "NX-AUD-PRO-BLK"
  },
  "meta": null
}
```

---

### 2.13 GET Check Slug Availability
- **Endpoint:** `GET /api/v1/admin/products/check-slug`
- **Query Parameters:**
  - `slug` *(required, string)*: e.g. `aerosound-studio-wireless-headphones-pro`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "available": true,
    "slug": "aerosound-studio-wireless-headphones-pro"
  },
  "meta": null
}
```

---

## 4. Module 3: Media & Assets

### 3.1 POST Upload Media Asset
Upload high-resolution image, video, or 3D GLB file to Cloud Storage (S3 / GCS).

- **Endpoint:** `POST /api/v1/admin/media/upload`
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `file` *(required, File)*: Supported: JPG, PNG, WEBP, MP4, .GLB (max 50MB)
  - `folder` *(optional, string, default: `"products"`)*
- **Response `201 Created`:**
```json
{
  "success": true,
  "status": 201,
  "message": "Asset uploaded successfully.",
  "data": {
    "id": "asset-98214",
    "url": "https://cdn.nexa-store.com/media/products/aerosound-cover.webp",
    "filename": "aerosound-cover.webp",
    "mimeType": "image/webp",
    "sizeBytes": 145408,
    "dimensions": {
      "width": 1200,
      "height": 1200
    }
  },
  "meta": null
}
```

---

### 3.2 DELETE Delete Media Asset
- **Endpoint:** `DELETE /api/v1/admin/media/:id`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Asset deleted.",
  "data": { "deletedId": "asset-98214" },
  "meta": null
}
```

---

## 5. Module 4: Categories & Taxonomy

### 5.1 GET Categories KPI Metrics
- **Endpoint:** `GET /api/v1/admin/categories/kpis`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "totalCategories": 28,
    "newThisQuarter": 3,
    "activeDisplay": 24,
    "activePercentText": "85.7% Live",
    "avgProductsPerCategory": 42,
    "featuredCollectionsCount": 6
  },
  "meta": null
}
```

---

### 5.2 GET Categories Tree & List
Retrieve hierarchical taxonomy tree or flat categories with search and status filters.

- **Endpoint:** `GET /api/v1/admin/categories`
- **Query Parameters:**
  - `view` *(optional, string, default: `"flat"`)*: `"flat" | "tree"`
  - `status` *(optional, string, default: `"all"`)*: `"all" | "active" | "draft" | "scheduled" | "archived"`
  - `level` *(optional, string, default: `"all"`)*: `"all" | "root" | "subcategory"`
  - `search` *(optional, string)*: Category name or slug search
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": [
    {
      "id": "cat-elec",
      "name": "Electronics & Audio",
      "slug": "electronics-audio",
      "fullPath": "/electronics-audio",
      "description": "Flagship electronics, audio gear, and personal listening",
      "level": "root",
      "parentId": null,
      "parentName": null,
      "imageUrl": "https://cdn.nexa-store.com/categories/electronics.webp",
      "imageFileName": "electronics-audio-hero.webp",
      "imageSizeText": "1200 x 1200px (164 KB)",
      "totalProductsCount": 142,
      "subcategoriesCount": 4,
      "status": "active",
      "isFeatured": true,
      "displayOrder": "#1"
    },
    {
      "id": "cat-elec-audio-phones",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "fullPath": "/electronics-audio/wireless-headphones",
      "description": "Noise canceling & in-ear monitors",
      "level": "subcategory",
      "parentId": "cat-elec",
      "parentName": "Electronics & Audio",
      "imageUrl": "https://cdn.nexa-store.com/categories/headphones.webp",
      "imageFileName": "wireless-headphones.webp",
      "imageSizeText": "800 x 800px (98 KB)",
      "totalProductsCount": 48,
      "status": "active",
      "isFeatured": false,
      "displayOrder": "#1.1"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "totalItems": 28,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 5.3 GET Single Category Details
- **Endpoint:** `GET /api/v1/admin/categories/:id`
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "id": "cat-elec",
    "name": "Electronics & Audio",
    "slug": "electronics-audio",
    "fullPath": "/electronics-audio",
    "description": "Flagship electronics, audio gear, and personal listening",
    "level": "root",
    "parentId": null,
    "imageUrl": "https://cdn.nexa-store.com/categories/electronics.webp",
    "imageFileName": "electronics-audio-hero.webp",
    "imageSizeText": "1200 x 1200px (164 KB)",
    "status": "active"
  },
  "meta": null
}
```

---

### 5.4 POST Create Category
Create a new root category or child subcategory.

- **Endpoint:** `POST /api/v1/admin/categories`
- **Request Body:**
```json
{
  "name": "Smart Wearables",
  "slug": "smart-wearables",
  "parentId": "cat-elec", // or null for root parent
  "description": "Explore biometric fitness trackers, smartwatch accessories, and health monitors.",
  "imageUrl": "https://cdn.nexa-store.com/categories/smart-wearables.webp",
  "imageFileName": "smart-wearables-cover-2025.webp",
  "imageSizeText": "1080 x 1080px (142 KB)",
  "status": "active" // "active" | "draft" | "scheduled"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "status": 201,
  "message": "Category 'Smart Wearables' created successfully.",
  "data": {
    "id": "cat-smart-wearables",
    "name": "Smart Wearables",
    "slug": "smart-wearables",
    "fullPath": "/electronics-audio/smart-wearables",
    "level": "subcategory",
    "createdAt": "2026-11-01T15:20:00.000Z"
  },
  "meta": null
}
```

---

### 5.5 PUT Update Category
- **Endpoint:** `PUT /api/v1/admin/categories/:id`
- **Request Body:** Same schema as `POST /api/v1/admin/categories`.
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Category updated successfully.",
  "data": {
    "id": "cat-smart-wearables",
    "updatedAt": "2026-11-01T15:25:00.000Z"
  },
  "meta": null
}
```

---

### 5.6 DELETE Delete Category
Delete category (optionally re-assigning child products to a fallback category).

- **Endpoint:** `DELETE /api/v1/admin/categories/:id`
- **Query Parameters:**
  - `reassignToId` *(optional, string)*: Category ID to receive orphan products
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": "Category deleted. Products reassigned.",
  "data": {
    "deletedId": "cat-smart-wearables"
  },
  "meta": null
}
```

---

### 5.7 GET Check Category Slug Availability
- **Endpoint:** `GET /api/v1/admin/categories/check-slug`
- **Query Parameters:**
  - `slug` *(required, string)*
- **Response `200 OK`:**
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": {
    "available": true,
    "slug": "smart-wearables"
  },
  "meta": null
}
```

---

## 6. Enums & Types Dictionary

```typescript
// Product Publishing States
export type ProductStatus = 'published' | 'draft' | 'unpublished' | 'archived';

// Stock Availability States
export type ProductStockState = 'in_stock' | 'low_stock' | 'critical_low' | 'out_of_stock';

// Out of Stock Order Policy
export type OutOfStockPolicy = 'stop_selling' | 'accept_backorders';

// Order Payment Statuses
export type OrderPaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

// Order Fulfillment Statuses
export type OrderFulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Category Taxonomic Level
export type CategoryLevel = 'root' | 'subcategory';

// Category Visibility Statuses
export type CategoryStatus = 'active' | 'draft' | 'scheduled' | 'archived';

// Corner Storefront Ribbons
export type StorefrontCornerRibbon = 'BESTSELLER' | 'NEW ARRIVAL' | '20% OFF' | 'STAFF PICK' | 'None';
```

---

*Contract ratified on November 1, 2026. Changes to this document must be versioned and coordinated between Frontend and Backend leads.*

