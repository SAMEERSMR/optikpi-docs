# Audience

Los endpoints de Audience permiten crear, listar, actualizar y eliminar segmentos de audiencia. Las audiencias son grupos dinámicos de contactos filtrados por atributos, comportamientos o condiciones SQL que se resuelven mediante **Google BigQuery**.

**Base path:** `/{locale}/api/audience`

## List Audiences

Obtiene una lista paginada de audiencias del workspace actual. Este endpoint devuelve una respuesta **plana** (sin wrapper `result`).

**`GET /{locale}/api/audience`**

### Query Parameters

| Parameter         | Type   | Required | Description                                                              |
| ----------------- | ------ | -------- | ------------------------------------------------------------------------ |
| page              | number | ❌       | Número de página (por defecto: 1)                                        |
| pageSize          | number | ❌       | Registros por página (por defecto: 100)                                  |
| search            | string | ❌       | Filtrar por nombre de audiencia o tags                                   |
| status            | string | ❌       | Array JSON de estados, p. ej. ["active","draft"]                         |
| tab               | string | ❌       | Filtro de pestaña: all, active, draft o rfm                              |
| type              | string | ❌       | Array JSON de tipos de audiencia                                         |
| tags              | string | ❌       | Array JSON de strings de tags                                            |
| sort              | string | ❌       | Objeto JSON de ordenación (por defecto: { "createdAt": "desc" })         |
| excludeAudience   | string | ❌       | Si se establece, excluye la audiencia globalmente excluida del workspace |
| selectFields      | string | ❌       | Lista de campos a devolver separados por comas                           |
| isResourceCreated | string | ❌       | Booleano JSON para filtrar por flag resource-created                     |

### Request Headers

| Header      | Description                                          |
| ----------- | ---------------------------------------------------- |
| workSpaceId | ID del workspace activo (establecido por middleware) |
| userId      | User ID (establecido por middleware)                 |

### Response (200)

```json
{
  "records": [
    {
      "id": "aud_abc123",
      "name": "High Value Customers",
      "tags": ["vip", "high-ltv"],
      "status": "active",
      "groups": [],
      "workspaceId": "ws_xyz789",
      "audienceType": { "type": "static" },
      "totalCustomers": 15420,
      "unsubscribedCustomers": 0,
      "scheduleId": null,
      "groupType": null,
      "activeCustomers": 15420,
      "updatedAt": "2024-11-15T14:30:00.000Z",
      "isResourceCreated": false
    }
  ],
  "totalCount": 42
}
```

**Errors:** 401 `{ "message": "Invalid request" }` cuando falta workSpaceId o userId; 500 en error de servidor.

## Create Audience

Crea un nuevo segmento de audiencia. La API usa un body de petición **basado en tipo**: incluye `type` y los campos de esa operación.

**`POST /{locale}/api/audience`**

### Create (type: AUDIENCE_CREATED)

| Field        | Type     | Required | Description                          |
| ------------ | -------- | -------- | ------------------------------------ |
| type         | string   | ✅       | Debe ser AUDIENCE_CREATED            |
| name         | string   | ✅       | Nombre para mostrar de la audiencia  |
| tags         | string[] | ✅       | Etiquetas (array, puede estar vacío) |
| groups       | array    | ❌       | Grupos de filtro de audiencia        |
| groupType    | string   | ❌       | Tipo de grupo                        |
| audienceType | object   | ❌       | p. ej. { "type": "static" }          |

### Request

```json
{
  "type": "AUDIENCE_CREATED",
  "name": "Churned Users — Last 90 Days",
  "tags": ["churned", "win-back"],
  "groups": [],
  "audienceType": { "type": "static" }
}
```

### Response (200)

Devuelve el objeto de audiencia creado directamente (sin wrapper `result`):

```json
{
  "id": "aud_xyz789",
  "name": "Churned Users — Last 90 Days",
  "tags": ["churned", "win-back"],
  "workspaceId": "ws_abc123",
  "groups": [],
  "audienceType": { "type": "static" },
  "isResourceCreated": false,
  "deletedAt": null,
  "createdAt": "2025-02-20T09:00:00.000Z",
  "updatedAt": "2025-02-20T09:00:00.000Z"
}
```

**Errors:** 400 `{ "message": "Invalid request" }` (falta name/tags o workSpaceId/userId); 400 `{ "message": "Audience with the same name already exists." }` (nombre duplicado); 401 `{ "message": "Invalid request" }`; 500 en error de servidor o creación de tags.

::: info
Otras operaciones de audiencia (actualizar nombre/tags, duplicar, actualización completa, eliminar) usan el mismo endpoint **POST** o **DELETE** con distintos valores de `type` y formas de body. El flujo de creación anterior es el mínimo necesario para una audiencia nueva.
:::

## Update Audience

Las actualizaciones se realizan vía **POST** (p. ej. `type: AUDIENCE_NAME_TAG_UPDATE`, `AUDIENCE_UPDATED`) o **PUT** (p. ej. `type: update-status`, `update-now`, `check-update-now-status`) con un campo `type` y body específico de la operación (p. ej. `id`, `name`, `tags`, `groups`, `status`, `audienceType`). Las respuestas devuelven la audiencia actualizada o un payload de éxito. Se devuelve 409 cuando la audiencia está en uso en un workflow o campaña.

## Delete Audiences

**`DELETE /{locale}/api/audience`**

La eliminación usa un **body** con `type`: `delete-single` (y query param `id`) o `delete-multiple` (body array `selectedAudiences`). Opcional `tags` en el body para limpieza de tags. Las respuestas incluyen el recurso eliminado o el resultado de tags. Se devuelve 409 cuando la audiencia está en uso en un workflow o campaña.

**Example (delete single)**

```http
DELETE /{locale}/api/audience?id=aud_abc123
Content-Type: application/json

{
  "type": "delete-single",
  "status": "active",
  "tags": ["vip"]
}
```

## Audience Object (List / Create response)

| Field                 | Type           | Description                                   |
| --------------------- | -------------- | --------------------------------------------- |
| id                    | string         | ID único de audiencia                         |
| name                  | string         | Nombre para mostrar                           |
| tags                  | string[]       | Etiquetas                                     |
| status                | string         | p. ej. active, draft                          |
| groups                | array          | Grupos de filtro                              |
| workspaceId           | string         | ID del workspace propietario                  |
| audienceType          | object         | p. ej. { "type": "static" }                   |
| totalCustomers        | number         | Total de contactos en el segmento             |
| unsubscribedCustomers | number         | Número de bajas                               |
| activeCustomers       | number         | Número de contactos activos                   |
| scheduleId            | string \| null | ID de programación si está programada         |
| groupType             | string \| null | Tipo de grupo                                 |
| isResourceCreated     | boolean        | Si se creó como recurso                       |
| updatedAt             | string         | Marca de tiempo ISO 8601 última actualización |
| createdAt             | string         | Marca de tiempo ISO 8601 de creación (create) |
