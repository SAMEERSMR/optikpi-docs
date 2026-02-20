# Customer 360

The Customer 360 API provides a unified view of individual customer profiles — combining attributes, behavioral events, and engagement history from across all channels.

**Base path:** `/{locale}/api/customer360`

::: tip Feature Flag
Customer 360 is a premium add-on module. Access is gated by the `isCustomer360` flag on the workspace and user session.
:::

## Get Customer 360 Overview

Retrieve aggregated customer data and segment summaries.

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

Individual customer profiles are resolved from the **ElasticSearch** customer index. The following fields represent a standard customer profile:

| Field              | Type             | Description                               |
| ------------------ | ---------------- | ----------------------------------------- |
| `id`               | `string`         | Unique customer ID                        |
| `email`            | `string \| null` | Email address                             |
| `phone`            | `string \| null` | Phone number (E.164 format)               |
| `firstName`        | `string \| null` | First name                                |
| `lastName`         | `string \| null` | Last name                                 |
| `country`          | `string \| null` | ISO 3166-1 alpha-2 country code           |
| `city`             | `string \| null` | City                                      |
| `language`         | `string \| null` | Preferred language code                   |
| `timezone`         | `string \| null` | Timezone                                  |
| `tags`             | `string[]`       | Associated tags                           |
| `attributes`       | `object`         | Custom key-value attributes               |
| `isSubscribed`     | `boolean`        | Email subscription status                 |
| `isSmsSubscribed`  | `boolean`        | SMS subscription status                   |
| `isPushSubscribed` | `boolean`        | Push notification subscription status     |
| `lifetimeValue`    | `number \| null` | Total revenue attributed to this customer |
| `lastActiveAt`     | `string \| null` | ISO 8601 timestamp of last engagement     |
| `createdAt`        | `string`         | ISO 8601 creation timestamp               |

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

Events track all interactions a customer has with your brand:

| Field        | Type             | Description                                                  |
| ------------ | ---------------- | ------------------------------------------------------------ |
| `id`         | `string`         | Unique event ID                                              |
| `customerId` | `string`         | Customer ID                                                  |
| `type`       | `string`         | Event type (e.g. `email_opened`, `link_clicked`, `purchase`) |
| `channel`    | `string \| null` | Channel context: `EMAIL`, `SMS`, `PUSH`, `WEB`               |
| `campaignId` | `string \| null` | Associated campaign ID                                       |
| `workflowId` | `string \| null` | Associated workflow ID                                       |
| `metadata`   | `object`         | Event-specific data (e.g. URL clicked, product ID)           |
| `occurredAt` | `string`         | ISO 8601 timestamp                                           |

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
