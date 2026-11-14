# Admin API Contract: Dashboard Overview, Orders Management & Promotions

> **Version:** 1.0.0  
> **Base URL:** `http://localhost:3000/api/v1` (Production: `/api/v1`)  
> **Auth Scheme:** `Authorization: Bearer <accessToken>` (Admin JWT Guard required for all endpoints)  
> **Standard Response Format:** `{ "success": boolean, "statusCode": number, "data": T, "meta"?: PaginationMeta, "message"?: string }`  
> **Date Format:** ISO 8601 Strings (`YYYY-MM-DDTHH:mm:ss.sssZ`)

---

## Table of Contents
1. [Architecture & Common Standards](#architecture--common-standards)
2. [Module 1: Dashboard Overview (`/api/v1/admin/dashboard`)](#module-1-dashboard-overview)
   - [1.1 GET Dashboard Overview Metrics & KPIs](#11-get-apiv1admindashboardmetrics)
   - [1.2 GET Sales Velocity & Revenue Chart](#12-get-apiv1admindashboardsales-chart)
   - [1.3 GET Live Operations Feed (Recent Orders)](#13-get-apiv1admindashboardrecent-orders)
   - [1.4 GET Critical Inventory & Operations Alerts](#14-get-apiv1admindashboardalerts)
3. [Module 2: Orders Management (`/api/v1/admin/orders`)](#module-2-orders-management)
   - [2.1 GET All Orders (Table List View)](#21-get-apiv1adminorders)
   - [2.2 GET Orders KPI Metrics & Tab Counts](#22-get-apiv1adminordersmetrics)
   - [2.3 GET Single Order Full Details (Command Center View)](#23-get-apiv1adminordersid)
   - [2.4 POST Fulfill Items & Generate Label](#24-post-apiv1adminordersidfulfill)
   - [2.5 PATCH Update Order Fulfillment & Tracking](#25-patch-apiv1adminordersidfulfillment)
   - [2.6 GET Order Packing Slip (Print PDF)](#26-get-apiv1adminordersidpacking-slip)
   - [2.7 GET Commercial Customs Invoice (Print PDF)](#27-get-apiv1adminordersidcommercial-invoice)
   - [2.8 POST Cancel Order (With Restock & Reason)](#28-post-apiv1adminordersidcancel)
   - [2.9 POST Process Order Refund](#29-post-apiv1adminordersidrefund)
   - [2.10 POST Add Order Timeline Event / Staff Note](#210-post-apiv1adminordersidnotes)
   - [2.11 POST Bulk Fulfill Orders (Batch Dispatch)](#211-post-apiv1adminordersbulk-fulfillment)
   - [2.12 POST Bulk Cancel Orders](#212-post-apiv1adminordersbulk-cancel)
   - [2.13 GET Export Orders (CSV)](#213-get-apiv1adminordersexport)
4. [Module 3: Promotions & Discount Codes (`/api/v1/admin/promotions`)](#module-3-promotions--discount-codes)
   - [3.1 GET All Promotions (Paginated, Search & Filtered)](#31-get-apiv1adminpromotions)
   - [3.2 GET Promotions KPI Metrics](#32-get-apiv1adminpromotionsmetrics)
   - [3.3 GET Check Promotion Code Availability](#33-get-apiv1adminpromotionscheck-code)
   - [3.4 GET Single Promotion Details](#34-get-apiv1adminpromotionsid)
   - [3.5 POST Create Promotion Code](#35-post-apiv1adminpromotions)
   - [3.6 PUT Update Promotion Code](#36-put-apiv1adminpromotionsid)
   - [3.7 PATCH Toggle Promotion Status](#37-patch-apiv1adminpromotionsidstatus)
   - [3.8 DELETE Delete Promotion](#38-delete-apiv1adminpromotionsid)
   - [3.9 POST Bulk Update Promotions Status](#39-post-apiv1adminpromotionsbulk-status)
   - [3.10 POST Bulk Delete Promotions](#310-post-apiv1adminpromotionsbulk-delete)
   - [3.11 GET Export Promotions (CSV)](#311-get-apiv1adminpromotionsexport)
5. [Data Models & TypeScript Interfaces](#data-models--typescript-interfaces)

---

# Architecture & Common Standards

### Global Headers
All admin requests require the access token passed in the Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Standard Error Responses
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["discountValue must not be greater than 100"],
  "timestamp": "2026-11-14T14:45:00.000Z",
  "path": "/api/v1/admin/..."
}
```
- **401 Unauthorized**: Missing or expired JWT token.
- **403 Forbidden**: Authenticated user is not an `ADMIN` or `SUPER_ADMIN`.
- **404 Not Found**: Target resource entity ID does not exist.
- **409 Conflict**: Unique constraint violation (e.g. Coupon code already in use).

---

# Module 1: Dashboard Overview

Targets UI Page: `Admin > Dashboard Overview` (`/admin` or `/admin/dashboard`).

---

### 1.1 GET `/api/v1/admin/dashboard/metrics`
Fetches top-level real-time KPI metric summary cards for the selected time range.

* **Method:** `GET`
* **URL:** `/api/v1/admin/dashboard/metrics`
* **Query Parameters:**
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `period` | string | No | `7d` | Time window: `today`, `7d`, `30d`, `90d`, `custom` |
  | `startDate` | string | No | - | ISO date string (required if `period=custom`) |
  | `endDate` | string | No | - | ISO date string (required if `period=custom`) |

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "period": "7d",
    "dateRangeLabel": "Last 7 Days (Nov 8 - Nov 14, 2026)",
    "sales": {
      "totalRevenue": 29970.00,
      "currency": "USD",
      "growthPercent": 14.2,
      "growthDirection": "up",
      "previousPeriodRevenue": 26243.43
    },
    "orders": {
      "totalOrders": 430,
      "growthPercent": 12.4,
      "growthDirection": "up",
      "previousPeriodOrders": 382
    },
    "aov": {
      "averageOrderValue": 69.70,
      "growthAmount": 4.73,
      "growthPercent": 7.3,
      "previousAov": 64.97
    },
    "fulfillment": {
      "needsFulfillment": 14,
      "urgentCount": 6,
      "label": "14 Orders",
      "urgentLabel": "6 Urgent"
    }
  }
}
```

---

### 1.2 GET `/api/v1/admin/dashboard/recent-orders`
Fetches the active operations order queue displayed on the dashboard table with tab counts.

* **Method:** `GET`
* **URL:** `/api/v1/admin/dashboard/recent-orders`
* **Query Parameters:**
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `tab` | string | No | `all` | `all`, `unfulfilled`, `in_transit`, `delivered`, `on_hold` |
  | `search` | string | No | - | Query order #, customer name, email, or SKU |
  | `limit` | number | No | `10` | Default 10 items |

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "tabCounts": {
      "all": 142,
      "unfulfilled": 24,
      "inTransit": 38,
      "delivered": 75,
      "onHold": 5
    },
    "orders": [
      {
        "id": "ord-8492019",
        "orderNumber": "#NX-8492019",
        "channel": "Online Web Store",
        "channelType": "web",
        "customer": {
          "id": "cust-102",
          "name": "Sarah Jenkins",
          "email": "sarah.j@outlook.com",
          "initials": "SJ"
        },
        "createdAt": "2026-11-14T14:28:00.000Z",
        "timeAgoText": "12 min ago",
        "paymentStatus": "paid",
        "fulfillmentStatus": "unfulfilled_priority",
        "fulfillmentLabel": "Unfulfilled (Priority)",
        "itemCount": 3,
        "itemsSummary": "AeroSound Pro, Cable 2m",
        "totalPrice": 272.46,
        "paymentMethod": "Stripe • Visa 4242"
      }
    ]
  }
}
```

---

# Module 2: Orders Management

Targets UI Pages:
1. **All Orders List View** (`Admin > Commerce > Orders` -> `/admin/orders`)
2. **Single Order Command Center** (`Admin > Orders > #NX-8492019` -> `/admin/orders/:id`)

> **Key Architectural Distinction:**
> - **`GET /api/v1/admin/orders` (All Orders)** is a lightweight, high-performance table feed containing order headers, customer summaries, item thumbnail arrays, totals, payment method badges, and status pills. It purposefully omits heavy relational data to ensure sub-50ms table rendering.
> - **`GET /api/v1/admin/orders/:id` (Single Order)** is the comprehensive operational command center. It returns full warehouse pick & pack locations (Bin numbers, Zone), carrier API integration details, customer lifetime profile & tier, USPS DPV address confirmation, itemized financial settlements (with coupon discounts), Stripe payment audit logs, fraud risk assessment scores, and the chronological activity timeline.

---

### 2.1 GET `/api/v1/admin/orders`
Retrieves the paginated list of orders for the **All Orders Table View**.

* **Method:** `GET`
* **URL:** `/api/v1/admin/orders`
* **Query Parameters:**
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | number | No | `1` | Page number |
  | `limit` | number | No | `20` | Orders per page |
  | `search` | string | No | - | Searches order #, customer name, email, or item SKU |
  | `tab` | string | No | `all` | Status Tab: `all`, `unfulfilled`, `in_transit`, `delivered`, `returns`, `cancelled` |
  | `paymentStatus` | string | No | - | Filter: `all`, `paid`, `pending_wire`, `refunded`, `failed` |
  | `fulfillmentStatus` | string | No | - | Filter: `all`, `unfulfilled`, `unfulfilled_priority`, `in_transit`, `delivered`, `on_hold`, `cancelled`, `returned` |
  | `channel` | string | No | - | Channel: `all`, `Online Web Store`, `Mobile App iOS`, `POS Retail` |
  | `dateRange` | string | No | `30d` | Preset: `today`, `7d`, `30d`, `90d`, `custom` |
  | `startDate` | string | No | - | ISO start date (when `dateRange=custom`) |
  | `endDate` | string | No | - | ISO end date (when `dateRange=custom`) |
  | `sortBy` | string | No | `createdAt` | Sort field: `createdAt`, `totalPrice`, `orderNumber`, `customerName` |
  | `sortOrder` | string | No | `desc` | Sort direction: `asc` or `desc` |

#### Success Response `200 OK` (Optimized Table List Item)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "orders": [
      {
        "id": "ord-8492019",
        "orderNumber": "#NX-8492019",
        "channel": "Online Web Store",
        "channelType": "web",
        "channelIcon": "globe",
        "createdAt": "2026-11-14T10:42:00.000Z",
        "dateTimeText": "Today, 10:42 AM",
        "timeAgoText": "18 mins ago",
        "customer": {
          "id": "cust-102",
          "name": "Sarah Jenkins",
          "email": "s.jenkins@icloud.com",
          "initials": "SJ",
          "avatarBg": "bg-emerald-100 text-emerald-800 border border-emerald-200"
        },
        "purchasedItems": {
          "itemCount": 2,
          "summaryText": "2 items",
          "itemsSummary": "AeroSound Pro ANC (1x), DeskPower 65W GaN (1x)",
          "thumbnails": [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80",
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=120&q=80"
          ]
        },
        "totalPrice": 272.46,
        "currency": "USD",
        "paymentMethodText": "Stripe • Visa 4242",
        "paymentStatus": "paid",
        "fulfillmentStatus": "unfulfilled_priority",
        "slaRemainingText": "SLA: 1h 42m remaining",
        "primaryAction": "Fulfill"
      },
      {
        "id": "ord-8492020",
        "orderNumber": "#NX-8492020",
        "channel": "Mobile App iOS",
        "channelType": "ios",
        "channelIcon": "smartphone",
        "createdAt": "2026-11-14T08:15:00.000Z",
        "dateTimeText": "Today, 08:15 AM",
        "timeAgoText": "3 hrs ago",
        "customer": {
          "id": "cust-103",
          "name": "Marcus Brody",
          "email": "m.brody@atlascorp.io",
          "initials": "MB",
          "avatarBg": "bg-primary/10 text-primary border border-primary/25"
        },
        "purchasedItems": {
          "itemCount": 1,
          "summaryText": "1 item",
          "itemsSummary": "AeroSound Studio ANC (1x)",
          "thumbnails": [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80"
          ]
        },
        "totalPrice": 199.00,
        "currency": "USD",
        "paymentMethodText": "Apple Pay • Master 8812",
        "paymentStatus": "paid",
        "fulfillmentStatus": "unfulfilled",
        "slaRemainingText": "SLA: 3h 15m remaining",
        "primaryAction": "Fulfill"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 1842,
    "totalPages": 93,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2.2 GET `/api/v1/admin/orders/metrics`
Fetches the 4 top KPI cards and tab counts for the Orders Management screen.

* **Method:** `GET`
* **URL:** `/api/v1/admin/orders/metrics`

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "kpis": {
      "totalOrders30D": {
        "value": "1,842",
        "changePercent": "+8.7%",
        "prevText": "Prev: 1,694 orders",
        "successRate": "99.2% success"
      },
      "needsDispatch": {
        "value": "24",
        "urgentCount": 6,
        "targetText": "Target: 100% within 4h",
        "statusText": "Action Required"
      },
      "inTransit": {
        "value": "68",
        "subText": "Orders en route",
        "carriersText": "FedEx: 42 • UPS: 26",
        "arrivingTodayCount": 4
      },
      "returnsAndExceptions": {
        "value": "7",
        "inspectionPendingCount": 3,
        "refundProcessedCount": 4,
        "returnRate": "0.38% return rate"
      }
    },
    "tabs": {
      "all": 1842,
      "unfulfilled": 24,
      "inTransit": 68,
      "delivered": 1712,
      "returns": 14,
      "cancelled": 24
    }
  }
}
```

---

### 2.3 GET `/api/v1/admin/orders/:id`
Retrieves the comprehensive order record for the **Single Order Command Center Page** (`OrderDetailPage`).

* **Method:** `GET`
* **URL:** `/api/v1/admin/orders/:id`
* **URL Param:** `id` (e.g. `ord-8492019` or `NX-8492019`)

#### Success Response `200 OK` (Full Single Order Details Graph)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "ord-8492019",
    "orderNumber": "#NX-8492019",
    "placedDateText": "Placed on April 14, 2025 at 10:24 AM EST via Online Web Store (Channel ID: US-WEB-01)",
    "channelName": "Online Web Store",
    "channelId": "US-WEB-01",
    "warehouseLocation": "Warehouse A - Seattle Primary Hub",
    "warehouseZone": "Zone 4 Active",
    "warehouseStatus": "active",
    "paymentStatus": "paid",
    "fulfillmentStatus": "unfulfilled_priority",
    "fulfillmentLabel": "Unfulfilled (3 items)",
    "shippingTier": "FedEx Priority Overnight",
    "slaRemainingText": "Standard SLA: 3h remaining",
    "slaUrgent": false,
    "actionsAvailable": [
      "print_packing_slip",
      "commercial_invoice",
      "cancel_order",
      "fulfill_items"
    ],
    "items": [
      {
        "id": "item-1",
        "name": "AeroSound Pro Wireless ANC Headphones",
        "sku": "NX-AUD-9420",
        "variant": "Midnight Black",
        "stockAvailable": 84,
        "isLowStock": false,
        "stockStatusText": "In Stock: 84 units available",
        "binLocation": "A-14-3",
        "quantity": 1,
        "unitPrice": 199.00,
        "totalPrice": 199.00,
        "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
        "selected": true
      },
      {
        "id": "item-2",
        "name": "DeskPower 65W GaN Fast Charger",
        "sku": "NX-PWR-6502",
        "variant": "Glacier White",
        "stockAvailable": 210,
        "isLowStock": false,
        "stockStatusText": "In Stock: 210 units available",
        "binLocation": "B-08-1",
        "quantity": 1,
        "unitPrice": 45.00,
        "totalPrice": 45.00,
        "imageUrl": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80",
        "selected": true
      },
      {
        "id": "item-3",
        "name": "Thermal Peak Insulated Flask 32oz",
        "sku": "NX-HYD-3288",
        "variant": "Olive Green",
        "stockAvailable": 4,
        "isLowStock": true,
        "stockStatusText": "Low Stock: 4 units left",
        "binLocation": "C-02-4",
        "quantity": 1,
        "unitPrice": 34.00,
        "totalPrice": 34.00,
        "imageUrl": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80",
        "selected": true
      }
    ],
    "shippingDispatchSetup": {
      "apiIntegrationStatus": "API Integration: Active (FedEx WebServices)",
      "carrier": "FedEx - Priority Overnight (Next Business Morning)",
      "trackingNumber": "FXG-9842-8819-2041-US",
      "trackingIdentifierStatus": "Auto-Generate via API",
      "isEmailNotifyCustomer": true
    },
    "customer": {
      "id": "cust-102",
      "name": "Sarah Jenkins",
      "initials": "SJ",
      "email": "sarah.j@outlook.com",
      "phone": "+1 (555) 234-5678",
      "tier": "Gold VIP",
      "lifetimeOrders": 18,
      "lifetimeOrdersText": "18 Lifetime Orders • $2480.00 LTV",
      "lifetimeValue": 2480.00,
      "isVerified": true,
      "identityStatus": "Verified Buyer",
      "avatarBg": "bg-primary text-on-primary"
    },
    "shippingAddress": {
      "recipientName": "Sarah Jenkins",
      "street": "742 Evergreen Terrace, Apt 4B",
      "cityStateZip": "Springfield, OR 97477",
      "country": "United States",
      "dpvConfirmed": true,
      "badgeText": "USPS DPV Confirmed",
      "driverNote": "Leave behind planter box near inner porch gate."
    },
    "billingMatchesShipping": true,
    "financials": {
      "itemsSubtotal": 278.00,
      "couponCode": "SPRING25",
      "couponDiscount": 25.00,
      "shippingCost": 0.00,
      "shippingName": "Shipping & Handling (FedEx Express)",
      "estimatedTax": 19.46,
      "taxPercentText": "OR 7.00%",
      "grandTotal": 272.46,
      "currency": "USD ($)"
    },
    "paymentAudit": {
      "processor": "Stripe Elements",
      "cardBrand": "Visa",
      "cardLast4": "4242",
      "transactionId": "ch_3Mqw98Lkd0129x87",
      "captureStatusText": "Captured / Succeeded",
      "settledTimestamp": "Apr 14, 2025, 10:24:18 AM EST"
    },
    "riskAssessment": {
      "riskLevel": "Low Risk",
      "riskScore": 0.02,
      "checks": [
        {
          "id": "chk-1",
          "label": "Cardholder Name Match",
          "status": "passed",
          "statusText": "Match (Exact)"
        },
        {
          "id": "chk-2",
          "label": "CVC / CVV Check",
          "status": "passed",
          "statusText": "Passed"
        },
        {
          "id": "chk-3",
          "label": "Street & Postal AVS Match",
          "status": "passed",
          "statusText": "Passed"
        },
        {
          "id": "chk-4",
          "label": "Proxy / VPN Detection",
          "status": "passed",
          "statusText": "No Proxy Detected"
        }
      ],
      "securityPassMessage": "Order passed all automated risk criteria. Clear to fulfill immediately."
    },
    "timeline": [
      {
        "id": "tl-1",
        "title": "Packing slip printed by Alexander Wright (Ops Lead)",
        "description": "Dispatched automated print queue command to Warehouse A Packing Bay 2 printer.",
        "timestamp": "Apr 14, 11:15 AM EST",
        "iconType": "print",
        "author": "Alexander Wright"
      },
      {
        "id": "tl-2",
        "title": "Inventory allocated: Seattle Fulfillment Center",
        "description": "Reserved 3 physical units across Bins A-14-3, B-08-1, C-02-4. Stock balance updated.",
        "timestamp": "Apr 14, 10:26 AM EST",
        "iconType": "inventory"
      },
      {
        "id": "tl-3",
        "title": "Automated fraud check passed",
        "description": "Risk score calculated at 0.02 (Extremely Low Risk) via Radar AI Engine.",
        "timestamp": "Apr 14, 10:25 AM EST",
        "iconType": "fraud"
      },
      {
        "id": "tl-4",
        "title": "Payment of $272.46 captured via Stripe",
        "description": "Auth code: 994201 • Response: Successful match for CVV and 5-digit AVS Postal Code.",
        "timestamp": "Apr 14, 10:24 AM EST",
        "iconType": "payment"
      },
      {
        "id": "tl-5",
        "title": "Order created by customer Sarah Jenkins",
        "description": "Session IP: 198.51.100.42 • Client: Safari on macOS 14.4",
        "timestamp": "Apr 14, 10:24 AM EST",
        "iconType": "created"
      }
    ]
  }
}
```

---

### 2.4 POST `/api/v1/admin/orders/:id/fulfill`
Triggered by the **"Fulfill Items & Generate Label"** primary button on the Single Order Command Center.

* **Method:** `POST`
* **URL:** `/api/v1/admin/orders/:id/fulfill`
* **Request Body:**
```json
{
  "itemIds": ["item-1", "item-2", "item-3"],
  "carrier": "FedEx",
  "serviceTier": "FedEx Priority Overnight",
  "autoGenerateLabel": true,
  "notifyCustomer": true,
  "packageWeight": 2.4,
  "weightUnit": "LB"
}
```

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "orderId": "ord-8492019",
    "fulfillmentStatus": "in_transit",
    "carrier": "FedEx - Priority Overnight",
    "trackingNumber": "FXG-9842-8819-2041-US",
    "shippingLabelUrl": "http://localhost:3000/labels/shipping_label_ord-8492019.pdf",
    "dispatchedAt": "2026-11-14T15:10:00.000Z"
  },
  "message": "Order items fulfilled and FedEx shipping label generated successfully."
}
```

---

### 2.5 PATCH `/api/v1/admin/orders/:id/fulfillment`
Manual update for fulfillment status, carrier details, or manual tracking number.

* **Method:** `PATCH`
* **URL:** `/api/v1/admin/orders/:id/fulfillment`
* **Request Body:**
```json
{
  "fulfillmentStatus": "in_transit",
  "carrier": "FedEx",
  "trackingNumber": "FXG-9842-8819-2041-US",
  "notifyCustomer": true
}
```

---

### 2.6 GET `/api/v1/admin/orders/:id/packing-slip`
Triggered by the **"Print Packing Slip"** button on the Single Order Page.

* **Method:** `GET`
* **URL:** `/api/v1/admin/orders/:id/packing-slip`
* **Query Parameters:**
  - `printQueue`: boolean (optional, sends direct to warehouse printer)
* **Response:** Streamed PDF file `application/pdf` or `{ "downloadUrl": "http://localhost:3000/documents/packing_slip_NX-8492019.pdf" }`.

---

### 2.7 GET `/api/v1/admin/orders/:id/commercial-invoice`
Triggered by the **"Commercial Invoice"** button on the Single Order Page for customs clearance.

* **Method:** `GET`
* **URL:** `/api/v1/admin/orders/:id/commercial-invoice`
* **Response:** Streamed PDF file `application/pdf` ready for international transport declaration.

---

### 2.8 POST `/api/v1/admin/orders/:id/cancel`
Triggered by the **"Cancel"** action button in the Order Header.

* **Method:** `POST`
* **URL:** `/api/v1/admin/orders/:id/cancel`
* **Request Body:**
```json
{
  "reason": "customer_request",
  "comment": "Customer ordered incorrect color variant by mistake",
  "restockInventory": true,
  "processRefund": true
}
```

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "orderId": "ord-8492019",
    "orderStatus": "cancelled",
    "paymentStatus": "refunded",
    "restocked": true,
    "restockedItemsCount": 3
  },
  "message": "Order #NX-8492019 cancelled and 3 units returned to warehouse stock."
}
```

---

### 2.9 POST `/api/v1/admin/orders/:id/refund`
Processes full or partial refunds directly integrated with Stripe/Payment Gateway.

* **Method:** `POST`
* **URL:** `/api/v1/admin/orders/:id/refund`
* **Request Body:**
```json
{
  "amount": 272.46,
  "reason": "Customer cancellation before warehouse dispatch",
  "notifyCustomer": true
}
```

---

### 2.10 POST `/api/v1/admin/orders/:id/notes`
Appends an internal admin note or warehouse activity event to the order audit trail.

* **Method:** `POST`
* **URL:** `/api/v1/admin/orders/:id/notes`
* **Request Body:**
```json
{
  "note": "Verified customer delivery address via phone call.",
  "isCustomerVisible": false
}
```

---

### 2.11 POST `/api/v1/admin/orders/bulk-fulfillment`
Bulk action for batch-fulfilling selected orders from the All Orders Table.

* **Method:** `POST`
* **URL:** `/api/v1/admin/orders/bulk-fulfillment`
* **Request Body:**
```json
{
  "orderIds": ["ord-8492019", "ord-8492020"],
  "fulfillmentStatus": "in_transit",
  "defaultCarrier": "FedEx",
  "notifyCustomers": true
}
```

---

### 2.12 POST `/api/v1/admin/orders/bulk-cancel`
Bulk cancels selected orders.

* **Method:** `POST`
* **URL:** `/api/v1/admin/orders/bulk-cancel`
* **Request Body:**
```json
{
  "orderIds": ["ord-8492019", "ord-8492020"],
  "reason": "bulk_inventory_adjustment",
  "restockInventory": true
}
```

---

### 2.13 GET `/api/v1/admin/orders/export`
Exports orders matching current query parameters to a downloadable CSV file.

* **Method:** `GET`
* **URL:** `/api/v1/admin/orders/export`
* **Query Parameters:** Same filtering parameters as `GET /api/v1/admin/orders`.
* **Response:** File attachment `Content-Disposition: attachment; filename="orders_export_2026-11-14.csv"`

---

# Module 3: Promotions & Discount Codes

Targets UI Page: `Admin > Customers & Growth > Promotions & Codes` (`/admin/promotions`).

---

### 3.1 GET `/api/v1/admin/promotions`
Retrieves paginated discount codes with search, status filtering, discount type filtering, and sorting.

* **Method:** `GET`
* **URL:** `/api/v1/admin/promotions`
* **Query Parameters:**
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | number | No | `1` | Page number |
  | `limit` | number | No | `10` | Records per page |
  | `search` | string | No | - | Matches coupon code, title, or description |
  | `status` | string | No | `all` | `all`, `active`, `scheduled`, `expired`, `disabled` |
  | `discountType`| string | No | `all` | `all`, `percentage`, `fixed_amount`, `free_shipping` |
  | `sortBy` | string | No | `code` | `code`, `usageCount`, `discountValue`, `endDate`, `recent` |
  | `sortOrder` | string | No | `asc` | `asc` or `desc` |

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "promotions": [
      {
        "id": "promo-01",
        "code": "WELCOME10",
        "title": "First-time Customer Welcome",
        "description": "10% discount on first orders over $30 for registered new accounts.",
        "discountType": "percentage",
        "discountValue": 10,
        "minOrderValue": 30.00,
        "maxDiscountValue": 20.00,
        "usageLimit": 1000,
        "usageCount": 342,
        "perCustomerLimit": 1,
        "startDate": "2026-01-01T00:00:00.000Z",
        "endDate": "2026-12-31T23:59:59.000Z",
        "status": "active",
        "totalSavings": 4210.50,
        "createdAt": "2026-01-01T08:00:00.000Z",
        "updatedAt": "2026-11-12T14:20:00.000Z"
      },
      {
        "id": "promo-03",
        "code": "FREESHIP",
        "title": "Free Express Shipping",
        "description": "Zero shipping fee across the country on carts above $75.",
        "discountType": "free_shipping",
        "discountValue": 0,
        "minOrderValue": 75.00,
        "maxDiscountValue": null,
        "usageLimit": null,
        "usageCount": 894,
        "perCustomerLimit": 5,
        "startDate": "2026-02-01T00:00:00.000Z",
        "endDate": null,
        "status": "active",
        "totalSavings": 13410.00,
        "createdAt": "2026-02-01T09:00:00.000Z",
        "updatedAt": "2026-11-13T17:45:00.000Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 8,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 3.2 GET `/api/v1/admin/promotions/metrics`
Fetches top-level KPIs displayed in the 4 metric cards on the Promotions screen.

* **Method:** `GET`
* **URL:** `/api/v1/admin/promotions/metrics`

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "totalPromotions": 8,
    "activePromotions": 5,
    "activePercent": 63,
    "totalRedemptions": 2487,
    "totalDiscountGiven": 51530.50,
    "expiringSoonCount": 1
  }
}
```

---

### 3.3 GET `/api/v1/admin/promotions/check-code`
Validates coupon code uniqueness in real-time as the admin types or clicks "Generate".

* **Method:** `GET`
* **URL:** `/api/v1/admin/promotions/check-code`
* **Query Parameters:**
  - `code` (required): string (e.g. `SUMMER25`)
  - `excludeId` (optional): string (Promotion ID being edited)

#### Success Response `200 OK` (Available)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "available": true,
    "code": "SUMMER25",
    "message": "Code is available"
  }
}
```

#### Success Response `200 OK` (Taken)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "available": false,
    "code": "WELCOME10",
    "message": "Promotion code is already in use"
  }
}
```

---

### 3.4 GET `/api/v1/admin/promotions/:id`
Retrieves single promotion item for viewing details modal and editing.

* **Method:** `GET`
* **URL:** `/api/v1/admin/promotions/:id`

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "promo-01",
    "code": "WELCOME10",
    "title": "First-time Customer Welcome",
    "description": "10% discount on first orders over $30 for registered new accounts.",
    "discountType": "percentage",
    "discountValue": 10,
    "minOrderValue": 30.00,
    "maxDiscountValue": 20.00,
    "usageLimit": 1000,
    "usageCount": 342,
    "perCustomerLimit": 1,
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-12-31T23:59:59.000Z",
    "status": "active",
    "totalSavings": 4210.50,
    "createdAt": "2026-01-01T08:00:00.000Z",
    "updatedAt": "2026-11-12T14:20:00.000Z"
  }
}
```

---

### 3.5 POST `/api/v1/admin/promotions`
Creates a new promotion campaign or discount coupon.

* **Method:** `POST`
* **URL:** `/api/v1/admin/promotions`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "code": "FLASH25",
  "title": "Weekend Flash Sale",
  "description": "25% discount across the store for 48 hours",
  "discountType": "percentage",
  "discountValue": 25,
  "minOrderValue": 50,
  "maxDiscountValue": 75,
  "usageLimit": 500,
  "perCustomerLimit": 1,
  "startDate": "2026-11-15T00:00:00.000Z",
  "endDate": "2026-11-17T23:59:59.000Z",
  "status": "active"
}
```

#### Validation Rules (Class Validator / NestJS DTO):
- `code` (string, uppercase, 3-30 chars, alphanumeric + dashes/underscores): `@IsNotEmpty()`, `@Matches(/^[A-Z0-9_-]+$/)`
- `title` (string, min 2 chars): `@IsNotEmpty()`, `@MinLength(2)`
- `discountType`: `@IsIn(['percentage', 'fixed_amount', 'free_shipping'])`
- `discountValue`:
  - If `discountType === 'percentage'`: `@Min(1)`, `@Max(100)`
  - If `discountType === 'fixed_amount'`: `@Min(0.01)`
  - If `discountType === 'free_shipping'`: defaults to `0`
- `minOrderValue`: `@IsOptional()`, `@Min(0)`
- `maxDiscountValue`: `@IsOptional()`, `@Min(0)`
- `usageLimit`: `@IsOptional()`, `@Min(1)`, nullable for unlimited
- `perCustomerLimit`: `@IsOptional()`, `@Min(1)`
- `startDate`: `@IsISO8601()`
- `endDate`: `@IsOptional()`, `@IsISO8601()`, nullable for never expires
- `status`: `@IsIn(['active', 'scheduled', 'disabled'])`

#### Success Response `201 Created`
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "promo-cm893fa1",
    "code": "FLASH25",
    "title": "Weekend Flash Sale",
    "discountType": "percentage",
    "discountValue": 25,
    "usageCount": 0,
    "status": "active",
    "createdAt": "2026-11-14T14:50:00.000Z",
    "updatedAt": "2026-11-14T14:50:00.000Z"
  },
  "message": "Promotion created successfully"
}
```

---

### 3.6 PUT `/api/v1/admin/promotions/:id`
Updates promotion rules, limits, validity dates, or parameters.

* **Method:** `PUT`
* **URL:** `/api/v1/admin/promotions/:id`
* **Request Body:** Partial or complete `PromotionFormData` object.

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "promo-01",
    "code": "WELCOME10",
    "title": "First-time Customer Welcome (Updated)",
    "discountValue": 12,
    "updatedAt": "2026-11-14T14:51:00.000Z"
  },
  "message": "Promotion updated successfully"
}
```

---

### 3.7 PATCH `/api/v1/admin/promotions/:id/status`
Quick-toggles a single promotion between `active` and `disabled`.

* **Method:** `PATCH`
* **URL:** `/api/v1/admin/promotions/:id/status`
* **Request Body:**
```json
{
  "status": "disabled"
}
```

---

### 3.8 DELETE `/api/v1/admin/promotions/:id`
Permanently deletes a discount campaign.

* **Method:** `DELETE`
* **URL:** `/api/v1/admin/promotions/:id`

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Promotion deleted successfully"
}
```

---

### 3.9 POST `/api/v1/admin/promotions/bulk-status`
Bulk activates or disables multiple selected coupons.

* **Method:** `POST`
* **URL:** `/api/v1/admin/promotions/bulk-status`
* **Request Body:**
```json
{
  "promotionIds": ["promo-01", "promo-02", "promo-03"],
  "status": "active"
}
```

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "updatedCount": 3
  },
  "message": "3 promotions updated to active"
}
```

---

### 3.10 POST `/api/v1/admin/promotions/bulk-delete`
Bulk deletes selected coupon campaigns.

* **Method:** `POST`
* **URL:** `/api/v1/admin/promotions/bulk-delete`
* **Request Body:**
```json
{
  "promotionIds": ["promo-07", "promo-08"]
}
```

#### Success Response `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "deletedCount": 2
  },
  "message": "2 promotions deleted successfully"
}
```

---

### 3.11 GET `/api/v1/admin/promotions/export`
Exports filtered promotions matching current query parameters to a CSV file.

* **Method:** `GET`
* **URL:** `/api/v1/admin/promotions/export`
* **Query Parameters:** Same filtering parameters as `GET /api/v1/admin/promotions`.

---

# Data Models & TypeScript Interfaces

### TypeScript Interfaces for Backend / Frontend Shared Types

```typescript
// ==========================================
// 1. DASHBOARD OVERVIEW TYPES
// ==========================================
export interface DashboardMetricsDto {
  period: 'today' | '7d' | '30d' | '90d' | 'custom'
  dateRangeLabel: string
  sales: {
    totalRevenue: number
    currency: string
    growthPercent: number
    growthDirection: 'up' | 'down' | 'neutral'
    previousPeriodRevenue: number
  }
  orders: {
    totalOrders: number
    growthPercent: number
    growthDirection: 'up' | 'down' | 'neutral'
    previousPeriodOrders: number
  }
  aov: {
    averageOrderValue: number
    growthAmount: number
    growthPercent: number
    previousAov: number
  }
  fulfillment: {
    needsFulfillment: number
    urgentCount: number
    label: string
    urgentLabel: string
  }
}

// ==========================================
// 2. ORDER TYPES: ALL ORDERS VS SINGLE ORDER
// ==========================================
export type OrderFulfillmentStatus =
  | 'unfulfilled'
  | 'unfulfilled_priority'
  | 'in_transit'
  | 'delivered'
  | 'on_hold'
  | 'cancelled'
  | 'returned'

export type OrderPaymentStatus =
  | 'paid'
  | 'pending_wire'
  | 'refunded'
  | 'failed'

/**
 * 2.A ALL ORDERS TABLE LIST ITEM (Lightweight summary for table rendering)
 */
export interface AdminOrderListItemDto {
  id: string
  orderNumber: string
  channel: string
  channelType: 'web' | 'ios' | 'android' | 'pos'
  channelIcon: string
  createdAt: string
  dateTimeText: string
  timeAgoText: string
  customer: {
    id: string
    name: string
    email: string
    initials: string
    avatarBg?: string
  }
  purchasedItems: {
    itemCount: number
    summaryText: string
    itemsSummary: string
    thumbnails: string[]
  }
  totalPrice: number
  currency: string
  paymentMethodText: string
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  slaRemainingText?: string
  primaryAction: string
}

/**
 * 2.B SINGLE ORDER COMMAND CENTER (Deep relational details for OrderDetailPage)
 */
export interface OrderItemPickPackDto {
  id: string
  name: string
  sku: string
  variant: string
  stockAvailable: number
  isLowStock: boolean
  stockStatusText: string
  binLocation: string
  quantity: number
  unitPrice: number
  totalPrice: number
  imageUrl: string
  selected?: boolean
}

export interface OrderCustomerProfileDto {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  tier: string
  lifetimeOrders: number
  lifetimeOrdersText: string
  lifetimeValue: number
  isVerified: boolean
  identityStatus: string
  avatarBg?: string
}

export interface OrderShippingDestinationDto {
  recipientName: string
  street: string
  cityStateZip: string
  country: string
  dpvConfirmed: boolean
  badgeText?: string
  driverNote?: string
}

export interface OrderFinancialSettlementDto {
  itemsSubtotal: number
  couponCode?: string
  couponDiscount: number
  shippingCost: number
  shippingName: string
  estimatedTax: number
  taxPercentText: string
  grandTotal: number
  currency: string
}

export interface OrderPaymentAuditDto {
  processor: string
  cardBrand: string
  cardLast4: string
  transactionId: string
  captureStatusText: string
  settledTimestamp: string
}

export interface OrderRiskAssessmentDto {
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk'
  riskScore: number
  checks: {
    id: string
    label: string
    status: 'passed' | 'warning' | 'failed'
    statusText: string
  }[]
  securityPassMessage: string
}

export interface OrderTimelineEventDto {
  id: string
  title: string
  description: string
  timestamp: string
  iconType: 'print' | 'inventory' | 'fraud' | 'payment' | 'created' | 'note' | 'dispatch'
  author?: string
}

export interface AdminOrderDetailFullDto {
  id: string
  orderNumber: string
  placedDateText: string
  channelName: string
  channelId: string
  warehouseLocation: string
  warehouseZone: string
  warehouseStatus: string
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  fulfillmentLabel: string
  shippingTier: string
  slaRemainingText: string
  slaUrgent: boolean
  actionsAvailable: ('print_packing_slip' | 'commercial_invoice' | 'cancel_order' | 'fulfill_items')[]
  items: OrderItemPickPackDto[]
  shippingDispatchSetup: {
    apiIntegrationStatus: string
    carrier: string
    trackingNumber: string
    trackingIdentifierStatus: string
    isEmailNotifyCustomer: boolean
  }
  customer: OrderCustomerProfileDto
  shippingAddress: OrderShippingDestinationDto
  billingMatchesShipping: boolean
  financials: OrderFinancialSettlementDto
  paymentAudit: OrderPaymentAuditDto
  riskAssessment: OrderRiskAssessmentDto
  timeline: OrderTimelineEventDto[]
}

// ==========================================
// 3. PROMOTION TYPES
// ==========================================
export type PromotionDiscountType = 'percentage' | 'fixed_amount' | 'free_shipping'

export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'disabled'

export interface PromotionItemDto {
  id: string
  code: string
  title: string
  description?: string
  discountType: PromotionDiscountType
  discountValue: number
  minOrderValue?: number
  maxDiscountValue?: number
  usageLimit?: number | null
  usageCount: number
  perCustomerLimit?: number
  startDate: string
  endDate?: string | null
  status: PromotionStatus
  totalSavings?: number
  createdAt: string
  updatedAt: string
}

export interface CreatePromotionDto {
  code: string
  title: string
  description?: string
  discountType: PromotionDiscountType
  discountValue: number
  minOrderValue?: number
  maxDiscountValue?: number
  usageLimit?: number | null
  perCustomerLimit?: number
  startDate: string
  endDate?: string | null
  status: PromotionStatus
}
```

