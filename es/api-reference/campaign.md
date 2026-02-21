# Campaign

Los endpoints de Campaign gestionan el ciclo de vida completo de las campañas de marketing: creación, programación, envío, actualización de estado y eliminación.

**Base path:** `/{locale}/api/campaign`

## List Campaigns

Obtiene una lista paginada de campañas del workspace actual.

**`GET /{locale}/api/campaign`**

### Query Parameters

| Parameter | Type   | Required | Description                                             |
| --------- | ------ | -------- | ------------------------------------------------------- |
| page      | number | ❌       | Número de página (por defecto: 1)                       |
| pageSize  | number | ❌       | Registros por página (por defecto: 10)                  |
| status    | string | ❌       | Filtrar por estado (p. ej. draft, scheduled, completed) |

### Request Headers

| Header      | Description                                          |
| ----------- | ---------------------------------------------------- |
| workSpaceId | ID del workspace activo (establecido por middleware) |
| userId      | User ID (establecido por middleware)                 |

### Response (200)

Devuelve una lista de campañas (la forma depende de `fetchAndFlattenCampaigns`). Normalmente incluye registros de campaña e información de paginación.

**Errors:** 401 cuando falta workSpaceId/userId; 500 `{ "message": "Error fetching the campaigns", "error": ... }`.

## Create Campaign

Crea una nueva campaña. La API usa un body de petición **basado en tipo**: incluye `type` y los campos de esa operación.

**`POST /{locale}/api/campaign`**

### Create (type: CAMPAIGN_CREATED)

| Field         | Type     | Required | Description                                                                 |
| ------------- | -------- | -------- | --------------------------------------------------------------------------- |
| type          | string   | ✅       | Debe ser CAMPAIGN_CREATED                                                   |
| name          | string   | ✅       | Nombre para mostrar de la campaña                                           |
| color         | string   | ✅       | Color de la campaña                                                         |
| tags          | string[] | ✅       | Etiquetas (array)                                                           |
| goal          | object   | ❌       | Configuración del objetivo de la campaña                                    |
| audience      | object   | ❌       | Configuración de audiencia                                                  |
| communication | object   | ❌       | Plantillas y configuración de canal                                         |
| trigger       | object   | ❌       | Configuración del disparador                                                |
| (other)       | —        | ❌       | Campos adicionales por app (p. ej. campaignGoal, channelTypes, triggerType) |

### Response (200)

```json
{
  "newCampaign": {
    "id": "cmp_abc123",
    "name": "Summer Sale",
    "color": "#6172F3",
    "tags": ["summer", "promo"],
    "workspaceId": "ws_xyz789",
    "status": "draft",
    "createdAt": "2025-05-20T10:00:00.000Z"
  }
}
```

**Errors:** 400 `{ "message": "Invalid request, missing fields" }` (falta name/color/tags/type); 400 `{ "message": "Campaign with the same name already exists.", "nameError": true }`; 401; 500.

::: info
Otras operaciones de campaña (actualizar nombre/color/tags, actualizar goal/audience/trigger/communication, lanzar) usan el mismo endpoint **POST** con distintos valores de `type`: p. ej. `CAMPAIGN_UPDATED`, `GOAL`, `AUDIENCE`, `TRIGGER`, `COMMUNICATION`, `CAMPAIGN_LAUNCHED`. Cada una tiene una forma de body específica; `campaignId` es obligatorio para actualizaciones.
:::

## Delete Campaigns

Elimina una o más campañas por ID.

**`DELETE /{locale}/api/campaign`**

### Request Body

| Field       | Type     | Required | Description                                   |
| ----------- | -------- | -------- | --------------------------------------------- |
| campaignIds | string[] | ✅       | Array de IDs de campaña a eliminar            |
| tags        | string[] | ❌       | Opcional; para limpieza de tags tras eliminar |

### Request

```json
{
  "campaignIds": ["cmp_abc123", "cmp_def456"],
  "tags": ["summer"]
}
```

### Response (200)

Envelope de éxito estándar:

```json
{
  "result": {
    "data": [],
    "message": "Campaigns deleted successfully",
    "status": 200
  }
}
```

**Errors:** 400 cuando falta workSpaceId/userId o campaignIds está vacío; 500 en fallo de eliminación.

## Get Campaign Details

Obtiene los detalles completos de una campaña.

**`GET /{locale}/api/campaign/{campaignId}`**

### Path Parameters

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| campaignId | string | Campaign ID |

### Response

```json
{
  "result": {
    "data": {
      "id": "cmp_abc123",
      "name": "Summer Sale Announcement",
      "channel": "EMAIL",
      "status": "SCHEDULED",
      "audienceId": "aud_xyz789",
      "libraryId": "lib_abc123",
      "subject": "☀️ Our Biggest Sale of the Year Starts Now",
      "previewText": "Up to 50% off — this weekend only.",
      "senderId": "int_sendgrid_01",
      "scheduledAt": "2025-06-01T09:00:00.000Z",
      "tags": ["summer", "promo"],
      "utmParams": {
        "utm_source": "email",
        "utm_medium": "newsletter",
        "utm_campaign": "summer-sale-2025"
      },
      "stats": {
        "sent": 0,
        "delivered": 0,
        "opened": 0,
        "clicked": 0,
        "bounced": 0,
        "unsubscribed": 0
      },
      "createdAt": "2025-05-20T10:00:00.000Z",
      "updatedAt": "2025-05-20T10:00:00.000Z"
    },
    "message": "Campaign fetched successfully",
    "status": 200
  }
}
```

## Update Campaign

Actualiza el contenido o la configuración de una campaña.

**`PUT /{locale}/api/campaign/{campaignId}`**

### Path Parameters

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| campaignId | string | Campaign ID |

### Request Body

Mismos campos que Create Campaign — incluye solo los campos que quieras actualizar.

### Response

```json
{
  "result": {
    "data": {
      "id": "cmp_abc123",
      "name": "Summer Sale Announcement — Updated",
      "scheduledAt": "2025-06-02T09:00:00.000Z",
      "updatedAt": "2025-05-21T08:00:00.000Z"
    },
    "message": "Campaign updated successfully",
    "status": 200
  }
}
```

## Update Campaign Status

Actualiza el estado de entrega de una campaña (programar, pausar, cancelar, etc.).

**`POST /{locale}/api/campaign/{campaignId}`**

### Request Body

| Field       | Type   | Required | Description                                           |
| ----------- | ------ | -------- | ----------------------------------------------------- |
| type        | string | ✅       | Tipo de acción de estado                              |
| scheduledAt | string | ❌       | Nueva fecha/hora de programación (para tipo SCHEDULE) |

### Status Action Types

| type     | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| SCHEDULE | Programar la campaña para entrega                                   |
| PAUSE    | Pausar una campaña en ejecución                                     |
| RESUME   | Reanudar una campaña pausada                                        |
| CANCEL   | Cancelar una campaña programada o en ejecución                      |
| SEND_NOW | Disparar la entrega de la campaña de inmediato (omite programación) |

### Request

```json
{
  "type": "SCHEDULE",
  "scheduledAt": "2025-06-01T09:00:00.000Z"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "cmp_abc123",
      "status": "SCHEDULED",
      "scheduledAt": "2025-06-01T09:00:00.000Z"
    },
    "message": "Campaign scheduled successfully",
    "status": 200
  }
}
```

## Campaign Object

| Field       | Type           | Description                                                            |
| ----------- | -------------- | ---------------------------------------------------------------------- |
| id          | string         | ID único de campaña                                                    |
| name        | string         | Nombre para mostrar                                                    |
| channel     | string         | EMAIL \| SMS \| PUSH                                                   |
| status      | string         | DRAFT \| SCHEDULED \| RUNNING \| SENT \| PAUSED \| CANCELLED \| FAILED |
| audienceId  | string         | ID de audiencia objetivo                                               |
| libraryId   | string         | ID de plantilla de contenido                                           |
| subject     | string \| null | Asunto del email (solo EMAIL)                                          |
| previewText | string \| null | Texto de preheader del email                                           |
| senderId    | string \| null | ID de integración/remitente                                            |
| scheduledAt | string \| null | Fecha/hora de envío programada                                         |
| tags        | string[]       | Etiquetas                                                              |
| utmParams   | object \| null | Parámetros UTM de seguimiento                                          |
| stats       | object         | Métricas de entrega (sent, opened, clicked, etc.)                      |
| workspaceId | string         | ID del workspace propietario                                           |
| createdAt   | string         | Marca de tiempo ISO 8601 de creación                                   |
| updatedAt   | string         | Marca de tiempo ISO 8601 de última actualización                       |

## Campaign Channels

| Channel | Delivery Via               | Template Type                |
| ------- | -------------------------- | ---------------------------- |
| EMAIL   | SendGrid / Elastic Email   | Plantilla HTML de email      |
| SMS     | Integrated SMS provider    | Texto plano / rich text      |
| PUSH    | Web Push API (OptiKPI SDK) | Payload de notificación push |
