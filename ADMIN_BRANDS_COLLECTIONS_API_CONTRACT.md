# Admin API Specification: Products (Missing Endpoints), Brands & Collections

> **Version:** 1.0.0  
> **Base URL:** `http://localhost:3000/api/v1` (or production: `/api/v1`)  
> **Auth Scheme:** `Authorization: Bearer <accessToken>`  
> **Target Controllers:** `ProductsAdminController`, `BrandsAdminController`, `CollectionsAdminController`  
> **Important Note:** Brand and Collection creation/updates with files **must use `multipart/form-data`**.

---

## Table of Contents
1. [Part 1: Missing Product Endpoints (High Priority)](#part-1-missing-product-endpoints-high-priority)
   - [1.1 PATCH /api/v1/admin/products/:id/status](#11-patch-apiv1adminproductsidstatus)
   - [1.2 POST /api/v1/admin/products/bulk-status](#12-post-apiv1adminproductsbulk-status)
2. [Part 2: Brands & Manufacturers Module (`/api/v1/admin/brands`)](#part-2-brands--manufacturers-module)
   - [2.1 POST Create Brand (`multipart/form-data`)](#21-post-create-brand-multipartform-data)
   - [2.2 GET All Brands (Paginated & Filtered)](#22-get-all-brands-paginated--filtered)
   - [2.3 GET Brand KPI Metrics](#23-get-brand-kpi-metrics)
   - [2.4 GET Check Brand Slug Availability](#24-get-check-brand-slug-availability)
   - [2.5 GET Single Brand Details](#25-get-single-brand-details)
   - [2.6 PUT / PATCH Update Brand (`multipart/form-data`)](#26-put--patch-update-brand-multipartform-data)
   - [2.7 DELETE Delete Brand](#27-delete-delete-brand)
   - [2.8 POST Bulk Status Update for Brands](#28-post-bulk-status-update-for-brands)
   - [2.9 POST Bulk Delete Brands](#29-post-bulk-delete-brands)
3. [Part 3: Collections & Curations Module (`/api/v1/admin/collections`)](#part-3-collections--curations-module)
   - [3.1 POST Create Collection (`multipart/form-data`)](#31-post-create-collection-multipartform-data)
   - [3.2 GET All Collections (Paginated & Filtered)](#32-get-all-collections-paginated--filtered)
   - [3.3 GET Collection KPI Metrics](#33-get-collection-kpi-metrics)
   - [3.4 GET Check Collection Slug Availability](#34-get-check-collection-slug-availability)
   - [3.5 GET Single Collection Details](#35-get-single-collection-details)
   - [3.6 PUT / PATCH Update Collection (`multipart/form-data`)](#36-put--patch-update-collection-multipartform-data)
   - [3.7 DELETE Delete Collection](#37-delete-delete-collection)
   - [3.8 POST Bulk Status Update for Collections](#38-post-bulk-status-update-for-collections)
   - [3.9 POST Bulk Delete Collections](#39-post-bulk-delete-collections)
   - [3.10 POST Assign / Remove Products from Collection](#310-post-assign--remove-products-from-collection)


---

# Part 1: Missing Product Endpoints (High Priority)

The following two endpoints are required for product lifecycle and bulk catalog actions in the admin table.

---

### 1.1 PATCH `/api/v1/admin/products/:id/status`

Changes the publishing lifecycle status of a single product.

* **Method:** `PATCH`
* **URL:** `/api/v1/admin/products/:id/status`
* **Headers:**
  ```http
  Authorization: Bearer <accessToken>
  Content-Type: application/json
  ```

#### Request Body
```json
{
  "status": "archived"
}
```
* **Allowed Values for `status`:** `"published"` | `"draft"` | `"unpublished"` | `"archived"`

#### Response `200 OK`
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

#### Error Responses
* **`400 Bad Request`**: Invalid status value provided.
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Invalid status. Must be one of: published, draft, unpublished, archived.",
    "errors": ["status must be a valid enum value"]
  }
  ```
* **`404 Not Found`**: Product ID does not exist.

---

### 1.2 POST `/api/v1/admin/products/bulk-status`

Applies a status change to multiple selected products in a single database transaction.

* **Method:** `POST`
* **URL:** `/api/v1/admin/products/bulk-status`
* **Headers:**
  ```http
  Authorization: Bearer <accessToken>
  Content-Type: application/json
  ```

#### Request Body
```json
{
  "productIds": ["prod-1", "prod-2", "prod-3"],
  "status": "published"
}
```
* **Fields:**
  - `productIds` (`string[]`, required): Non-empty array of product IDs to update.
  - `status` (`string`, required): Target state: `"published"` | `"unpublished"` | `"archived"`.

#### Response `200 OK`
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

# Part 2: Brands & Manufacturers Module

Base Route: `/api/v1/admin/brands`  
Controller: `BrandsAdminController`  
Guards: `@UseGuards(JwtAccessGuard)` + `@Roles(UserRole.ADMIN)`

---

### 2.1 POST `/api/v1/admin/brands` (Create Brand)

Creates a new brand/manufacturer entry with an uploaded logo file.

* **Method:** `POST`
* **URL:** `/api/v1/admin/brands`
* **Content-Type:** `multipart/form-data`
* **Headers:**
  ```http
  Authorization: Bearer <accessToken>
  ```

#### Multipart Form Fields
| Field Name | Type | Required | Description / Rules |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Brand name (min 2, max 100 characters). E.g., `AeroSound` |
| `slug` | string | **Yes** | Unique URL slug (kebab-case alphanumeric). E.g., `aerosound` |
| `logo` | Binary File | No | Single image file (PNG, JPG, WEBP, SVG), max 5MB |
| `websiteUrl` | string | No | Official website URL (valid URL). E.g., `https://aerosound.audio` |
| `country` | string | No | Country of origin (e.g., `Germany`, `United States`, `Japan`) |
| `description` | string | No | Brand history and hardware specialty overview (max 1000 chars) |
| `status` | string | No | Enum: `ACTIVE` \| `INACTIVE` \| `ARCHIVED` (Default: `ACTIVE`) |
| `isInternal` | boolean | No | String `'true'` or `'false'`. Indicates in-house proprietary brand |
| `contactEmail`| string | No | Brand partner or support contact email |

#### Response `201 Created`
```json
{
  "success": true,
  "status": 201,
  "message": "Brand created successfully.",
  "data": {
    "id": "brand-aerosound-01",
    "name": "AeroSound",
    "slug": "aerosound",
    "logoUrl": "http://localhost:3000/uploads/brands/aerosound-logo-uuid.webp",
    "websiteUrl": "https://aerosound.audio",
    "country": "Germany",
    "description": "Studio-grade wireless monitors and precision audio equipment.",
    "status": "ACTIVE",
    "isInternal": false,
    "productCount": 0,
    "contactEmail": "contact@aerosound.audio",
    "createdAt": "2026-03-20T09:15:00.000Z",
    "updatedAt": "2026-03-20T09:15:00.000Z"
  },
  "meta": null
}
```

#### Error Responses
* **`400 Bad Request`**: Validation failed (missing required name/slug, or invalid image MIME type).
* **`409 Conflict`**: Brand slug already exists.
  ```json
  {
    "success": false,
    "statusCode": 409,
    "message": "Brand with slug 'aerosound' already exists."
  }
  ```

---

### 2.2 GET `/api/v1/admin/brands` (Get All Brands)

Retrieves a paginated list of brands with search, faceted filtering, and sorting.

* **Method:** `GET`
* **URL:** `/api/v1/admin/brands`
* **Query Parameters:**
  - `page` (`number`, default `1`): Current page.
  - `limit` (`number`, default `20`): Items per page.
  - `search` (`string`, optional): Search query matching brand `name`, `slug`, or `country`.
  - `status` (`string`, optional): Filter by status: `ACTIVE`, `INACTIVE`, `ARCHIVED`, or `ALL`.
  - `type` (`string`, optional): `ALL`, `INTERNAL` (only in-house), or `PARTNER` (external).
  - `sortBy` (`string`, default `name`): `name` | `productCount` | `createdAt` | `updatedAt`.
  - `sortOrder` (`string`, default `asc`): `asc` | `desc`.

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": [
    {
      "id": "brand-nexa-01",
      "name": "Nexa Audio Labs (Internal)",
      "slug": "nexa-audio-labs",
      "logoUrl": "http://localhost:3000/uploads/brands/nexa-logo.webp",
      "websiteUrl": "https://nexastore.com",
      "country": "United States",
      "description": "In-house precision audio hardware.",
      "status": "ACTIVE",
      "isInternal": true,
      "productCount": 14,
      "contactEmail": "hardware@nexastore.com",
      "createdAt": "2025-01-10T08:00:00.000Z",
      "updatedAt": "2026-03-12T14:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 7,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 2.3 GET `/api/v1/admin/brands/metrics` (Brand KPIs)

Returns catalog KPI statistics for brands.

* **Method:** `GET`
* **URL:** `/api/v1/admin/brands/metrics`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": {
    "totalBrands": 7,
    "activeBrands": 6,
    "internalBrands": 1,
    "totalProductsAssigned": 94
  },
  "meta": null
}
```

---

### 2.4 GET `/api/v1/admin/brands/check-slug`

Checks whether a brand slug is available or already taken.

* **Method:** `GET`
* **URL:** `/api/v1/admin/brands/check-slug?slug=aerosound`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": {
    "available": true,
    "slug": "aerosound"
  },
  "meta": null
}
```

---

### 2.5 GET `/api/v1/admin/brands/:id`

Retrieves a single brand profile including list or count of associated products.

* **Method:** `GET`
* **URL:** `/api/v1/admin/brands/:id`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "brand-aerosound-01",
    "name": "AeroSound",
    "slug": "aerosound",
    "logoUrl": "http://localhost:3000/uploads/brands/aerosound-logo.webp",
    "websiteUrl": "https://aerosound.audio",
    "country": "Germany",
    "description": "Studio-grade wireless monitors.",
    "status": "ACTIVE",
    "isInternal": false,
    "productCount": 9,
    "createdAt": "2025-02-15T11:20:00.000Z",
    "updatedAt": "2026-03-20T09:15:00.000Z"
  },
  "meta": null
}
```

---

### 2.6 PUT / PATCH `/api/v1/admin/brands/:id` (Update Brand)

Updates brand details and optionally replaces or retains the existing logo.

* **Method:** `PUT` or `PATCH`
* **URL:** `/api/v1/admin/brands/:id`
* **Content-Type:** `multipart/form-data`

#### Multipart Form Fields
- Any of the fields from Section 2.1 (optional).
- If `logo` file is included, replaces the old logo file in storage and updates `logoUrl`.
- If `logo` is omitted, the existing logo is preserved.

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "message": "Brand updated successfully.",
  "data": {
    "id": "brand-aerosound-01",
    "name": "AeroSound International",
    "slug": "aerosound",
    "status": "ACTIVE"
  }
}
```

---

### 2.7 DELETE `/api/v1/admin/brands/:id`

Deletes or archives a brand. If products are attached, sets their `brandId` to `null` or rejects with a notice.

* **Method:** `DELETE`
* **URL:** `/api/v1/admin/brands/:id`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "message": "Brand deleted successfully."
}
```

---

### 2.8 POST `/api/v1/admin/brands/bulk-status`

* **Method:** `POST`
* **URL:** `/api/v1/admin/brands/bulk-status`
* **Request Body:**
  ```json
  {
    "brandIds": ["brand-1", "brand-2"],
    "status": "ACTIVE"
  }
  ```
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Updated status for 2 brands.",
    "data": { "affectedCount": 2 }
  }
  ```

---

### 2.9 POST `/api/v1/admin/brands/bulk-delete`

* **Method:** `POST`
* **URL:** `/api/v1/admin/brands/bulk-delete`
* **Request Body:**
  ```json
  {
    "brandIds": ["brand-1", "brand-2"]
  }
  ```
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Successfully deleted 2 brands.",
    "data": { "affectedCount": 2 }
  }
  ```

---

# Part 3: Collections & Curations Module

Base Route: `/api/v1/admin/collections`  
Controller: `CollectionsAdminController`  
Guards: `@UseGuards(JwtAccessGuard)` + `@Roles(UserRole.ADMIN)`

> **Design Choice Note:** `curationType` has been removed in favor of a clean, manual / direct relationship model where products are associated with collections via `collectionIds` or the relation table `_CollectionToProduct`.

---

### 3.1 POST `/api/v1/admin/collections` (Create Collection)

Creates a new curated collection with an uploaded banner/cover image.

* **Method:** `POST`
* **URL:** `/api/v1/admin/collections`
* **Content-Type:** `multipart/form-data`
* **Headers:**
  ```http
  Authorization: Bearer <accessToken>
  ```

#### Multipart Form Fields
| Field Name | Type | Required | Description / Rules |
| :--- | :--- | :--- | :--- |
| `title` | string | **Yes** | Collection title (min 3, max 120 chars). E.g., `Best Sellers 2025` |
| `slug` | string | **Yes** | Unique URL slug (kebab-case). E.g., `best-sellers-2025` |
| `image` | Binary File | No | Single cover image (PNG, JPG, WEBP), max 10MB |
| `description` | string | No | Marketing description displayed atop collection (max 2000 chars) |
| `displayLocation`| string | No | Enum: `HOME_GRID` \| `STOREFRONT_CATALOG` \| `BANNER` \| `SIDEBAR` (Default: `STOREFRONT_CATALOG`) |
| `status` | string | No | Enum: `ACTIVE` \| `SCHEDULED` \| `DRAFT` \| `ARCHIVED` (Default: `ACTIVE`) |
| `isFeatured` | boolean | No | String `'true'` or `'false'`. Whether featured on homepage hero grid |
| `badgeText` | string | No | Ribbon text. E.g., `FEATURED 2026`, `TOP VELOCITY`, `LIMITED RUN` |
| `productIds` | string[] | No | Array of initial product IDs to include in this collection |

#### Response `201 Created`
```json
{
  "success": true,
  "status": 201,
  "message": "Collection created successfully.",
  "data": {
    "id": "col-bestsellers-02",
    "title": "Best Sellers 2025",
    "slug": "best-sellers-2025",
    "imageUrl": "http://localhost:3000/uploads/collections/best-sellers-uuid.webp",
    "description": "Top velocity SKUs with highest customer ratings.",
    "displayLocation": "STOREFRONT_CATALOG",
    "status": "ACTIVE",
    "isFeatured": true,
    "badgeText": "TOP VELOCITY",
    "productCount": 0,
    "createdAt": "2026-04-14T15:20:00.000Z",
    "updatedAt": "2026-04-14T15:20:00.000Z"
  },
  "meta": null
}
```

---

### 3.2 GET `/api/v1/admin/collections` (Get All Collections)

Retrieves a paginated list of collections.

* **Method:** `GET`
* **URL:** `/api/v1/admin/collections`
* **Query Parameters:**
  - `page` (`number`, default `1`): Current page.
  - `limit` (`number`, default `20`): Items per page.
  - `search` (`string`, optional): Search matching collection `title`, `slug`, or `badgeText`.
  - `status` (`string`, optional): Filter: `ACTIVE`, `SCHEDULED`, `DRAFT`, `ARCHIVED`, `ALL`.
  - `location` (`string`, optional): `HOME_GRID`, `STOREFRONT_CATALOG`, `BANNER`, `SIDEBAR`, `ALL`.
  - `sortBy` (`string`, default `title`): `title` | `productCount` | `createdAt` | `updatedAt`.
  - `sortOrder` (`string`, default `asc`): `asc` | `desc`.

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "message": null,
  "data": [
    {
      "id": "col-home-grid-01",
      "title": "Featured Highlights (Home Grid)",
      "slug": "featured-highlights-home-grid",
      "imageUrl": "http://localhost:3000/uploads/collections/home-grid.webp",
      "description": "Hero tier flagship hardware showcased on homepage.",
      "displayLocation": "HOME_GRID",
      "status": "ACTIVE",
      "isFeatured": true,
      "badgeText": "FEATURED 2026",
      "productCount": 8,
      "createdAt": "2025-01-01T08:00:00.000Z",
      "updatedAt": "2026-04-12T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 6,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 3.3 GET `/api/v1/admin/collections/metrics` (Collection KPIs)

Returns collection curation KPI statistics.

* **Method:** `GET`
* **URL:** `/api/v1/admin/collections/metrics`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": {
    "totalCollections": 6,
    "activeCollections": 4,
    "featuredCount": 2,
    "curatedProductsCount": 51
  },
  "meta": null
}
```

---

### 3.4 GET `/api/v1/admin/collections/check-slug`

Checks whether a collection slug is available.

* **Method:** `GET`
* **URL:** `/api/v1/admin/collections/check-slug?slug=best-sellers-2025`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": {
    "available": true,
    "slug": "best-sellers-2025"
  },
  "meta": null
}
```

---

### 3.5 GET `/api/v1/admin/collections/:id`

Retrieves a single collection with its attached product items.

* **Method:** `GET`
* **URL:** `/api/v1/admin/collections/:id`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "col-home-grid-01",
    "title": "Featured Highlights (Home Grid)",
    "slug": "featured-highlights-home-grid",
    "imageUrl": "http://localhost:3000/uploads/collections/home-grid.webp",
    "description": "Hero tier flagship hardware.",
    "displayLocation": "HOME_GRID",
    "status": "ACTIVE",
    "isFeatured": true,
    "badgeText": "FEATURED 2026",
    "productCount": 8,
    "products": [
      {
        "id": "prod-1",
        "title": "AeroSound ANC Pro",
        "sku": "AERO-HEADPHONE-001",
        "basePrice": 199.99,
        "imageUrl": "http://localhost:3000/uploads/products/aero.webp"
      }
    ],
    "createdAt": "2025-01-01T08:00:00.000Z",
    "updatedAt": "2026-04-12T10:00:00.000Z"
  },
  "meta": null
}
```

---

### 3.6 PUT / PATCH `/api/v1/admin/collections/:id` (Update Collection)

Updates collection metadata and optionally replaces the banner image.

* **Method:** `PUT` or `PATCH`
* **URL:** `/api/v1/admin/collections/:id`
* **Content-Type:** `multipart/form-data`

#### Multipart Form Fields
- Any field from Section 3.1.
- `image` (binary file): If provided, replaces the old file in disk storage.

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "message": "Collection updated successfully.",
  "data": {
    "id": "col-home-grid-01",
    "title": "Featured Highlights (Updated)",
    "slug": "featured-highlights-home-grid",
    "status": "ACTIVE"
  }
}
```

---

### 3.7 DELETE `/api/v1/admin/collections/:id`

Deletes a collection. Does NOT delete the associated products; simply removes their association.

* **Method:** `DELETE`
* **URL:** `/api/v1/admin/collections/:id`

#### Response `200 OK`
```json
{
  "success": true,
  "status": 200,
  "message": "Collection deleted successfully."
}
```

---

### 3.8 POST `/api/v1/admin/collections/bulk-status`

* **Method:** `POST`
* **URL:** `/api/v1/admin/collections/bulk-status`
* **Request Body:**
  ```json
  {
    "collectionIds": ["col-1", "col-2"],
    "status": "ACTIVE"
  }
  ```
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Updated status for 2 collections.",
    "data": { "affectedCount": 2 }
  }
  ```

---

### 3.9 POST `/api/v1/admin/collections/bulk-delete`

* **Method:** `POST`
* **URL:** `/api/v1/admin/collections/bulk-delete`
* **Request Body:**
  ```json
  {
    "collectionIds": ["col-1", "col-2"]
  }
  ```
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Successfully deleted 2 collections.",
    "data": { "affectedCount": 2 }
  }
  ```

---

### 3.10 POST `/api/v1/admin/collections/:id/products`

Adds or removes products from a collection.

* **Method:** `POST`
* **URL:** `/api/v1/admin/collections/:id/products`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "action": "add",
    "productIds": ["prod-nx-01", "prod-nx-02"]
  }
  ```
  * `action` options: `"add"` | `"remove"` | `"set"` (replaces the entire collection items with provided IDs).
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Collection products updated successfully.",
    "data": {
      "collectionId": "col-bestsellers-02",
      "productCount": 16
    }
  }
  ```


