# Library

La API Library gestiona plantillas de contenido reutilizables: diseños HTML de email, cuerpos de mensajes SMS y payloads de notificaciones push. Las plantillas almacenadas en la biblioteca pueden ser referenciadas por campañas y workflows.

**Base path:** `/{locale}/api/library`

## List Library Items

Obtiene una lista paginada de plantillas.

**`GET /{locale}/api/library`**

### Query Parameters

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| page      | number | ❌       | Número de página (por defecto: 1)        |
| limit     | number | ❌       | Registros por página (por defecto: 10)   |
| type      | string | ❌       | Filtrar por tipo: EMAIL, SMS, PUSH       |
| search    | string | ❌       | Buscar por nombre de plantilla           |
| tab       | string | ❌       | Filtro de pestaña: all, email, sms, push |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "lib_abc123",
        "name": "Welcome Email — Light Theme",
        "type": "EMAIL",
        "thumbnail": "https://s3.amazonaws.com/bucket/thumbnails/lib_abc123.png",
        "tags": ["welcome", "onboarding"],
        "createdAt": "2024-08-01T10:00:00.000Z",
        "updatedAt": "2024-09-15T14:00:00.000Z"
      }
    ],
    "message": "Library items fetched successfully",
    "status": 200,
    "totalCount": 34
  }
}
```

## Create Library Item

Crea una nueva plantilla.

**`POST /{locale}/api/library`**

### Request Body

| Field       | Type     | Required | Description                                          |
| ----------- | -------- | -------- | ---------------------------------------------------- |
| name        | string   | ✅       | Nombre para mostrar de la plantilla                  |
| type        | string   | ✅       | Tipo de plantilla: EMAIL, SMS, PUSH                  |
| htmlContent | string   | ❌       | String HTML completo (obligatorio para EMAIL)        |
| jsonContent | object   | ❌       | Datos JSON de diseño (editores drag-and-drop)        |
| smsContent  | string   | ❌       | Cuerpo de SMS en texto plano (obligatorio para SMS)  |
| pushPayload | object   | ❌       | Payload de notificación push (obligatorio para PUSH) |
| tags        | string[] | ❌       | Etiquetas                                            |

### Email Template Request

```json
{
  "name": "Welcome Email — Light Theme",
  "type": "EMAIL",
  "htmlContent": "<!DOCTYPE html><html>...</html>",
  "tags": ["welcome", "onboarding"]
}
```

### SMS Template Request

```json
{
  "name": "Order Confirmation SMS",
  "type": "SMS",
  "smsContent": "Hi {{first_name}}, your order #{{order_id}} has been confirmed! Track it here: {{tracking_url}}",
  "tags": ["transactional"]
}
```

### Push Template Request

```json
{
  "name": "Flash Sale Push",
  "type": "PUSH",
  "pushPayload": {
    "title": "Flash Sale — 50% Off",
    "body": "Limited time. Shop now.",
    "icon": "https://cdn.example.com/icon.png",
    "url": "https://example.com/sale"
  },
  "tags": ["promotions"]
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "lib_abc123",
      "name": "Welcome Email — Light Theme",
      "type": "EMAIL",
      "createdAt": "2025-02-20T09:00:00.000Z"
    },
    "message": "Template created successfully",
    "status": 201
  }
}
```

## Delete Library Items

Elimina una o más plantillas.

**`DELETE /{locale}/api/library`**

### Request Body

| Field | Type     | Required | Description                                       |
| ----- | -------- | -------- | ------------------------------------------------- |
| ids   | string[] | ✅       | Array de IDs de elemento de biblioteca a eliminar |

### Response

```json
{
  "result": {
    "data": { "deletedCount": 2 },
    "message": "Templates deleted successfully",
    "status": 200
  }
}
```

## Get Library Item

Obtiene los detalles completos de una plantilla, incluido el contenido.

**`GET /{locale}/api/library/{libraryId}`**

### Path Parameters

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| libraryId | string | Library item ID |

### Response

```json
{
  "result": {
    "data": {
      "id": "lib_abc123",
      "name": "Welcome Email — Light Theme",
      "type": "EMAIL",
      "htmlContent": "<!DOCTYPE html><html>...</html>",
      "jsonContent": {},
      "tags": ["welcome"],
      "thumbnail": "https://s3.amazonaws.com/...",
      "createdAt": "2024-08-01T10:00:00.000Z",
      "updatedAt": "2024-09-15T14:00:00.000Z"
    },
    "message": "Template fetched successfully",
    "status": 200
  }
}
```

## HTML to Image (Thumbnail Generation)

Genera una imagen de vista previa (miniatura) a partir del contenido HTML.

**`POST /{locale}/api/library/{libraryId}`** con `type: "HTML_TO_IMAGE"`

### Request Body

| Field | Type   | Required | Description                                |
| ----- | ------ | -------- | ------------------------------------------ |
| type  | string | ✅       | Debe ser "HTML_TO_IMAGE"                   |
| html  | string | ✅       | String HTML a renderizar                   |
| width | number | ❌       | Ancho de viewport en px (por defecto: 600) |

### Request

```json
{
  "type": "HTML_TO_IMAGE",
  "html": "<!DOCTYPE html><html>...</html>",
  "width": 600
}
```

### Response

```json
{
  "result": {
    "data": {
      "thumbnailUrl": "https://s3.amazonaws.com/bucket/thumbnails/lib_abc123.png"
    },
    "message": "Thumbnail generated successfully",
    "status": 200
  }
}
```

## Send Test Message

Envía un mensaje de prueba a una dirección de email o número de teléfono indicados.

**`PUT /{locale}/api/library/{libraryId}`**

### Request Body

| Field     | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| type      | string | ✅       | Debe ser "SEND_TEST"                      |
| channel   | string | ✅       | EMAIL o SMS                               |
| recipient | string | ✅       | Email o número de teléfono de destino     |
| subject   | string | ❌       | Asunto del email (obligatorio para EMAIL) |
| senderId  | string | ❌       | ID de remitente de integración a usar     |

### Request

```json
{
  "type": "SEND_TEST",
  "channel": "EMAIL",
  "recipient": "dev@example.com",
  "subject": "Test: Welcome Email Template",
  "senderId": "int_sendgrid_01"
}
```

### Response

```json
{
  "result": {
    "data": {
      "sent": true,
      "recipient": "dev@example.com"
    },
    "message": "Test email sent successfully",
    "status": 200
  }
}
```

::: tip
Los envíos de prueba se despachan vía **AWS Lambda** y usan la misma canalización de entrega que las campañas en vivo para garantizar una vista previa fiel.
:::

## Library Item Object

| Field       | Type           | Description                                      |
| ----------- | -------------- | ------------------------------------------------ |
| id          | string         | ID único de plantilla                            |
| name        | string         | Nombre para mostrar                              |
| type        | string         | EMAIL \| SMS \| PUSH                             |
| htmlContent | string \| null | String HTML completo (solo email)                |
| jsonContent | object \| null | Datos JSON del editor de diseño                  |
| smsContent  | string \| null | Texto del cuerpo SMS                             |
| pushPayload | object \| null | Payload de notificación push                     |
| thumbnail   | string \| null | URL de imagen de vista previa                    |
| tags        | string[]       | Etiquetas                                        |
| workspaceId | string         | ID del workspace propietario                     |
| createdAt   | string         | Marca de tiempo ISO 8601 de creación             |
| updatedAt   | string         | Marca de tiempo ISO 8601 de última actualización |
