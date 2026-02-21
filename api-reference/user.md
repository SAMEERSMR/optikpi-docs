# User

User-related endpoints: one at `/api/user` (no locale) for password check, and one at `/{locale}/api/user` (with locale) for get/update user details.

## Check User Has Password

Check whether a user exists for the given email and workspace and has a password set. This route does **not** require a locale prefix.

**`GET /api/user`**

### Query Parameters

| Parameter     | Type     | Required | Description                         |
| ------------- | -------- | -------- | ----------------------------------- |
| `email`       | `string` | ✅       | User's email address                |
| `workspaceId` | `string` | ✅       | Workspace ID to check membership in |

### Request

:::tabs
== HTTP

```http
GET /api/user?email=admin@example.com&workspaceId=ws_abc123
```

== cURL

```bash
curl -X GET "https://api.optikpi.com/api/user?email=admin@example.com&workspaceId=ws_abc123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

== JavaScript

```javascript
const response = await fetch(
  "/api/user?email=admin@example.com&workspaceId=ws_abc123",
  {
    headers: {
      Authorization: "Bearer YOUR_ACCESS_TOKEN",
    },
  },
);
const data = await response.json();
```

== Python

```python
import requests

response = requests.get(
    'https://api.optikpi.com/api/user',
    params={'email': 'admin@example.com', 'workspaceId': 'ws_abc123'},
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}
)
data = response.json()
```

:::

### Response

**Success (200)**

```json
{
  "havePassword": true
}
```

or `{ "havePassword": false }` if the user has no password set.

**Error (400)** — Missing email or workspaceId

```json
{
  "message": "Email not added"
}
```

---

## Get / Update User Details

Retrieve or update a user's profile. This endpoint **requires** a locale prefix.

**`POST /{locale}/api/user`**

### Request Headers

| Header        | Description                         |
| ------------- | ----------------------------------- |
| `userId`      | Injected by middleware from session |
| `workSpaceId` | Injected by middleware from session |

### Request Body

All requests must include a `type` field. Other fields depend on the type.

| Field            | Type     | Required | Description                                                                    |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------ |
| `type`           | `string` | ✅       | One of: `UNIQUE-USER-DETAILS`, `UPDATE-USER`, `UPDATE-MULTI-BRAND-USER-DETAIL` |
| `id`             | `string` | ✅       | User ID (used for all three types)                                             |
| `firstName`      | `string` | ❌       | For `UPDATE-USER`: first name                                                  |
| `email`          | `string` | ❌       | For `UPDATE-USER`: email                                                       |
| `role`           | `string` | ❌       | For `UPDATE-USER` or `UPDATE-MULTI-BRAND-USER-DETAIL`: role                    |
| `status`         | `string` | ❌       | For `UPDATE-USER`: e.g. `inactive`                                             |
| `workspaces`     | `array`  | ❌       | For `UPDATE-USER`: workspace IDs                                               |
| `workspaceId`    | `string` | ❌       | For `UPDATE-USER` or `UPDATE-MULTI-BRAND-USER-DETAIL`: active workspace ID     |
| `failedAttempts` | `number` | ❌       | For `UPDATE-USER`: failed login attempts                                       |

### Type: UNIQUE-USER-DETAILS (Get User)

**Request**

```json
{
  "type": "UNIQUE-USER-DETAILS",
  "id": "usr_abc123"
}
```

**Response (200)**

```json
{
  "user": {
    "id": "usr_abc123",
    "firstName": "John",
    "email": "john@example.com",
    "workspaceId": "ws_xyz789",
    "role": "ADMIN",
    "status": "active"
  }
}
```

**Errors**

| Status | Body                                   |
| ------ | -------------------------------------- |
| 400    | `{ "error": "Missing user ID" }`       |
| 404    | `{ "error": "user not found" }`        |
| 500    | `{ "error": "Internal Server Error" }` |

### Type: UPDATE-USER (Update User)

**Request**

```json
{
  "type": "UPDATE-USER",
  "id": "usr_abc123",
  "firstName": "Jane",
  "email": "jane@example.com",
  "role": "EDITOR",
  "status": "active",
  "workspaces": ["ws_xyz789"],
  "workspaceId": "ws_xyz789",
  "failedAttempts": 0
}
```

**Response (200)**

```json
{
  "user": {
    "id": "usr_abc123",
    "firstName": "Jane",
    "email": "jane@example.com",
    "role": "EDITOR",
    "status": "active",
    "workspaceId": "ws_xyz789",
    "updatedAt": "2025-02-21T10:00:00.000Z"
  }
}
```

**Errors**

| Status | Body                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------ |
| 400    | `{ "error": "Missing user ID" }` or `{ "error": "Missing request type" }` or `{ "error": "Invalid request type" }` |
| 500    | `{ "error": "Internal Server Error" }`                                                                             |

### Type: UPDATE-MULTI-BRAND-USER-DETAIL

**Request**

```json
{
  "type": "UPDATE-MULTI-BRAND-USER-DETAIL",
  "id": "usr_abc123",
  "workspaceId": "ws_new456",
  "role": "VIEWER"
}
```

**Response (200)**

```json
{
  "user": {
    "id": "usr_abc123",
    "workspaceId": "ws_new456",
    "role": "VIEWER"
  }
}
```

**Errors**

| Status | Body                                                                                     |
| ------ | ---------------------------------------------------------------------------------------- |
| 400    | `{ "error": "Missing request type" }` or `{ "error": "Invalid request type" }`           |
| 500    | `{ "error": "Error getting the brands data" }` or `{ "error": "Internal Server Error" }` |
