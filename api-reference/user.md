# User

Endpoints for user lookup and profile management. These routes do not require a locale prefix — they are available at `/api/user`.

## Check User Existence

Check whether a user exists by email address and workspace.

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
const response = await fetch('/api/user?email=admin@example.com&workspaceId=ws_abc123', {
  headers: {
    Authorization: 'Bearer YOUR_ACCESS_TOKEN'
  }
});
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

**User exists**

```json
{
  "exists": true,
  "userId": "usr_abc123"
}
```

**User not found**

```json
{
  "exists": false
}
```

## Get / Update User Details

Retrieve or update a user's profile and preferences.

**`POST /api/user`**

### Request Headers

| Header        | Type     | Description                         |
| ------------- | -------- | ----------------------------------- |
| `userId`      | `string` | Injected by middleware from session |
| `workSpaceId` | `string` | Injected by middleware from session |

### Request Body

| Field      | Type     | Required          | Description                                  |
| ---------- | -------- | ----------------- | -------------------------------------------- |
| `type`     | `string` | ✅                | Operation type — `GET_USER` or `UPDATE_USER` |
| `userId`   | `string` | ✅ (for GET_USER) | ID of the user to retrieve                   |
| `name`     | `string` | ❌                | Updated display name                         |
| `language` | `string` | ❌                | Preferred language code (e.g. `en`, `ar`)    |
| `timezone` | `string` | ❌                | Preferred timezone (e.g. `Asia/Dubai`)       |
| `avatar`   | `string` | ❌                | URL to profile avatar image                  |

### Get User

```json
{
  "type": "GET_USER",
  "userId": "usr_abc123"
}
```

**Response**

```json
{
  "result": {
    "data": {
      "id": "usr_abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "language": "en",
      "timezone": "Asia/Dubai",
      "avatar": "https://s3.amazonaws.com/bucket/avatars/usr_abc123.jpg",
      "workspaceId": "ws_xyz789",
      "isBetaUser": false,
      "isCustomer360": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "message": "User fetched successfully",
    "status": 200
  }
}
```

### Update User

```json
{
  "type": "UPDATE_USER",
  "name": "Jane Doe",
  "language": "ar",
  "timezone": "Asia/Riyadh"
}
```

**Response**

```json
{
  "result": {
    "data": {
      "id": "usr_abc123",
      "name": "Jane Doe",
      "language": "ar",
      "timezone": "Asia/Riyadh"
    },
    "message": "User updated successfully",
    "status": 200
  }
}
```

## User Object

Full user object returned from the database:

| Field           | Type             | Description                          |
| --------------- | ---------------- | ------------------------------------ |
| `id`            | `string`         | Unique user ID (MongoDB ObjectId)    |
| `name`          | `string`         | Full display name                    |
| `email`         | `string`         | Email address (unique per workspace) |
| `role`          | `string`         | User role within the workspace       |
| `language`      | `string`         | Preferred UI language                |
| `timezone`      | `string`         | Preferred timezone                   |
| `avatar`        | `string \| null` | Profile image URL                    |
| `workspaceId`   | `string`         | Associated workspace ID              |
| `isBetaUser`    | `boolean`        | Beta features access flag            |
| `isCustomer360` | `boolean`        | Customer 360 module access flag      |
| `createdAt`     | `string`         | ISO 8601 creation timestamp          |
| `updatedAt`     | `string`         | ISO 8601 last update timestamp       |
