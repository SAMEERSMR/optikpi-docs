# Workspace

Workspace endpoints manage workspace settings, branding, subscription details, and feature configurations.

**Base path:** `/{locale}/api/workspace`

## Get Workspace

Retrieve the current workspace's full configuration and settings.

**`GET /{locale}/api/workspace`**

### Response

```json
{
  "result": {
    "data": {
      "id": "ws_xyz789",
      "name": "Acme Corp Marketing",
      "accountId": "acc_def456",
      "logo": "https://s3.amazonaws.com/bucket/logos/ws_xyz789.png",
      "timezone": "Asia/Dubai",
      "language": "en",
      "plan": "ENTERPRISE",
      "features": {
        "campaigns": true,
        "workflows": true,
        "audience": true,
        "customer360": true,
        "pushNotifications": true
      },
      "limits": {
        "monthlyEmails": 500000,
        "monthlySmsSent": 50000,
        "audiences": 100,
        "workflows": 50
      },
      "createdAt": "2023-06-01T00:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    },
    "message": "Workspace fetched successfully",
    "status": 200
  }
}
```

## Get Brands / Subscription Details

Retrieve brands or subscription metadata associated with the workspace.

**`POST /{locale}/api/workspace`**

### Request Body

| Field  | Type     | Required | Description                        |
| ------ | -------- | -------- | ---------------------------------- |
| `type` | `string` | ✅       | `GET_BRANDS` or `GET_SUBSCRIPTION` |

### Get Brands

```json
{
  "type": "GET_BRANDS"
}
```

**Response**

```json
{
  "result": {
    "data": [
      {
        "id": "brand_01",
        "name": "Acme Main Brand",
        "logo": "https://s3.amazonaws.com/bucket/brands/brand_01.png",
        "primaryColor": "#07388A",
        "senderEmail": "hello@acme.com"
      }
    ],
    "message": "Brands fetched successfully",
    "status": 200
  }
}
```

### Get Subscription

```json
{
  "type": "GET_SUBSCRIPTION"
}
```

**Response**

```json
{
  "result": {
    "data": {
      "plan": "ENTERPRISE",
      "status": "ACTIVE",
      "billingCycle": "ANNUAL",
      "renewsAt": "2026-06-01T00:00:00.000Z",
      "isCustomer360Enabled": true,
      "isBetaEnabled": false
    },
    "message": "Subscription details fetched successfully",
    "status": 200
  }
}
```

## Update Workspace

Update workspace settings, branding, or preferences.

**`PUT /{locale}/api/workspace`**

### Request Body

| Field          | Type     | Required | Description                                  |
| -------------- | -------- | -------- | -------------------------------------------- |
| `name`         | `string` | ❌       | Workspace display name                       |
| `logo`         | `string` | ❌       | Logo image URL (uploaded via `/api/uploads`) |
| `timezone`     | `string` | ❌       | Default timezone for the workspace           |
| `language`     | `string` | ❌       | Default language code                        |
| `primaryColor` | `string` | ❌       | Brand primary color hex                      |
| `senderEmail`  | `string` | ❌       | Default sender email                         |
| `senderName`   | `string` | ❌       | Default sender display name                  |

### Request

```json
{
  "name": "Acme Corp Marketing",
  "timezone": "Asia/Dubai",
  "language": "en",
  "primaryColor": "#07388A",
  "senderEmail": "campaigns@acme.com",
  "senderName": "Acme Campaigns"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "ws_xyz789",
      "name": "Acme Corp Marketing",
      "timezone": "Asia/Dubai",
      "updatedAt": "2025-02-20T12:00:00.000Z"
    },
    "message": "Workspace updated successfully",
    "status": 200
  }
}
```

## Workspace Object

| Field       | Type             | Description                                                  |
| ----------- | ---------------- | ------------------------------------------------------------ |
| `id`        | `string`         | Unique workspace ID                                          |
| `name`      | `string`         | Workspace display name                                       |
| `accountId` | `string`         | Parent account ID                                            |
| `logo`      | `string \| null` | Logo image URL                                               |
| `timezone`  | `string`         | Default timezone                                             |
| `language`  | `string`         | Default language                                             |
| `plan`      | `string`         | Subscription plan: `FREE`, `STARTER`, `GROWTH`, `ENTERPRISE` |
| `features`  | `object`         | Feature flags (booleans)                                     |
| `limits`    | `object`         | Usage limits by resource type                                |
| `createdAt` | `string`         | ISO 8601 creation timestamp                                  |
| `updatedAt` | `string`         | ISO 8601 last update timestamp                               |
