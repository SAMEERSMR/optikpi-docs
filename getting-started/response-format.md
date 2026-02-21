# Response Format

All OptiKPI API responses follow a consistent envelope format. Understanding this structure is essential for handling responses in the frontend and any integration code.

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

| Field               | Type                  | Description                                           |
| ------------------- | --------------------- | ----------------------------------------------------- |
| result.data         | any                   | The response payload — object, array, or null         |
| result.message      | string                | Human-readable status message                         |
| result.status       | number                | HTTP-like status code                                 |
| result.totalCount   | number \| undefined   | Total count for paginated list responses              |
| result.workspace    | object[] \| undefined | Workspace-level metadata (returned by some endpoints)  |

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

| Field           | Type   | Description                      |
| --------------- | ------ | -------------------------------- |
| result.data     | null   | Always null on error             |
| result.error    | string | Machine-readable error code      |
| result.message  | string | Human-readable error description |
| result.status   | number | HTTP status code                 |

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

| Code | Meaning                                                     |
| ---- | ----------------------------------------------------------- |
| 200  | Success                                                     |
| 201  | Resource created                                            |
| 400  | Bad request — invalid parameters or missing required fields |
| 401  | Unauthorized — session missing or expired                    |
| 403  | Forbidden — insufficient role permissions                   |
| 404  | Not found                                                   |
| 409  | Conflict — duplicate resource                               |
| 500  | Internal server error                                       |

## Pagination

List endpoints that support pagination accept `page` and `pageSize` query parameters and return `totalCount` (or equivalent) in the response to allow calculating total pages.

```http
GET /{locale}/api/audience?page=1&pageSize=20
```

| Query Param | Type   | Default | Description                                         |
| ----------- | ------ | ------- | --------------------------------------------------- |
| page        | number | 1       | Page number (1-indexed)                             |
| pageSize    | number | varies  | Records per page (e.g. Audience: 100, Campaign: 10) |

::: tip
The `totalCount` field represents the total number of records matching the query — not the number of items in the current page. Default `pageSize` can differ by endpoint; check each API reference.
:::

## Audience List — Different Response Shape

The **GET** `/{locale}/api/audience` endpoint returns a **flat** object (no `result` wrapper):

```json
{
  "records": [
    {
      "id": "aud_abc123",
      "name": "High Value Customers",
      "tags": ["vip"],
      "status": "active",
      "totalCustomers": 15420,
      "updatedAt": "2024-11-15T14:30:00.000Z"
    }
  ],
  "totalCount": 42
}
```

::: info
Other list endpoints may use the standard `result.data` envelope or a flat shape. Check the specific API reference for each endpoint.
:::
