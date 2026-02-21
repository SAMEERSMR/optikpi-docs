# Dashboard

La API Dashboard proporciona métricas de engagement a nivel de workspace para el panel de análisis principal, soportada por el **servicio de análisis ElasticSearch**.

**Base path:** `/{locale}/api/dashboard`

## Get Engagement Metrics

Obtiene datos de engagement agregados para la vista general del dashboard.

**`GET /{locale}/api/dashboard/engagement`**

### Query Parameters

| Parameter | Type   | Required | Description                                                |
| --------- | ------ | -------- | ---------------------------------------------------------- |
| dateRange | string | ❌       | Rango predefinido: 7d, 30d, 90d, custom (por defecto: 30d) |
| startDate | string | ❌       | Fecha inicio YYYY-MM-DD (obligatorio para custom)          |
| endDate   | string | ❌       | Fecha fin YYYY-MM-DD (obligatorio para custom)             |
| channel   | string | ❌       | Filtrar por canal: EMAIL, SMS, PUSH (por defecto: all)     |

### Response

```json
{
  "result": {
    "data": {
      "summary": {
        "totalSent": 124800,
        "totalDelivered": 121400,
        "totalOpened": 34600,
        "totalClicked": 8900,
        "deliveryRate": 97.3,
        "openRate": 28.5,
        "clickRate": 7.3
      },
      "channels": {
        "email": {
          "sent": 84200,
          "delivered": 82100,
          "opened": 23400,
          "clicked": 6100,
          "openRate": 28.5,
          "clickRate": 7.4
        },
        "sms": {
          "sent": 22000,
          "delivered": 21600,
          "clicked": 1800,
          "clickRate": 8.3
        },
        "push": {
          "sent": 18600,
          "delivered": 17700,
          "clicked": 1000,
          "clickRate": 5.6
        }
      },
      "timeSeries": [
        {
          "date": "2025-01-20",
          "sent": 4200,
          "delivered": 4100,
          "opened": 1160,
          "clicked": 298
        },
        {
          "date": "2025-01-21",
          "sent": 3800,
          "delivered": 3710,
          "opened": 1050,
          "clicked": 272
        }
      ],
      "topCampaigns": [
        {
          "id": "cmp_abc123",
          "name": "Summer Sale Announcement",
          "channel": "EMAIL",
          "sent": 15400,
          "openRate": 34.2,
          "clickRate": 9.1
        }
      ]
    },
    "message": "Dashboard engagement data fetched successfully",
    "status": 200
  }
}
```

## Dashboard Data Fields

### Summary Metrics

| Field          | Type   | Description                                     |
| -------------- | ------ | ----------------------------------------------- |
| totalSent      | number | Total de mensajes enviados en todos los canales |
| totalDelivered | number | Total entregados correctamente                  |
| totalOpened    | number | Total de aperturas únicas (solo email)          |
| totalClicked   | number | Total de clics únicos en enlaces                |
| deliveryRate   | number | (delivered / sent) \* 100                       |
| openRate       | number | (opened / delivered) \* 100                     |
| clickRate      | number | (clicked / delivered) \* 100                    |

### Time Series Entry

| Field     | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| date      | string | Fecha en formato YYYY-MM-DD       |
| sent      | number | Mensajes enviados en esta fecha   |
| delivered | number | Mensajes entregados en esta fecha |
| opened    | number | Aperturas en esta fecha           |
| clicked   | number | Clics en esta fecha               |

### Top Campaigns

Devuelve hasta 5 campañas con mejor rendimiento ordenadas por tasa de clics.

| Field     | Type   | Description                 |
| --------- | ------ | --------------------------- |
| id        | string | Campaign ID                 |
| name      | string | Nombre de la campaña        |
| channel   | string | Canal de entrega            |
| sent      | number | Número de mensajes enviados |
| openRate  | number | Porcentaje de apertura      |
| clickRate | number | Porcentaje de clics         |
