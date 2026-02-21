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
    "csrfToken": "a1b2c3..."
  }'
```

== JavaScript

```javascript
const response = await fetch("/api/auth/callback/credentials", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "yourpassword",
    csrfToken: "a1b2c3...",
  }),
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
        'csrfToken': 'a1b2c3...'
    }
)
```

:::

**Request Body**

| Field         | Type     | Required | Description                                          |
| ------------- | -------- | -------- | ---------------------------------------------------- |
| `email`       | `string` | ✅       | User's email address                                 |
| `password`    | `string` | ✅       | User's plain-text password (compared via bcrypt)     |
| `csrfToken`   | `string` | ✅       | NextAuth CSRF token from `/api/auth/csrf`            |
| `workspaceId` | `string` | ❌       | Optional; workspace is determined from user record   |
| `remember`    | `string` | ❌       | Optional; `"true"` for longer session (e.g. 30 days) |

**Example Request**

```json
{
  "email": "admin@example.com",
  "password": "yourpassword",
  "csrfToken": "a1b2c3..."
}
```

::: danger
Never expose credentials in client-side code, URLs, or logs. The password and CSRF token must only be sent in the POST body over HTTPS and must not be stored in the browser (e.g. in `localStorage`) or committed to version control.
:::

## Session Data

Once authenticated, the JWT session contains the following fields accessible via `useSession()` or `getServerSession()`:

| Field                                     | Type      | Description                                        |
| ----------------------------------------- | --------- | -------------------------------------------------- |
| `user.id`                                 | `string`  | User's database ID                                 |
| `user.email`                              | `string`  | User's email (from NextAuth)                       |
| `user.workspaceId`                        | `string`  | Active workspace ID                                |
| `user.workspaces`                         | `array`   | Workspaces the user can access                     |
| `user.accountId`                          | `string`  | Account (company) ID                               |
| `user.role`                               | `string`  | User role within the workspace                     |
| `user.language`                           | `string`  | Preferred language code                            |
| `user.timezone`                           | `string`  | Preferred timezone                                 |
| `user.rootUser`                           | `boolean` | Whether the user is a root user                    |
| `user.isSupportUser`                      | `boolean` | Whether the user is a support user                 |
| `user.enableDataPlatformCSVImport`        | `boolean` | Whether Data Platform CSV import is enabled        |
| `user.enableAudienceAllocationInCampaign` | `boolean` | Whether audience allocation in campaign is enabled |

**Example Session Object**

```json
{
  "user": {
    "id": "usr_abc123",
    "email": "admin@example.com",
    "workspaceId": "ws_xyz789",
    "workspaces": ["ws_xyz789"],
    "accountId": "acc_def456",
    "role": "ADMIN",
    "language": "en",
    "timezone": "Asia/Dubai",
    "rootUser": false,
    "isSupportUser": false,
    "enableDataPlatformCSVImport": true,
    "enableAudienceAllocationInCampaign": true
  },
  "expires": "2025-03-01T00:00:00.000Z"
}
```

## Session Expiry

Session expiry is computed from **login time** and **user session settings** (e.g. workspace session duration and remember-me). Supported duration values: `never_expire`, `one_hour`, `one_day`, `one_week`, `one_month`. Default: **30 days** if remember-me is set, **1 day** otherwise. The `expires` field in the session is checked on every request; if expired, the user is redirected to the login page.

## Middleware (Request Headers)

The Next.js middleware (`middleware.ts`) runs on every API request. It reads the session JWT from the cookie and injects the following headers into the request before it reaches any API route handler:

```ts
request.headers.set("accountId", session.user.accountId);
request.headers.set("workSpaceId", session.user.workspaceId);
request.headers.set("userId", session.user.id);
request.headers.set("timezone", session.user.timezone);
request.headers.set("language", session.user.language);
```

This means **API route handlers can read these headers directly** from the incoming `Request` object — no need to pass them in the request body.

## Role-Based Access Control

OptikPI enforces permissions through a roles system stored in the `roles` collection in MongoDB. The `role` field in the session determines what actions a user can perform. Role permissions are loaded at startup and cached in a React context (`RolePermissionsContext`).

::: tip
See [Roles API →](/api-reference/roles) for managing roles and their permissions programmatically.
:::
