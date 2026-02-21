# Tags

Tags are workspace-wide labels used to organize audiences, campaigns, workflows, and library templates. The Tags API uses a **flat response format** (no `result` wrapper).

**Base path:** `/{locale}/api/tags`

## List Tags

Retrieve tags for the current workspace. The Tags API uses a **flat** response (no `result` wrapper).

**`GET /{locale}/api/tags`**

### Query Parameters

| Parameter  | Type   | Required | Description                                             |
| ---------- | ------ | -------- | ------------------------------------------------------- |
| tagName    | string | ❌       | Filter by tag name (partial match, case-insensitive)    |
| moduleName | string | ❌       | Filter by module: campaign, audience, library, workflow |
| page       | number | ❌       | Page number (default: 1)                                |
| pageSize   | number | ❌       | Records per page (default: 8)                           |

### Request Headers

| Header      | Description                             |
| ----------- | --------------------------------------- |
| workSpaceId | Active workspace ID (set by middleware) |

### Response (200)

```json
{
  "data": [
    { "id": "tag_abc123", "name": "vip" },
    { "id": "tag_def456", "name": "churned" }
  ],
  "message": "Successful.",
  "status": 200,
  "totalCount": 2
}
```

::: tip
The Tags API returns a **flat** response — there is no `result` wrapper. Each tag in `data` includes `id` and `name`.
:::

## Delete Tag

Soft-delete a tag by name and module. Uses **query parameters**, not a request body.

**`DELETE /{locale}/api/tags`**

### Query Parameters

| Parameter  | Type   | Required | Description                                            |
| ---------- | ------ | -------- | ------------------------------------------------------ |
| tagName    | string | ✅       | Tag name to delete                                     |
| moduleName | string | ✅       | Module scope: campaign, audience, library, or workflow |

### Example

```http
DELETE /{locale}/api/tags?tagName=vip&moduleName=campaign
```

### Response (200)

```json
{
  "result": {
    "data": { "count": 1 },
    "message": "Tag delete successfully."
  }
}
```

**Errors:** 500 `{ "result": { "data": null, "message": "Could not delete tag.", "error": "..." } }`.

## Tag Object (List)

| Field | Type   | Description   |
| ----- | ------ | ------------- |
| id    | string | Unique tag ID |
| name  | string | Tag label     |

## Tag Naming Rules

- Tag name is **trimmed** when provided in queries
- Filtering is **case-insensitive**
- Must be unique within a workspace per module
