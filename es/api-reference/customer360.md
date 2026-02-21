# Customer 360

La API Customer 360 proporciona una vista unificada de los perfiles de cliente individuales — combinando atributos, eventos de comportamiento e historial de engagement de todos los canales.

**Base path:** `/{locale}/api/customer360`

::: tip Feature Flag
Customer 360 es un módulo complementario premium. El acceso está controlado por el flag `isCustomer360` en el workspace y la sesión del usuario.
:::

## Get Customer 360 Overview

Obtiene datos de cliente agregados y resúmenes de segmentos.

**`GET /{locale}/api/customer360`**

### Response

```json
{
  "result": {
    "data": {
      "totalContacts": 142500,
      "activeContacts": 98200,
      "newContactsThisMonth": 3400,
      "topSegments": [
        {
          "id": "aud_abc123",
          "name": "High Value Customers",
          "contactCount": 15420
        },
        {
          "id": "aud_def456",
          "name": "Churned — Last 90 Days",
          "contactCount": 8700
        }
      ],
      "channelReach": {
        "email": 89400,
        "sms": 62100,
        "push": 34800
      }
    },
    "message": "Customer 360 overview fetched",
    "status": 200
  }
}
```

## Customer Profile Object

Los perfiles de cliente individuales se resuelven desde el índice de clientes de **ElasticSearch**. Los siguientes campos representan un perfil de cliente estándar:

| Field            | Type           | Description                                    |
| ---------------- | -------------- | ---------------------------------------------- |
| id               | string         | ID único de cliente                            |
| email            | string \| null | Dirección de email                             |
| phone            | string \| null | Número de teléfono (formato E.164)             |
| firstName        | string \| null | Nombre                                         |
| lastName         | string \| null | Apellido                                       |
| country          | string \| null | Código de país ISO 3166-1 alpha-2              |
| city             | string \| null | Ciudad                                         |
| language         | string \| null | Código de idioma preferido                     |
| timezone         | string \| null | Zona horaria                                   |
| tags             | string[]       | Tags asociados                                 |
| attributes       | object         | Atributos personalizados clave-valor           |
| isSubscribed     | boolean        | Estado de suscripción a email                  |
| isSmsSubscribed  | boolean        | Estado de suscripción a SMS                    |
| isPushSubscribed | boolean        | Estado de suscripción a notificaciones push    |
| lifetimeValue    | number \| null | Ingresos totales atribuidos a este cliente     |
| lastActiveAt     | string \| null | Marca de tiempo ISO 8601 del último engagement |
| createdAt        | string         | Marca de tiempo ISO 8601 de creación           |

### Example Customer Profile

```json
{
  "id": "cust_abc123",
  "email": "jane.doe@example.com",
  "phone": "+971501234567",
  "firstName": "Jane",
  "lastName": "Doe",
  "country": "AE",
  "city": "Dubai",
  "language": "en",
  "timezone": "Asia/Dubai",
  "tags": ["vip", "high-ltv"],
  "attributes": {
    "loyalty_tier": "gold",
    "total_orders": 24,
    "last_purchase_date": "2025-01-15"
  },
  "isSubscribed": true,
  "isSmsSubscribed": true,
  "isPushSubscribed": false,
  "lifetimeValue": 4820.5,
  "lastActiveAt": "2025-02-18T14:30:00.000Z",
  "createdAt": "2022-09-01T10:00:00.000Z"
}
```

## Customer Event Object

Los eventos registran todas las interacciones de un cliente con tu marca:

| Field      | Type           | Description                                                   |
| ---------- | -------------- | ------------------------------------------------------------- |
| id         | string         | ID único del evento                                           |
| customerId | string         | Customer ID                                                   |
| type       | string         | Tipo de evento (p. ej. email_opened, link_clicked, purchase)  |
| channel    | string \| null | Contexto de canal: EMAIL, SMS, PUSH, WEB                      |
| campaignId | string \| null | ID de campaña asociada                                        |
| workflowId | string \| null | ID de workflow asociado                                       |
| metadata   | object         | Datos específicos del evento (p. ej. URL clicada, product ID) |
| occurredAt | string         | Marca de tiempo ISO 8601                                      |

### Example Event

```json
{
  "id": "evt_xyz789",
  "customerId": "cust_abc123",
  "type": "link_clicked",
  "channel": "EMAIL",
  "campaignId": "cmp_abc123",
  "workflowId": null,
  "metadata": {
    "url": "https://example.com/sale",
    "utm_campaign": "summer-sale-2025"
  },
  "occurredAt": "2025-06-01T10:45:00.000Z"
}
```
