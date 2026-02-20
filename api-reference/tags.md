# Tags

Tags are workspace-wide labels used to organize audiences, campaigns, workflows, and library templates. The Tags API uses a **flat response format** (no `result` wrapper).

**Base path:** `/{locale}/api/tags`

## List Tags

Retrieve all tags for the current workspace.

**`GET /{locale}/api/tags`**

### Query Parameters

| Parameter | Type     | Required | Description                                |
| --------- | -------- | -------- | ------------------------------------------ |
| `search`  | `string` | ❌       | Filter by tag name (partial match)         |
| `page`    | `number` | ❌       | Page number (default: `1`)                 |
| `limit`   | `number` | ❌       | Records per page (default: `50`, max `50`) |

### Response

```json
{
  "data": [
    {
      "id": "tag_abc123",
      "name": "vip",
      "color": "#07388A",
      "usageCount": 12,
      "createdAt": "2024-07-01T10:00:00.000Z"
    },
    {
      "id": "tag_def456",
      "name": "churned",
      "color": "#D92D20",
      "usageCount": 5,
      "createdAt": "2024-08-15T08:00:00.000Z"
    }
  ],
  "message": "Tags fetched successfully",
  "status": 200,
  "totalCount": 2
}
```

::: tip Note
The Tags API returns a **flat** response — there is no `result` wrapper. The `data` field is directly at the top level of the response object.
:::

## Delete Tag

Delete a single tag by ID. This removes the tag from the workspace and from all resources that reference it.

**`DELETE /{locale}/api/tags`**

### Request Body

| Field | Type     | Required | Description      |
| ----- | -------- | -------- | ---------------- |
| `id`  | `string` | ✅       | Tag ID to delete |

### Request

```json
{
  "id": "tag_abc123"
}
```

### Response

```json
{
  "data": null,
  "message": "Tag deleted successfully",
  "status": 200
}
```

## Tag Object

| Field         | Type             | Description                            |
| ------------- | ---------------- | -------------------------------------- |
| `id`          | `string`         | Unique tag ID                          |
| `name`        | `string`         | Tag label (lowercase, no spaces)       |
| `color`       | `string \| null` | Optional color hex code for UI display |
| `usageCount`  | `number`         | Number of resources using this tag     |
| `workspaceId` | `string`         | Owning workspace ID                    |
| `createdAt`   | `string`         | ISO 8601 creation timestamp            |

## Tag Naming Rules

- Tags are **lowercase** and **trimmed** automatically
- Spaces are replaced with hyphens: `"high value"` → `"high-value"`
- Max length: **50 characters**
- Must be unique within a workspace
