# Integration

Integration endpoints manage third-party service connections — email providers (SendGrid, Elastic Email), SMS gateways, and web push configurations used for campaign delivery.

**Base path:** `/{locale}/api/integration`

## List Integrations

Retrieve all integrations configured for the current workspace.

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

Add a new third-party service integration.

**`POST /{locale}/api/integration`**

### Request Body

| Field           | Type    | Required | Description                                 |
| --------------- | ------- | -------- | ------------------------------------------- |
| name            | string  | ✅       | Integration display name                    |
| type            | string  | ✅       | Provider type (see Integration Types below) |
| channel         | string  | ✅       | EMAIL, SMS, or PUSH                         |
| apiKey          | string  | ❌       | Provider API key                            |
| apiSecret       | string  | ❌       | Provider API secret                         |
| senderEmail     | string  | ❌       | From email address (EMAIL integrations)     |
| senderName      | string  | ❌       | From display name (EMAIL integrations)      |
| senderPhone     | string  | ❌       | From phone number (SMS integrations)        |
| vapidPublicKey  | string  | ❌       | VAPID public key (PUSH integrations)        |
| vapidPrivateKey | string  | ❌       | VAPID private key (PUSH integrations)       |
| isActive        | boolean | ❌       | Enable/disable on creation (default: true)  |

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
Sensitive fields (`apiKey`, `apiSecret`, `vapidPrivateKey`) are **never returned** in GET responses — they are stored encrypted and write-only.
:::

## Get Integration

Retrieve details for a single integration (excluding sensitive credentials).

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

| Parameter     | Type   | Description              |
| ------------- | ------ | ------------------------ |
| integrationId | string | Integration ID to delete |

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

| Field          | Type           | Description                    |
| -------------- | -------------- | ------------------------------ |
| id             | string         | Unique integration ID          |
| name           | string         | Display name                   |
| type           | string         | Provider type enum             |
| channel        | string         | EMAIL \| SMS \| PUSH           |
| isActive       | boolean        | Whether integration is enabled |
| senderEmail    | string \| null | From email address             |
| senderName     | string \| null | From display name              |
| senderPhone    | string \| null | From phone number              |
| vapidPublicKey | string \| null | VAPID public key (PUSH)        |
| workspaceId    | string         | Owning workspace ID            |
| createdAt      | string         | ISO 8601 creation timestamp    |
| updatedAt      | string         | ISO 8601 last update timestamp |
