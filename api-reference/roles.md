# Roles

The Roles API manages workspace user roles and their associated permissions. Roles control which features and actions each user can access within the platform.

**Base path:** `/{locale}/api/roles`

## List Roles

Retrieve all roles defined for the current account.

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

Update the permission set for an existing role.

**`PUT /{locale}/api/roles`** with `type: "UPDATE_ROLE_PERMISSIONS"`

### Request Body

| Field       | Type   | Required | Description                       |
| ----------- | ------ | -------- | --------------------------------- |
| type        | string | ✅       | Must be "UPDATE_ROLE_PERMISSIONS" |
| roleId      | string | ✅       | Role ID to update                 |
| permissions | object | ✅       | New permissions object            |

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

Rename an existing custom role.

**`PUT /{locale}/api/roles`** with `type: "UPDATE_ROLE"`

### Request Body

| Field  | Type   | Required | Description                        |
| ------ | ------ | -------- | ---------------------------------- |
| type   | string | ✅       | Must be "UPDATE_ROLE"              |
| roleId | string | ✅       | Role ID to rename                  |
| name   | string | ❌       | New internal role name (uppercase) |
| label  | string | ❌       | New display label                  |

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

Delete a custom role. System roles (`ADMIN`, `VIEWER`) cannot be deleted.

**`PUT /{locale}/api/roles`** with `type: "DELETE_ROLE"`

### Request Body

| Field            | Type   | Required | Description                           |
| ---------------- | ------ | -------- | ------------------------------------- |
| type             | string | ✅       | Must be "DELETE_ROLE"                 |
| roleId           | string | ✅       | Role ID to delete                     |
| reassignToRoleId | string | ✅       | Role ID to reassign affected users to |

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

| Role   | Description                                                             |
| ------ | ----------------------------------------------------------------------- |
| ADMIN  | Full access to all features. Cannot be deleted or modified.             |
| EDITOR | Can create and edit content. Cannot manage users or workspace settings. |
| VIEWER | Read-only access to all features. Cannot create or edit.                |

## Permissions Schema

Each module supports these permission actions:

| Action | Description                                  |
| ------ | -------------------------------------------- |
| view   | Read access — list and view resource details |
| create | Create new resources                         |
| edit   | Modify existing resources                    |
| delete | Delete resources                             |
| invite | Invite new users (users module only)         |

::: tip
Permissions are loaded into the `RolePermissionsContext` on the frontend at app startup and used to conditionally render UI elements.
:::
