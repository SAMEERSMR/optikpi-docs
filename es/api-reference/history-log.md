# History Log

La API History Log proporciona un registro de auditoría de todas las acciones significativas realizadas dentro de un workspace: cambios de campaña, despliegues de workflow, actualizaciones de audiencia, acciones de usuario y eventos del sistema.

**Base path:** `/{locale}/api/history-log`

## List History Logs

Obtiene una lista paginada de entradas del registro de actividad del workspace actual.

**`GET /{locale}/api/history-log`**

### Query Parameters

| Parameter    | Type   | Required | Description                                                                              |
| ------------ | ------ | -------- | ---------------------------------------------------------------------------------------- |
| page         | number | ❌       | Número de página (por defecto: 1)                                                        |
| limit        | number | ❌       | Registros por página (por defecto: 20)                                                   |
| resourceType | string | ❌       | Filtrar por recurso: campaign, workflow, audience, library, integration, workspace, user |
| resourceId   | string | ❌       | Filtrar logs por un ID de recurso concreto                                               |
| action       | string | ❌       | Filtrar por tipo de acción                                                               |
| userId       | string | ❌       | Filtrar por el usuario que realizó la acción                                             |
| startDate    | string | ❌       | Filtro de fecha inicio YYYY-MM-DD                                                        |
| endDate      | string | ❌       | Filtro de fecha fin YYYY-MM-DD                                                           |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "log_abc123",
        "resourceType": "campaign",
        "resourceId": "cmp_abc123",
        "resourceName": "Summer Sale Announcement",
        "action": "STATUS_CHANGED",
        "details": {
          "from": "DRAFT",
          "to": "SCHEDULED",
          "scheduledAt": "2025-06-01T09:00:00.000Z"
        },
        "performedBy": {
          "id": "usr_xyz789",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "ipAddress": "192.168.1.1",
        "createdAt": "2025-05-20T10:00:00.000Z"
      },
      {
        "id": "log_def456",
        "resourceType": "workflow",
        "resourceId": "wf_abc123",
        "resourceName": "Welcome Series",
        "action": "ACTIVATED",
        "details": {
          "deployedAt": "2025-02-10T11:00:00.000Z",
          "nodeCount": 8
        },
        "performedBy": {
          "id": "usr_xyz789",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "ipAddress": "192.168.1.1",
        "createdAt": "2025-02-10T11:00:00.000Z"
      }
    ],
    "message": "History logs fetched successfully",
    "status": 200,
    "totalCount": 284
  }
}
```

## Activity Log Object

| Field             | Type           | Description                                                |
| ----------------- | -------------- | ---------------------------------------------------------- |
| id                | string         | ID único de la entrada del log                             |
| resourceType      | string         | Tipo de recurso afectado                                   |
| resourceId        | string         | ID del recurso afectado                                    |
| resourceName      | string         | Nombre para mostrar del recurso en el momento de la acción |
| action            | string         | Acción realizada (ver Action Types más abajo)              |
| details           | object         | Metadatos específicos de la acción                         |
| performedBy       | object         | Usuario que realizó la acción                              |
| performedBy.id    | string         | User ID                                                    |
| performedBy.name  | string         | Nombre para mostrar del usuario                            |
| performedBy.email | string         | Email del usuario                                          |
| ipAddress         | string \| null | Dirección IP del cliente                                   |
| workspaceId       | string         | Workspace ID                                               |
| createdAt         | string         | Marca de tiempo ISO 8601 de cuándo ocurrió la acción       |

## Action Types

### Campaign Actions

| Action         | Description                                            |
| -------------- | ------------------------------------------------------ |
| CREATED        | Se creó una nueva campaña                              |
| UPDATED        | Se modificaron configuración o contenido de la campaña |
| STATUS_CHANGED | Se cambió el estado de la campaña                      |
| SCHEDULED      | La campaña se programó para entrega                    |
| SENT           | La campaña se envió                                    |
| PAUSED         | La campaña se pausó                                    |
| CANCELLED      | La campaña se canceló                                  |
| DELETED        | La campaña se eliminó                                  |

### Workflow Actions

| Action      | Description                            |
| ----------- | -------------------------------------- |
| CREATED     | Se creó un nuevo workflow              |
| UPDATED     | Se modificó la definición del workflow |
| ACTIVATED   | El workflow se desplegó y activó       |
| DEACTIVATED | El workflow se desactivó               |
| DELETED     | El workflow se eliminó                 |

### Audience Actions

| Action    | Description                                          |
| --------- | ---------------------------------------------------- |
| CREATED   | Se creó una nueva audiencia                          |
| UPDATED   | Se cambiaron filtros o configuración de la audiencia |
| REFRESHED | Se recalculó el conteo de contactos vía BigQuery     |
| DELETED   | Se eliminó la audiencia                              |

### User & Workspace Actions

| Action              | Description                                |
| ------------------- | ------------------------------------------ |
| USER_INVITED        | Se invitó a un nuevo usuario al workspace  |
| USER_REMOVED        | Se eliminó un usuario del workspace        |
| ROLE_CHANGED        | Se actualizó el rol de un usuario          |
| WORKSPACE_UPDATED   | Se modificó la configuración del workspace |
| INTEGRATION_ADDED   | Se conectó una nueva integración           |
| INTEGRATION_REMOVED | Se desconectó una integración              |
