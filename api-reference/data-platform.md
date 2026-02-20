# Data Platform

The Data Platform API provides access to schema definitions and customer attribute metadata used to build audience filters and workflow conditions.

**Base path:** `/{locale}/api/data-platform`

## Get Schema / Attributes

Retrieve available data schema or attribute definitions for the workspace's connected data platform.

**`POST /{locale}/api/data-platform`**

### Request Body

| Field       | Type     | Required | Description                                      |
| ----------- | -------- | -------- | ------------------------------------------------ |
| `type`      | `string` | ✅       | Operation type: `GET_SCHEMA` or `GET_ATTRIBUTES` |
| `tableName` | `string` | ❌       | Specific table name (for `GET_SCHEMA`)           |
| `category`  | `string` | ❌       | Attribute category filter (for `GET_ATTRIBUTES`) |

### Get Schema

Returns the available BigQuery table schemas for the workspace's data.

```json
{
  "type": "GET_SCHEMA"
}
```

**Response**

```json
{
  "result": {
    "data": {
      "tables": [
        {
          "name": "customers",
          "description": "Core customer profile table",
          "fields": [
            {
              "name": "customer_id",
              "type": "STRING",
              "mode": "REQUIRED",
              "description": "Unique customer identifier"
            },
            {
              "name": "email",
              "type": "STRING",
              "mode": "NULLABLE",
              "description": "Customer email address"
            },
            {
              "name": "country",
              "type": "STRING",
              "mode": "NULLABLE",
              "description": "ISO 3166-1 alpha-2 country code"
            },
            {
              "name": "total_orders",
              "type": "INTEGER",
              "mode": "NULLABLE",
              "description": "Lifetime order count"
            },
            {
              "name": "lifetime_value",
              "type": "FLOAT",
              "mode": "NULLABLE",
              "description": "Total revenue attributed"
            },
            {
              "name": "last_purchase_date",
              "type": "DATE",
              "mode": "NULLABLE",
              "description": "Date of most recent purchase"
            },
            {
              "name": "created_at",
              "type": "TIMESTAMP",
              "mode": "REQUIRED",
              "description": "Account creation timestamp"
            }
          ]
        },
        {
          "name": "events",
          "description": "Customer behavioral events",
          "fields": [
            {
              "name": "customer_id",
              "type": "STRING",
              "mode": "REQUIRED"
            },
            {
              "name": "event_type",
              "type": "STRING",
              "mode": "REQUIRED"
            },
            {
              "name": "event_timestamp",
              "type": "TIMESTAMP",
              "mode": "REQUIRED"
            },
            {
              "name": "properties",
              "type": "JSON",
              "mode": "NULLABLE"
            }
          ]
        }
      ]
    },
    "message": "Schema fetched successfully",
    "status": 200
  }
}
```

### Get Attributes

Returns available customer attributes that can be used as filter conditions in the audience builder.

```json
{
  "type": "GET_ATTRIBUTES",
  "category": "profile"
}
```

**Response**

```json
{
  "result": {
    "data": {
      "attributes": [
        {
          "key": "country",
          "label": "Country",
          "category": "profile",
          "dataType": "string",
          "operators": ["equals", "not_equals", "in", "not_in"],
          "values": ["AE", "SA", "EG", "KW", "QA", "BH", "OM"]
        },
        {
          "key": "total_orders",
          "label": "Total Orders",
          "category": "behavior",
          "dataType": "number",
          "operators": ["equals", "greater_than", "less_than", "between"]
        },
        {
          "key": "last_purchase_date",
          "label": "Last Purchase Date",
          "category": "behavior",
          "dataType": "date",
          "operators": ["before", "after", "between", "in_last_n_days"]
        },
        {
          "key": "is_subscribed",
          "label": "Email Subscribed",
          "category": "subscriptions",
          "dataType": "boolean",
          "operators": ["equals"]
        }
      ]
    },
    "message": "Attributes fetched successfully",
    "status": 200
  }
}
```

## Attribute Categories

| Category        | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| `profile`       | Core customer profile fields (name, email, country, etc.)     |
| `behavior`      | Transactional and behavioral data (orders, purchases, events) |
| `subscriptions` | Opt-in/opt-out status across channels                         |
| `custom`        | Workspace-defined custom attributes                           |
| `computed`      | System-computed fields (LTV, engagement score, etc.)          |

## BigQuery Field Types

| BigQuery Type | Description                 |
| ------------- | --------------------------- |
| `STRING`      | Text values                 |
| `INTEGER`     | Whole numbers               |
| `FLOAT`       | Decimal numbers             |
| `BOOLEAN`     | `true` / `false`            |
| `DATE`        | Date values `YYYY-MM-DD`    |
| `TIMESTAMP`   | Full datetime with timezone |
| `JSON`        | Nested JSON objects         |
| `ARRAY`       | Repeated values             |
