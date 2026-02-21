# Roles

La API de Roles gestiona los roles de usuario del workspace y sus permisos asociados. Los roles controlan qué funcionalidades y acciones puede realizar cada usuario en la plataforma.

**Base path:** `/{locale}/api/roles`

## List Roles

Obtiene todos los roles definidos para la cuenta actual.

**`GET /{locale}/api/roles`**

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "role_abc123",
        "name": "ADMIN",
        "label": "Administrator",
        "isSystem": true,
        "permissions": {
          "campaigns": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "workflows": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "audience": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "library": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "reports": { "view": true, "create": true, "delete": true },
          "integrations": { "view": true, "create": true, "delete": true },
          "workspace": { "view": true, "edit": true },
          "users": {
            "view": true,
            "invite": true,
            "edit": true,
            "delete": true
          }
        },
        "createdAt": "2023-06-01T00:00:00.000Z"
      },
      {
        "id": "role_def456",
        "name": "EDITOR",
        "label": "Editor",
        "isSystem": false,
        "permissions": {
          "campaigns": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": false
          },
          "workflows": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": false
          },
          "audience": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": false
          },
          "library": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": false
          },
          "reports": { "view": true, "create": true, "delete": false },
          "integrations": { "view": true, "create": false, "delete": false },
          "workspace": { "view": true, "edit": false },
          "users": {
            "view": true,
            "invite": false,
            "edit": false,
            "delete": false
          }
        }
      }
    ],
    "message": "Roles fetched successfully",
    "status": 200
  }
}
```

## Update Role Permissions

Actualiza el conjunto de permisos de un rol existente.

**`PUT /{locale}/api/roles`** con `type: "UPDATE_ROLE_PERMISSIONS"`

### Request Body

| Field       | Type   | Required | Description                        |
| ----------- | ------ | -------- | ---------------------------------- |
| type        | string | ✅       | Debe ser "UPDATE_ROLE_PERMISSIONS" |
| roleId      | string | ✅       | ID del rol a actualizar            |
| permissions | object | ✅       | Nuevo objeto de permisos           |

### Request

```json
{
  "type": "UPDATE_ROLE_PERMISSIONS",
  "roleId": "role_def456",
  "permissions": {
    "campaigns": { "view": true, "create": true, "edit": true, "delete": true },
    "workflows": {
      "view": true,
      "create": true,
      "edit": false,
      "delete": false
    }
  }
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "role_def456",
      "name": "EDITOR",
      "permissions": {}
    },
    "message": "Role permissions updated successfully",
    "status": 200
  }
}
```

## Update Role Name / Label

Renombra un rol personalizado existente.

**`PUT /{locale}/api/roles`** con `type: "UPDATE_ROLE"`

### Request Body

| Field  | Type   | Required | Description                               |
| ------ | ------ | -------- | ----------------------------------------- |
| type   | string | ✅       | Debe ser "UPDATE_ROLE"                    |
| roleId | string | ✅       | ID del rol a renombrar                    |
| name   | string | ❌       | Nuevo nombre interno del rol (mayúsculas) |
| label  | string | ❌       | Nueva etiqueta para mostrar               |

### Request

```json
{
  "type": "UPDATE_ROLE",
  "roleId": "role_def456",
  "label": "Content Editor"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "role_def456",
      "name": "EDITOR",
      "label": "Content Editor"
    },
    "message": "Role updated successfully",
    "status": 200
  }
}
```

## Delete Role

Elimina un rol personalizado. Los roles del sistema (`ADMIN`, `VIEWER`) no se pueden eliminar.

**`PUT /{locale}/api/roles`** con `type: "DELETE_ROLE"`

### Request Body

| Field            | Type   | Required | Description                                        |
| ---------------- | ------ | -------- | -------------------------------------------------- |
| type             | string | ✅       | Debe ser "DELETE_ROLE"                             |
| roleId           | string | ✅       | ID del rol a eliminar                              |
| reassignToRoleId | string | ✅       | ID del rol al que reasignar los usuarios afectados |

### Request

```json
{
  "type": "DELETE_ROLE",
  "roleId": "role_def456",
  "reassignToRoleId": "role_viewer_01"
}
```

### Response

```json
{
  "result": {
    "data": null,
    "message": "Role deleted successfully",
    "status": 200
  }
}
```

## Default System Roles

| Role   | Description                                                                                 |
| ------ | ------------------------------------------------------------------------------------------- |
| ADMIN  | Acceso completo a todas las funcionalidades. No se puede eliminar ni modificar.             |
| EDITOR | Puede crear y editar contenido. No puede gestionar usuarios ni configuración del workspace. |
| VIEWER | Acceso solo lectura a todas las funcionalidades. No puede crear ni editar.                  |

## Permissions Schema

Cada módulo admite estas acciones de permiso:

| Action | Description                                           |
| ------ | ----------------------------------------------------- |
| view   | Acceso de lectura — listar y ver detalles del recurso |
| create | Crear nuevos recursos                                 |
| edit   | Modificar recursos existentes                         |
| delete | Eliminar recursos                                     |
| invite | Invitar nuevos usuarios (solo módulo users)           |

::: tip
Los permisos se cargan en el `RolePermissionsContext` en el frontend al iniciar la aplicación y se usan para mostrar u ocultar elementos de la interfaz.
:::
