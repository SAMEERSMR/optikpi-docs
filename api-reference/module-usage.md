# Module Usage

The Module Usage API returns the current consumption and limits for each billable module in the workspace. It is used to enforce plan limits and display usage meters in the UI.

**Base path:** `/{locale}/api/module-usage`

## Get Module Usage

Retrieve usage statistics and plan limits for all modules in a workspace.

**`POST /{locale}/api/module-usage`**

### Request Body

| Field       | Type   | Required | Description                     |
| ----------- | ------ | -------- | ------------------------------- |
| workspaceId | string | ✅       | Workspace ID to query usage for |

### Request

```json
{
  "workspaceId": "ws_xyz789"
}
```

### Response

```json
{
  "result": {
    "data": {
      "workspaceId": "ws_xyz789",
      "billingPeriod": {
        "start": "2025-02-01",
        "end": "2025-02-28"
      },
      "modules": {
        "email": {
          "used": 84200,
          "limit": 500000,
          "unit": "emails",
          "percentUsed": 16.84
        },
        "sms": {
          "used": 3100,
          "limit": 50000,
          "unit": "messages",
          "percentUsed": 6.2
        },
        "push": {
          "used": 12400,
          "limit": 250000,
          "unit": "notifications",
          "percentUsed": 4.96
        },
        "audiences": {
          "used": 18,
          "limit": 100,
          "unit": "segments",
          "percentUsed": 18
        },
        "workflows": {
          "used": 7,
          "limit": 50,
          "unit": "workflows",
          "percentUsed": 14
        },
        "campaigns": {
          "used": 23,
          "limit": 200,
          "unit": "campaigns",
          "percentUsed": 11.5
        },
        "contacts": {
          "used": 142500,
          "limit": 500000,
          "unit": "contacts",
          "percentUsed": 28.5
        }
      }
    },
    "message": "Module usage fetched successfully",
    "status": 200
  }
}
```

## Module Usage Object

| Field       | Type   | Description                                   |
| ----------- | ------ | --------------------------------------------- |
| used        | number | Current usage in the billing period           |
| limit       | number | Plan limit for this module (-1 = unlimited)   |
| unit        | string | Unit label (emails, messages, segments, etc.) |
| percentUsed | number | (used / limit) \* 100 rounded to 2 decimals   |

::: warning
When `percentUsed` reaches `80%` or higher, the UI displays a usage warning. At `100%`, the module is locked until the billing period resets or the plan is upgraded.
:::

## Modules

| Module Key | Description                                   |
| ---------- | --------------------------------------------- |
| email      | Monthly email sends across all campaigns      |
| sms        | Monthly SMS messages sent                     |
| push       | Monthly web push notifications delivered      |
| audiences  | Total active audience segments                |
| workflows  | Total active automation workflows             |
| campaigns  | Total campaigns created in the billing period |
| contacts   | Total unique contacts in the workspace        |
