# Authentication

OptikPI uses **NextAuth.js** with a **Credentials Provider** and **JWT sessions** for authentication. All user sessions are stored as signed JWTs in HTTP-only cookies.

## Sign In

Users authenticate via the `/api/auth/signin` endpoint, powered by NextAuth's CredentialsProvider.

**Endpoint**

:::tabs
== HTTP
```http
POST /api/auth/callback/credentials
```
== cURL
```bash
curl -X POST "https://api.optikpi.com/api/auth/callback/credentials" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "yourpassword",
    "workspaceId": "ws_abc123",
    "csrfToken": "a1b2c3..."
  }'
```
== JavaScript
```javascript
const response = await fetch('/api/auth/callback/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'yourpassword',
    workspaceId: 'ws_abc123',
    csrfToken: 'a1b2c3...'
  })
});
```
== Python
```python
import requests

response = requests.post(
    'https://api.optikpi.com/api/auth/callback/credentials',
    json={
        'email': 'admin@example.com',
        'password': 'yourpassword',
        'workspaceId': 'ws_abc123',
        'csrfToken': 'a1b2c3...'
    }
)
```
:::

**Request Body**

| Field         | Type     | Required | Description                                      |
| ------------- | -------- | -------- | ------------------------------------------------ |
| `email`       | `string` | ✅       | User's email address                             |
| `password`    | `string` | ✅       | User's plain-text password (compared via bcrypt) |
| `workspaceId` | `string` | ✅       | The target workspace ID to sign in to            |
| `csrfToken`   | `string` | ✅       | NextAuth CSRF token from `/api/auth/csrf`        |

**Example Request**

```json
{
  "email": "admin@example.com",
  "password": "yourpassword",
  "workspaceId": "ws_abc123",
  "csrfToken": "a1b2c3..."
}
```

## Session Data

Once authenticated, the JWT session contains the following fields accessible via `useSession()` or `getServerSession()`:

| Field                | Type      | Description                                   |
| -------------------- | --------- | --------------------------------------------- |
| `user.id`            | `string`  | User's database ID                            |
| `user.email`         | `string`  | User's email                                  |
| `user.name`          | `string`  | User's full name                              |
| `user.workspaceId`   | `string`  | Active workspace ID                           |
| `user.accountId`     | `string`  | Account (company) ID                          |
| `user.role`          | `string`  | User role (`ADMIN`, `EDITOR`, `VIEWER`, etc.) |
| `user.language`      | `string`  | Preferred language code                       |
| `user.timezone`      | `string`  | Preferred timezone                            |
| `user.isBetaUser`    | `boolean` | Whether the user has access to beta features  |
| `user.isCustomer360` | `boolean` | Whether Customer 360 module is enabled        |

**Example Session Object**

```json
{
  "user": {
    "id": "usr_abc123",
    "email": "admin@example.com",
    "name": "John Doe",
    "workspaceId": "ws_xyz789",
    "accountId": "acc_def456",
    "role": "ADMIN",
    "language": "en",
    "timezone": "Asia/Dubai",
    "isBetaUser": false,
    "isCustomer360": true
  },
  "expires": "2025-03-01T00:00:00.000Z"
}
```

## Session Expiry

Sessions expire after **30 days** of inactivity. The `expires` field in the JWT is checked on every request. If the session is expired, the user is redirected to the login page.

## Middleware (Request Headers)

The Next.js middleware (`middleware.ts`) runs on every API request. It reads the session JWT from the cookie and injects the following headers into the request before it reaches any API route handler:

```ts
request.headers.set('accountId', session.user.accountId);
request.headers.set('workSpaceId', session.user.workspaceId);
request.headers.set('userId', session.user.id);
request.headers.set('timezone', session.user.timezone);
request.headers.set('language', session.user.language);
```

This means **API route handlers can read these headers directly** from the incoming `Request` object — no need to pass them in the request body.

## Role-Based Access Control

OptikPI enforces permissions through a roles system stored in the `roles` collection in MongoDB. The `role` field in the session determines what actions a user can perform. Role permissions are loaded at startup and cached in a React context (`RolePermissionsContext`).

::: tip
See [Roles API →](/api-reference/roles) for managing roles and their permissions programmatically.
:::
