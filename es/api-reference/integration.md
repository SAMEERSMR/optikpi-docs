# Integration

Los endpoints de Integration gestionan las conexiones con servicios de terceros: proveedores de email (SendGrid, Elastic Email), pasarelas SMS y configuraciones de web push usadas para la entrega de campañas.

**Base path:** `/{locale}/api/integration`

## List Integrations

Obtiene todas las integraciones configuradas para el workspace actual.

**`GET /{locale}/api/integration`**

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "int_sendgrid_01",
        "name": "SendGrid Production",
        "type": "SENDGRID",
        "channel": "EMAIL",
        "isActive": true,
        "senderEmail": "noreply@example.com",
        "senderName": "Example Brand",
        "createdAt": "2024-05-01T10:00:00.000Z"
      },
      {
        "id": "int_sms_01",
        "name": "Twilio SMS",
        "type": "TWILIO",
        "channel": "SMS",
        "isActive": true,
        "senderPhone": "+15551234567",
        "createdAt": "2024-06-15T08:00:00.000Z"
      }
    ],
    "message": "Integrations fetched successfully",
    "status": 200,
    "totalCount": 2
  }
}
```

## Create Integration

Añade una nueva integración con un servicio de terceros.

**`POST /{locale}/api/integration`**

### Request Body

| Field           | Type    | Required | Description                                             |
| --------------- | ------- | -------- | ------------------------------------------------------- |
| name            | string  | ✅       | Nombre para mostrar de la integración                   |
| type            | string  | ✅       | Tipo de proveedor (ver Integration Types más abajo)     |
| channel         | string  | ✅       | EMAIL, SMS o PUSH                                       |
| apiKey          | string  | ❌       | API key del proveedor                                   |
| apiSecret       | string  | ❌       | API secret del proveedor                                |
| senderEmail     | string  | ❌       | Dirección de email remitente (integraciones EMAIL)      |
| senderName      | string  | ❌       | Nombre para mostrar del remitente (integraciones EMAIL) |
| senderPhone     | string  | ❌       | Número de teléfono remitente (integraciones SMS)        |
| vapidPublicKey  | string  | ❌       | Clave pública VAPID (integraciones PUSH)                |
| vapidPrivateKey | string  | ❌       | Clave privada VAPID (integraciones PUSH)                |
| isActive        | boolean | ❌       | Activar/desactivar al crear (por defecto: true)         |

### SendGrid Example

```json
{
  "name": "SendGrid Production",
  "type": "SENDGRID",
  "channel": "EMAIL",
  "apiKey": "SG.abc123...",
  "senderEmail": "noreply@example.com",
  "senderName": "Example Brand"
}
```

:::tabs
== Elastic Email

```json
{
  "name": "Elastic Email",
  "type": "ELASTIC_EMAIL",
  "channel": "EMAIL",
  "apiKey": "EE-abc123...",
  "senderEmail": "campaigns@example.com",
  "senderName": "Example Campaigns"
}
```

== Web Push VAPID

```json
{
  "name": "Web Push VAPID Keys",
  "type": "WEB_PUSH",
  "channel": "PUSH",
  "vapidPublicKey": "BHn...",
  "vapidPrivateKey": "abc123..."
}
```

== Twilio SMS

```json
{
  "name": "Twilio SMS",
  "type": "TWILIO",
  "channel": "SMS",
  "apiKey": "ACabc123...",
  "apiSecret": "your_twilio_auth_token",
  "senderPhone": "+1234567890"
}
```

:::

### Response

```json
{
  "result": {
    "data": {
      "id": "int_sendgrid_01",
      "name": "SendGrid Production",
      "type": "SENDGRID",
      "channel": "EMAIL",
      "isActive": true,
      "createdAt": "2025-02-20T09:00:00.000Z"
    },
    "message": "Integration created successfully",
    "status": 201
  }
}
```

::: warning
Los campos sensibles (`apiKey`, `apiSecret`, `vapidPrivateKey`) **nunca se devuelven** en las respuestas GET — se almacenan cifrados y son solo de escritura.
:::

## Get Integration

Obtiene los detalles de una integración (excluyendo credenciales sensibles).

**`GET /{locale}/api/integration/{integrationId}`**

### Path Parameters

| Parameter     | Type   | Description    |
| ------------- | ------ | -------------- |
| integrationId | string | Integration ID |

### Response

```json
{
  "result": {
    "data": {
      "id": "int_sendgrid_01",
      "name": "SendGrid Production",
      "type": "SENDGRID",
      "channel": "EMAIL",
      "isActive": true,
      "senderEmail": "noreply@example.com",
      "senderName": "Example Brand",
      "createdAt": "2024-05-01T10:00:00.000Z",
      "updatedAt": "2024-05-01T10:00:00.000Z"
    },
    "message": "Integration fetched successfully",
    "status": 200
  }
}
```

## Delete Integration

**`DELETE /{locale}/api/integration/{integrationId}`**

### Path Parameters

| Parameter     | Type   | Description               |
| ------------- | ------ | ------------------------- |
| integrationId | string | Integration ID a eliminar |

### Response

```json
{
  "result": {
    "data": null,
    "message": "Integration deleted successfully",
    "status": 200
  }
}
```

## Integration Types

| Type          | Channel | Provider                          |
| ------------- | ------- | --------------------------------- |
| SENDGRID      | EMAIL   | SendGrid                          |
| ELASTIC_EMAIL | EMAIL   | Elastic Email                     |
| TWILIO        | SMS     | Twilio                            |
| NEXMO         | SMS     | Vonage (Nexmo)                    |
| WEB_PUSH      | PUSH    | Web Push API (VAPID)              |
| FIREBASE_FCM  | PUSH    | Firebase Cloud Messaging (legacy) |

## Integration Object

| Field          | Type           | Description                                      |
| -------------- | -------------- | ------------------------------------------------ |
| id             | string         | ID único de integración                          |
| name           | string         | Nombre para mostrar                              |
| type           | string         | Tipo de proveedor (enum)                         |
| channel        | string         | EMAIL \| SMS \| PUSH                             |
| isActive       | boolean        | Si la integración está activa                    |
| senderEmail    | string \| null | Dirección de email remitente                     |
| senderName     | string \| null | Nombre para mostrar del remitente                |
| senderPhone    | string \| null | Número de teléfono remitente                     |
| vapidPublicKey | string \| null | Clave pública VAPID (PUSH)                       |
| workspaceId    | string         | ID del workspace propietario                     |
| createdAt      | string         | Marca de tiempo ISO 8601 de creación             |
| updatedAt      | string         | Marca de tiempo ISO 8601 de última actualización |
