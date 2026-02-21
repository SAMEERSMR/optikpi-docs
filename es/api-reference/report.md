# Report

Los endpoints de Report gestionan informes de análisis guardados. Los informes agregan métricas de rendimiento de campañas y workflows y están soportados por el **servicio de análisis ElasticSearch**.

**Base path:** `/{locale}/api/report`

## List Reports

Obtiene una lista paginada de informes guardados del workspace actual.

**`GET /{locale}/api/report`**

### Query Parameters

| Parameter | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| page      | number | ❌       | Número de página (por defecto: 1)                         |
| limit     | number | ❌       | Registros por página (por defecto: 10)                    |
| search    | string | ❌       | Buscar por nombre de informe                              |
| type      | string | ❌       | Filtrar por tipo de informe: CAMPAIGN, WORKFLOW, AUDIENCE |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "rpt_abc123",
        "name": "Q1 2025 Email Campaign Performance",
        "type": "CAMPAIGN",
        "channel": "EMAIL",
        "dateRange": {
          "start": "2025-01-01",
          "end": "2025-03-31"
        },
        "metrics": {
          "totalSent": 48200,
          "delivered": 47100,
          "openRate": 28.4,
          "clickRate": 6.2,
          "unsubscribeRate": 0.4,
          "bounceRate": 2.3
        },
        "createdAt": "2025-04-01T10:00:00.000Z"
      }
    ],
    "message": "Reports fetched successfully",
    "status": 200,
    "totalCount": 8
  }
}
```

## Create Report

Crea y guarda un nuevo informe de análisis.

**`POST /{locale}/api/report`**

### Request Body

| Field           | Type     | Required | Description                         |
| --------------- | -------- | -------- | ----------------------------------- |
| name            | string   | ✅       | Nombre para mostrar del informe     |
| type            | string   | ✅       | CAMPAIGN, WORKFLOW o AUDIENCE       |
| channel         | string   | ❌       | Filtro de canal: EMAIL, SMS, PUSH   |
| campaignIds     | string[] | ❌       | IDs de campaña concretos a incluir  |
| workflowIds     | string[] | ❌       | IDs de workflow concretos a incluir |
| dateRange       | object   | ✅       | Rango de fechas del informe         |
| dateRange.start | string   | ✅       | Fecha inicio YYYY-MM-DD             |
| dateRange.end   | string   | ✅       | Fecha fin YYYY-MM-DD                |
| groupBy         | string   | ❌       | Agrupación: day, week, month        |

### Request

```json
{
  "name": "Q1 2025 Email Campaign Performance",
  "type": "CAMPAIGN",
  "channel": "EMAIL",
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-03-31"
  },
  "groupBy": "month"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "rpt_abc123",
      "name": "Q1 2025 Email Campaign Performance",
      "type": "CAMPAIGN",
      "metrics": {
        "totalSent": 48200,
        "delivered": 47100,
        "openRate": 28.4,
        "clickRate": 6.2,
        "unsubscribeRate": 0.4,
        "bounceRate": 2.3
      },
      "timeSeries": [
        {
          "period": "2025-01",
          "sent": 16400,
          "opened": 4700,
          "clicked": 1020
        },
        {
          "period": "2025-02",
          "sent": 15300,
          "opened": 4250,
          "clicked": 940
        },
        {
          "period": "2025-03",
          "sent": 16500,
          "opened": 4810,
          "clicked": 1010
        }
      ],
      "createdAt": "2025-04-01T10:00:00.000Z"
    },
    "message": "Report created successfully",
    "status": 201
  }
}
```

## Delete Reports

Elimina uno o más informes guardados.

**`DELETE /{locale}/api/report`**

### Request Body

| Field | Type     | Required | Description                        |
| ----- | -------- | -------- | ---------------------------------- |
| ids   | string[] | ✅       | Array de IDs de informe a eliminar |

### Response

```json
{
  "result": {
    "data": { "deletedCount": 2 },
    "message": "Reports deleted successfully",
    "status": 200
  }
}
```

## Report Metrics Reference

| Metric          | Type   | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| totalSent       | number | Total de mensajes enviados                     |
| delivered       | number | Entregados correctamente al destinatario       |
| opened          | number | Aperturas únicas (solo email)                  |
| clicked         | number | Clics únicos                                   |
| bounced         | number | Rebotes duros y blandos                        |
| unsubscribed    | number | Eventos de baja                                |
| openRate        | number | (opened / delivered) \* 100 — porcentaje       |
| clickRate       | number | (clicked / delivered) \* 100 — porcentaje      |
| bounceRate      | number | (bounced / sent) \* 100 — porcentaje           |
| unsubscribeRate | number | (unsubscribed / delivered) \* 100 — porcentaje |
