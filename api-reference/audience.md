# Audience

Audience endpoints allow you to create, list, update, and delete audience segments. Audiences are dynamic groups of contacts filtered by attributes, behaviors, or SQL conditions that are resolved via **Google BigQuery**.

**Base path:** `/{locale}/api/audience`

## List Audiences

Retrieve a paginated list of audiences for the current workspace.

**`GET /{locale}/api/audience`**

### Query Parameters

| Parameter | Type     | Required | Description                                     |
| --------- | -------- | -------- | ----------------------------------------------- |
| `page`    | `number` | ❌       | Page number (default: `1`)                      |
| `limit`   | `number` | ❌       | Records per page (default: `10`)                |
| `search`  | `string` | ❌       | Filter by audience name                         |
| `status`  | `string` | ❌       | Filter by status: `ACTIVE`, `DRAFT`, `ARCHIVED` |
| `tab`     | `string` | ❌       | Tab filter: `all`, `active`, `draft`            |

### Request Headers

| Header        | Description                             |
| ------------- | --------------------------------------- |
| `workSpaceId` | Active workspace ID (set by middleware) |
| `accountId`   | Account ID (set by middleware)          |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "aud_abc123",
        "name": "High Value Customers",
        "description": "Customers with LTV > $500",
        "status": "ACTIVE",
        "contactCount": 15420,
        "filterType": "SQL",
        "tags": ["vip", "high-ltv"],
        "createdAt": "2024-06-01T10:00:00.000Z",
        "updatedAt": "2024-11-15T14:30:00.000Z"
      }
    ],
    "message": "Audiences fetched successfully",
    "status": 200,
    "totalCount": 42
  }
}
```

## Create Audience

Create a new audience segment.

**`POST /{locale}/api/audience`**

### Request Body

| Field         | Type       | Required | Description                                                         |
| ------------- | ---------- | -------- | ------------------------------------------------------------------- |
| `name`        | `string`   | ✅       | Audience display name                                               |
| `description` | `string`   | ❌       | Optional description                                                |
| `filterType`  | `string`   | ✅       | `SQL` or `BUILDER`                                                  |
| `sqlQuery`    | `string`   | ❌       | Custom BigQuery SQL filter (required when `filterType` is `SQL`)    |
| `filters`     | `object[]` | ❌       | Filter builder conditions (required when `filterType` is `BUILDER`) |
| `tags`        | `string[]` | ❌       | Tag labels for organization                                         |
| `status`      | `string`   | ❌       | Initial status — `DRAFT` (default) or `ACTIVE`                      |

::: info
Use `filterType: "SQL"` for advanced BigQuery filters, or `filterType: "BUILDER"` for visual filter builder conditions. Only one filter type is required per audience.
:::

### Request

```json
{
  "name": "Churned Users — Last 90 Days",
  "description": "Users who haven't made a purchase in 90 days",
  "filterType": "SQL",
  "sqlQuery": "SELECT customer_id FROM events WHERE last_purchase_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)",
  "tags": ["churned", "win-back"],
  "status": "DRAFT"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "aud_xyz789",
      "name": "Churned Users — Last 90 Days",
      "status": "DRAFT",
      "contactCount": 0,
      "filterType": "SQL",
      "createdAt": "2025-02-20T09:00:00.000Z"
    },
    "message": "Audience created successfully",
    "status": 201
  }
}
```

## Update Audience

Update an existing audience's properties.

**`PUT /{locale}/api/audience`**

### Request Body

| Field         | Type       | Required | Description               |
| ------------- | ---------- | -------- | ------------------------- |
| `id`          | `string`   | ✅       | Audience ID to update     |
| `name`        | `string`   | ❌       | New name                  |
| `description` | `string`   | ❌       | New description           |
| `sqlQuery`    | `string`   | ❌       | Updated SQL filter        |
| `filters`     | `object[]` | ❌       | Updated filter conditions |
| `tags`        | `string[]` | ❌       | Updated tag list          |
| `status`      | `string`   | ❌       | New status                |

### Request

```json
{
  "id": "aud_xyz789",
  "status": "ACTIVE",
  "tags": ["churned", "win-back", "q1-campaign"]
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "aud_xyz789",
      "name": "Churned Users — Last 90 Days",
      "status": "ACTIVE",
      "updatedAt": "2025-02-20T10:00:00.000Z"
    },
    "message": "Audience updated successfully",
    "status": 200
  }
}
```

## Delete Audiences

Delete one or more audiences by ID.

**`DELETE /{locale}/api/audience`**

### Request Body

| Field | Type       | Required | Description                     |
| ----- | ---------- | -------- | ------------------------------- |
| `ids` | `string[]` | ✅       | Array of audience IDs to delete |

### Request

```json
{
  "ids": ["aud_abc123", "aud_xyz789"]
}
```

### Response

```json
{
  "result": {
    "data": { "deletedCount": 2 },
    "message": "Audiences deleted successfully",
    "status": 200
  }
}
```

## Audience Object

| Field          | Type               | Description                       |
| -------------- | ------------------ | --------------------------------- |
| `id`           | `string`           | Unique audience ID                |
| `name`         | `string`           | Display name                      |
| `description`  | `string \| null`   | Optional description              |
| `status`       | `string`           | `DRAFT` \| `ACTIVE` \| `ARCHIVED` |
| `filterType`   | `string`           | `SQL` \| `BUILDER`                |
| `sqlQuery`     | `string \| null`   | BigQuery SQL filter string        |
| `filters`      | `object[] \| null` | Builder-mode filter conditions    |
| `contactCount` | `number`           | Number of contacts in the segment |
| `tags`         | `string[]`         | Associated tag labels             |
| `workspaceId`  | `string`           | Owning workspace ID               |
| `createdAt`    | `string`           | ISO 8601 creation timestamp       |
| `updatedAt`    | `string`           | ISO 8601 last update timestamp    |

## Filter Builder Conditions

When `filterType` is `BUILDER`, filters is an array of condition objects:

```json
[
  {
    "field": "country",
    "operator": "equals",
    "value": "AE"
  },
  {
    "field": "total_purchases",
    "operator": "greater_than",
    "value": 5
  }
]
```

| Operator       | Description          |
| -------------- | -------------------- |
| `equals`       | Exact match          |
| `not_equals`   | Not equal            |
| `contains`     | String contains      |
| `greater_than` | Numeric greater than |
| `less_than`    | Numeric less than    |
| `in`           | Value is in array    |
| `not_in`       | Value not in array   |
| `is_null`      | Field is empty/null  |
| `is_not_null`  | Field has a value    |
