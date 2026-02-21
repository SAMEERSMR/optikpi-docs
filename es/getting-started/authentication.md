# Autenticación

OptiKPI utiliza **NextAuth.js** con **Credentials Provider** y **sesiones JWT** para la autenticación. Todas las sesiones de usuario se almacenan como JWTs firmados en cookies HTTP-only.

## Inicio de sesión

Los usuarios se autentican mediante el endpoint `/api/auth/signin`, impulsado por el CredentialsProvider de NextAuth.

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

**Cuerpo de la petición**

| Campo       | Tipo   | Requerido | Descripción                                                           |
| ----------- | ------ | --------- | --------------------------------------------------------------------- |
| email       | string | ✅        | Dirección de correo del usuario                                       |
| password    | string | ✅        | Contraseña en texto plano (comparada vía bcrypt)                      |
| csrfToken   | string | ✅        | Token CSRF de NextAuth desde /api/auth/csrf                           |
| workspaceId | string | ❌        | Opcional; el workspace se determina a partir del registro del usuario |
| remember    | string | ❌        | Opcional; "true" para sesión más larga (p. ej. 30 días)               |

**Ejemplo de petición**

```json
{
  "email": "admin@example.com",
  "password": "yourpassword",
  "csrfToken": "a1b2c3..."
}
```

::: danger
Nunca expongas credenciales en código del cliente, URLs o logs. La contraseña y el token CSRF solo deben enviarse en el cuerpo POST por HTTPS y no deben almacenarse en el navegador (p. ej. en `localStorage`) ni subirse al control de versiones.
:::

## Datos de sesión

Una vez autenticado, la sesión JWT contiene los siguientes campos accesibles mediante `useSession()` o `getServerSession()`:

| Campo                                   | Tipo    | Descripción                                              |
| --------------------------------------- | ------- | -------------------------------------------------------- |
| user.id                                 | string  | ID del usuario en la base de datos                       |
| user.email                              | string  | Correo del usuario (desde NextAuth)                      |
| user.workspaceId                        | string  | ID del workspace activo                                  |
| user.workspaces                         | array   | Workspaces a los que el usuario puede acceder            |
| user.accountId                          | string  | ID de la cuenta (empresa)                                |
| user.role                               | string  | Rol del usuario en el workspace                          |
| user.language                           | string  | Código de idioma preferido                               |
| user.timezone                           | string  | Zona horaria preferida                                   |
| user.rootUser                           | boolean | Si el usuario es usuario root                            |
| user.isSupportUser                      | boolean | Si el usuario es de soporte                              |
| user.enableDataPlatformCSVImport        | boolean | Si está habilitada la importación CSV de Data Platform   |
| user.enableAudienceAllocationInCampaign | boolean | Si está habilitada la asignación de audiencia en campaña |

**Ejemplo de objeto de sesión**

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

## Caducidad de la sesión

La caducidad de la sesión se calcula a partir del **momento del inicio de sesión** y de la **configuración de sesión del usuario** (p. ej. duración de sesión del workspace y recordarme). Valores de duración soportados: `never_expire`, `one_hour`, `one_day`, `one_week`, `one_month`. Por defecto: **30 días** si está activado recordarme, **1 día** en caso contrario. El campo `expires` de la sesión se comprueba en cada petición; si ha caducado, el usuario se redirige a la página de inicio de sesión.

## Middleware (cabeceras de petición)

El middleware de Next.js (`middleware.ts`) se ejecuta en cada petición API. Lee el JWT de sesión de la cookie e inyecta las siguientes cabeceras en la petición antes de que llegue al manejador de la ruta API:

```ts
request.headers.set("accountId", session.user.accountId);
request.headers.set("workSpaceId", session.user.workspaceId);
request.headers.set("userId", session.user.id);
request.headers.set("timezone", session.user.timezone);
request.headers.set("language", session.user.language);
```

Esto significa que **los manejadores de rutas API pueden leer estas cabeceras directamente** del objeto `Request` entrante; no hace falta pasarlas en el cuerpo de la petición.

## Control de acceso por roles

OptiKPI aplica permisos mediante un sistema de roles almacenado en la colección `roles` de MongoDB. El campo `role` de la sesión determina qué acciones puede realizar un usuario. Los permisos de rol se cargan al arranque y se almacenan en caché en un contexto de React (`RolePermissionsContext`).

::: tip
Consulta [API de Roles →](/api-reference/roles) para gestionar roles y sus permisos de forma programática.
:::
