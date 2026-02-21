# User

Endpoints relacionados con usuario: uno en `/api/user` (sin locale) para comprobar contraseña, y uno en `/{locale}/api/user` (con locale) para obtener/actualizar datos del usuario.

## Check User Has Password

Comprueba si existe un usuario para el email y workspace dados y si tiene contraseña configurada. Esta ruta **no** requiere prefijo de locale.

**`GET /api/user`**

### Query Parameters

| Parameter   | Type   | Required | Description                             |
| ----------- | ------ | -------- | --------------------------------------- |
| email       | string | ✅       | Dirección de email del usuario          |
| workspaceId | string | ✅       | Workspace ID para comprobar pertenencia |

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

o `{ "havePassword": false }` si el usuario no tiene contraseña configurada.

**Error (400)** — Falta email o workspaceId

```json
{
  "message": "Email not added"
}
```

---

## Get / Update User Details

Obtener o actualizar el perfil de un usuario. Este endpoint **requiere** prefijo de locale.

**`POST /{locale}/api/user`**

### Request Headers

| Header      | Description                           |
| ----------- | ------------------------------------- |
| userId      | Inyectado por middleware desde sesión |
| workSpaceId | Inyectado por middleware desde sesión |

### Request Body

Todas las peticiones deben incluir un campo `type`. El resto de campos depende del tipo.

| Field          | Type   | Required | Description                                                               |
| -------------- | ------ | -------- | ------------------------------------------------------------------------- |
| type           | string | ✅       | Uno de: UNIQUE-USER-DETAILS, UPDATE-USER, UPDATE-MULTI-BRAND-USER-DETAIL  |
| id             | string | ✅       | User ID (usado en los tres tipos)                                         |
| firstName      | string | ❌       | Para UPDATE-USER: nombre                                                  |
| email          | string | ❌       | Para UPDATE-USER: email                                                   |
| role           | string | ❌       | Para UPDATE-USER o UPDATE-MULTI-BRAND-USER-DETAIL: rol                    |
| status         | string | ❌       | Para UPDATE-USER: p. ej. inactive                                         |
| workspaces     | array  | ❌       | Para UPDATE-USER: IDs de workspace                                        |
| workspaceId    | string | ❌       | Para UPDATE-USER o UPDATE-MULTI-BRAND-USER-DETAIL: ID de workspace activo |
| failedAttempts | number | ❌       | Para UPDATE-USER: intentos de login fallidos                              |

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
