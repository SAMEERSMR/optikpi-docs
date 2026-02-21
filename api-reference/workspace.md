# Workspace

Workspace endpoints manage workspace settings, branding, subscription details, and feature configurations.

**Base path:** `/{locale}/api/workspace`

## Get Workspace

Retrieve the current workspace's configuration. Uses **workSpaceId** from request headers (set by middleware). Response is **flat**: `{ data: workspace }` (no `result` wrapper).

**`GET /{locale}/api/workspace`**

### Response (200)

```json
{
  "data": {
    "id": "ws_xyz789",
    "name": "Acme Corp Marketing",
    "domain": "acme.com",
    "timezone": "Asia/Dubai",
    "registerationNumber": "REG123",
    "logo": "https://s3.amazonaws.com/bucket/logos/ws_xyz789.png",
    "enableAudienceAllocationInCampaign": true
  }
}
```

**Errors:** 400 `{ "message": "Invalid request. Id not provided." }`; 404 `{ "message": "Workspace not found" }`; 500 on server error.

## POST — Type-Based Operations

**`POST /{locale}/api/workspace`**

All requests require a `type` field. The following types are supported.

### Type: GET-SELECTED-BRANDS

Returns workspace records for the given workspace IDs.

**Request Body**

| Field        | Type       | Required | Description                   |
| ------------ | ---------- | -------- | ----------------------------- |
| `type`       | `string`   | ✅       | Must be `GET-SELECTED-BRANDS` |
| `workspaces` | `string[]` | ✅       | Array of workspace IDs        |

**Response (200)**

```json
{
  "brands": [
    {
      "id": "ws_01",
      "name": "Acme Main",
      "domain": "acme.com",
      "timezone": "Asia/Dubai",
      "deletedAt": null
    }
  ]
}
```

**Errors:** 500 `{ "error": "Error getting the brands data" }`.

### Type: GET-CUSTOMER360-SUBSCRIPTION-DETAILS

Returns Customer 360 subscription details for the current workspace.

**Request Body**

```json
{
  "type": "GET-CUSTOMER360-SUBSCRIPTION-DETAILS"
}
```

**Response (200)**

```json
{
  "subscriptionDetails": [{ "key": "customer_360", "enabled": true }]
}
```

**Errors:** 500 `{ "error": "Error getting the subscription details data" }`.

## Update Workspace

**`PUT /{locale}/api/workspace`**

Updates workspace settings. Body can include fields such as `timezone`, `registerationNumber`, and other workspace attributes. Response is `{ data: updatedWorkspace }`.

**Errors:** 400 when workSpaceId missing; 500 on server error.

---

## Workspace Object (GET response)

| Field                                | Type      | Description                                        |
| ------------------------------------ | --------- | -------------------------------------------------- |
| `id`                                 | `string`  | Workspace ID                                       |
| `name`                               | `string`  | Workspace name                                     |
| `domain`                             | `string`  | Domain                                             |
| `timezone`                           | `string`  | Workspace timezone                                 |
| `registerationNumber`                | `string`  | Registration number                                |
| `logo`                               | `string`  | Logo URL                                           |
| `enableAudienceAllocationInCampaign` | `boolean` | Whether audience allocation in campaign is enabled |
