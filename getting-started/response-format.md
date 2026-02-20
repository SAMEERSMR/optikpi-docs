# Response Format

All OptikPI API responses follow a consistent envelope format. Understanding this structure is essential for handling responses in the frontend and any integration code.

## Standard Response Envelope

Most API routes return responses wrapped in a `result` object:

```json
{
  "result": {
    "data": {},
    "message": "Success",
    "status": 200,
    "totalCount": 42
  }
}
```

### Success Response

| Field               | Type                    | Description                                           |
| ------------------- | ----------------------- | ----------------------------------------------------- |
| `result.data`       | `any`                   | The response payload — object, array, or `null`       |
| `result.message`    | `string`                | Human-readable status message                         |
| `result.status`     | `number`                | HTTP-like status code                                 |
| `result.totalCount` | `number \| undefined`   | Total count for paginated list responses              |
| `result.workspace`  | `object[] \| undefined` | Workspace-level metadata (returned by some endpoints) |

**Example — List Response**

```json
{
  "result": {
    "data": [
      {
        "id": "audience_abc123",
        "name": "High Value Customers",
        "status": "ACTIVE",
        "contactCount": 15420
      }
    ],
    "message": "Audiences fetched successfully",
    "status": 200,
    "totalCount": 1
  }
}
```

### Error Response

::: warning
When an error occurs, the `data` field is `null` and an `error` field is added:
:::

```json
{
  "result": {
    "data": null,
    "error": "NOT_FOUND",
    "message": "The requested resource was not found.",
    "status": 404
  }
}
```

| Field            | Type     | Description                      |
| ---------------- | -------- | -------------------------------- |
| `result.data`    | `null`   | Always null on error             |
| `result.error`   | `string` | Machine-readable error code      |
| `result.message` | `string` | Human-readable error description |
| `result.status`  | `number` | HTTP status code                 |

## Tags API — Flat Response Format

The Tags API and a few other utility endpoints return a **flat** response (no `result` wrapper):

**Success**

```json
{
  "data": ["vip", "churned", "new_user"],
  "message": "Tags fetched successfully",
  "status": 200,
  "totalCount": 3
}
```

**Error**

```json
{
  "data": null,
  "error": "UNAUTHORIZED",
  "message": "You do not have permission to access this resource.",
  "status": 401
}
```

## HTTP Status Codes

| Code  | Meaning                                                     |
| ----- | ----------------------------------------------------------- |
| `200` | Success                                                     |
| `201` | Resource created                                            |
| `400` | Bad request — invalid parameters or missing required fields |
| `401` | Unauthorized — session missing or expired                   |
| `403` | Forbidden — insufficient role permissions                   |
| `404` | Not found                                                   |
| `409` | Conflict — duplicate resource                               |
| `500` | Internal server error                                       |

## Pagination

List endpoints that support pagination accept `page` and `limit` query parameters and return `totalCount` in the response to allow calculating total pages.

```http
GET /{locale}/api/audience?page=1&limit=20
```

| Query Param | Type     | Default | Description                |
| ----------- | -------- | ------- | -------------------------- |
| `page`      | `number` | `1`     | Page number (1-indexed)    |
| `limit`     | `number` | `10`    | Number of records per page |

::: tip
The `totalCount` field represents the total number of records matching the query — not the number of items in the current page.
:::
