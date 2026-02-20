# Dashboard

The Dashboard API provides workspace-level engagement metrics for the main analytics dashboard, powered by the **ElasticSearch analytics service**.

**Base path:** `/{locale}/api/dashboard`

## Get Engagement Metrics

Retrieve aggregated engagement data for the dashboard overview.

**`GET /{locale}/api/dashboard/engagement`**

### Query Parameters

| Parameter   | Type     | Required | Description                                                 |
| ----------- | -------- | -------- | ----------------------------------------------------------- |
| `dateRange` | `string` | ❌       | Preset range: `7d`, `30d`, `90d`, `custom` (default: `30d`) |
| `startDate` | `string` | ❌       | Start date `YYYY-MM-DD` (required for `custom`)             |
| `endDate`   | `string` | ❌       | End date `YYYY-MM-DD` (required for `custom`)               |
| `channel`   | `string` | ❌       | Filter by channel: `EMAIL`, `SMS`, `PUSH` (default: all)    |

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

| Field            | Type     | Description                             |
| ---------------- | -------- | --------------------------------------- |
| `totalSent`      | `number` | Total messages sent across all channels |
| `totalDelivered` | `number` | Total successfully delivered            |
| `totalOpened`    | `number` | Total unique opens (email only)         |
| `totalClicked`   | `number` | Total unique link clicks                |
| `deliveryRate`   | `number` | `(delivered / sent) * 100`              |
| `openRate`       | `number` | `(opened / delivered) * 100`            |
| `clickRate`      | `number` | `(clicked / delivered) * 100`           |

### Time Series Entry

| Field       | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `date`      | `string` | Date in `YYYY-MM-DD` format     |
| `sent`      | `number` | Messages sent on this date      |
| `delivered` | `number` | Messages delivered on this date |
| `opened`    | `number` | Opens on this date              |
| `clicked`   | `number` | Clicks on this date             |

### Top Campaigns

Returns up to 5 best-performing campaigns sorted by click rate.

| Field       | Type     | Description             |
| ----------- | -------- | ----------------------- |
| `id`        | `string` | Campaign ID             |
| `name`      | `string` | Campaign name           |
| `channel`   | `string` | Delivery channel        |
| `sent`      | `number` | Number of messages sent |
| `openRate`  | `number` | Open rate percentage    |
| `clickRate` | `number` | Click rate percentage   |
