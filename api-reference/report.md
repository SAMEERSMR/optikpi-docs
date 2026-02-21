# Report

Report endpoints manage saved analytics reports. Reports aggregate campaign and workflow performance metrics and are powered by the **ElasticSearch analytics service**.

**Base path:** `/{locale}/api/report`

## List Reports

Retrieve a paginated list of saved reports for the current workspace.

**`GET /{locale}/api/report`**

### Query Parameters

| Parameter | Type   | Required | Description                                         |
| --------- | ------ | -------- | --------------------------------------------------- |
| page      | number | ❌       | Page number (default: 1)                            |
| limit     | number | ❌       | Records per page (default: 10)                      |
| search    | string | ❌       | Search by report name                               |
| type      | string | ❌       | Filter by report type: CAMPAIGN, WORKFLOW, AUDIENCE |

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

Create and save a new analytics report.

**`POST /{locale}/api/report`**

### Request Body

| Field           | Type     | Required | Description                      |
| --------------- | -------- | -------- | -------------------------------- |
| name            | string   | ✅       | Report display name              |
| type            | string   | ✅       | CAMPAIGN, WORKFLOW, or AUDIENCE  |
| channel         | string   | ❌       | Channel filter: EMAIL, SMS, PUSH |
| campaignIds     | string[] | ❌       | Specific campaign IDs to include |
| workflowIds     | string[] | ❌       | Specific workflow IDs to include |
| dateRange       | object   | ✅       | Date range for the report        |
| dateRange.start | string   | ✅       | Start date YYYY-MM-DD            |
| dateRange.end   | string   | ✅       | End date YYYY-MM-DD              |
| groupBy         | string   | ❌       | Grouping: day, week, month       |

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

Delete one or more saved reports.

**`DELETE /{locale}/api/report`**

### Request Body

| Field | Type     | Required | Description                   |
| ----- | -------- | -------- | ----------------------------- |
| ids   | string[] | ✅       | Array of report IDs to delete |

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
| totalSent       | number | Total messages dispatched                      |
| delivered       | number | Successfully delivered to recipient            |
| opened          | number | Unique opens (email only)                      |
| clicked         | number | Unique clicks                                  |
| bounced         | number | Hard and soft bounces                          |
| unsubscribed    | number | Unsubscribe events                             |
| openRate        | number | (opened / delivered) \* 100 — percentage       |
| clickRate       | number | (clicked / delivered) \* 100 — percentage      |
| bounceRate      | number | (bounced / sent) \* 100 — percentage           |
| unsubscribeRate | number | (unsubscribed / delivered) \* 100 — percentage |
