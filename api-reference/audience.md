# Audience

Audience endpoints allow you to create, list, update, and delete audience segments. Audiences are dynamic groups of contacts filtered by attributes, behaviors, or SQL conditions that are resolved via **Google BigQuery**.

**Base path:** `/{locale}/api/audience`

## List Audiences

Retrieve a paginated list of audiences for the current workspace. This endpoint returns a **flat** response (no `result` wrapper).

**`GET /{locale}/api/audience`**

### Query Parameters

| Parameter           | Type   | Required | Description                                                   |
| ------------------- | ------ | -------- | ------------------------------------------------------------- |
| page                | number | ❌       | Page number (default: 1)                                      |
| pageSize            | number | ❌       | Records per page (default: 100)                               |
| search              | string | ❌       | Filter by audience name or tags                               |
| status              | string | ❌       | JSON array of statuses, e.g. ["active","draft"]               |
| tab                 | string | ❌       | Tab filter: all, active, draft, or rfm                        |
| type                | string | ❌       | JSON array of audience types                                  |
| tags                | string | ❌       | JSON array of tag strings                                     |
| sort                | string | ❌       | JSON sort object (default: { "createdAt": "desc" })           |
| excludeAudience     | string | ❌       | When set, excludes the workspace's globally excluded audience |
| selectFields        | string | ❌       | Comma-separated list of fields to return                      |
| isResourceCreated   | string | ❌       | JSON boolean to filter by resource-created flag               |

### Request Headers

| Header      | Description                             |
| ----------- | --------------------------------------- |
| workSpaceId | Active workspace ID (set by middleware) |
| userId      | User ID (set by middleware)             |

### Response (200)

```json
{
  "records": [
    {
      "id": "aud_abc123",
      "name": "High Value Customers",
      "tags": ["vip", "high-ltv"],
      "status": "active",
      "groups": [],
      "workspaceId": "ws_xyz789",
      "audienceType": { "type": "static" },
      "totalCustomers": 15420,
      "unsubscribedCustomers": 0,
      "scheduleId": null,
      "groupType": null,
      "activeCustomers": 15420,
      "updatedAt": "2024-11-15T14:30:00.000Z",
      "isResourceCreated": false
    }
  ],
  "totalCount": 42
}
```

**Errors:** 401 `{ "message": "Invalid request" }` when `workSpaceId` or `userId` is missing; 500 on server error.

## Create Audience

Create a new audience segment. The API uses a **type-based** request body: include `type` and the fields for that operation.

**`POST /{locale}/api/audience`**

### Create (type: AUDIENCE_CREATED)

| Field         | Type     | Required | Description                      |
| ------------- | -------- | -------- | -------------------------------- |
| type          | string   | ✅       | Must be AUDIENCE_CREATED         |
| name          | string   | ✅       | Audience display name            |
| tags          | string[] | ✅       | Tag labels (array, can be empty) |
| groups        | array    | ❌       | Audience filter groups           |
| groupType     | string   | ❌       | Group type                       |
| audienceType  | object   | ❌       | e.g. { "type": "static" }        |

### Request

```json
{
  "type": "AUDIENCE_CREATED",
  "name": "Churned Users — Last 90 Days",
  "tags": ["churned", "win-back"],
  "groups": [],
  "audienceType": { "type": "static" }
}
```

### Response (200)

Returns the created audience object directly (no `result` wrapper):

```json
{
  "id": "aud_xyz789",
  "name": "Churned Users — Last 90 Days",
  "tags": ["churned", "win-back"],
  "workspaceId": "ws_abc123",
  "groups": [],
  "audienceType": { "type": "static" },
  "isResourceCreated": false,
  "deletedAt": null,
  "createdAt": "2025-02-20T09:00:00.000Z",
  "updatedAt": "2025-02-20T09:00:00.000Z"
}
```

**Errors:** 400 `{ "message": "Invalid request" }` (missing name/tags or workSpaceId/userId); 400 `{ "message": "Audience with the same name already exists." }` (duplicate name); 401 `{ "message": "Invalid request" }`; 500 on server or tag creation error.

::: info
Other audience operations (update name/tags, duplicate, full update, delete) use the same **POST** or **DELETE** endpoint with different `type` values and body shapes. The create flow above is the minimal required for a new audience.
:::

## Update Audience

Updates are performed via **POST** (e.g. `type: AUDIENCE_NAME_TAG_UPDATE`, `AUDIENCE_UPDATED`) or **PUT** (e.g. `type: update-status`, `update-now`, `check-update-now-status`) with a `type` field and operation-specific body (e.g. `id`, `name`, `tags`, `groups`, `status`, `audienceType`). Responses return the updated audience or a success payload. 409 is returned when the audience is in use in a workflow or campaign.

## Delete Audiences

**`DELETE /{locale}/api/audience`**

Delete uses a **body** with `type`: `delete-single` (and query param `id`) or `delete-multiple` (body `selectedAudiences` array). Optional `tags` in body for tag cleanup. Responses include the deleted resource or tag result. 409 is returned when the audience is in use in a workflow or campaign.

**Example (delete single)**

```http
DELETE /{locale}/api/audience?id=aud_abc123
Content-Type: application/json

{
  "type": "delete-single",
  "status": "active",
  "tags": ["vip"]
}
```

## Audience Object (List / Create response)

| Field                   | Type            | Description                          |
| ----------------------- | --------------- | ------------------------------------ |
| id                      | string          | Unique audience ID                   |
| name                    | string          | Display name                         |
| tags                    | string[]        | Tag labels                           |
| status                  | string          | e.g. active, draft                   |
| groups                  | array           | Filter groups                        |
| workspaceId             | string          | Owning workspace ID                  |
| audienceType            | object          | e.g. { "type": "static" }            |
| totalCustomers          | number          | Total contacts in segment            |
| unsubscribedCustomers   | number          | Unsubscribed count                   |
| activeCustomers         | number          | Active contact count                 |
| scheduleId              | string \| null  | Schedule ID if scheduled             |
| groupType               | string \| null  | Group type                           |
| isResourceCreated       | boolean         | Whether created as resource          |
| updatedAt               | string          | ISO 8601 last update timestamp       |
| createdAt               | string          | ISO 8601 creation timestamp (create) |
