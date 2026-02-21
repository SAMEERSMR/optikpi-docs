# Data Platform

La API Data Platform proporciona acceso a definiciones de esquema y metadatos de atributos de cliente usados para construir filtros de audiencia y condiciones de workflow.

**Base path:** `/{locale}/api/data-platform`

## Get Schema / Attributes

Obtiene el esquema de datos disponible o las definiciones de atributos de la plataforma de datos conectada al workspace.

**`POST /{locale}/api/data-platform`**

### Request Body

| Field     | Type   | Required | Description                                           |
| --------- | ------ | -------- | ----------------------------------------------------- |
| type      | string | ✅       | Tipo de operación: GET_SCHEMA o GET_ATTRIBUTES        |
| tableName | string | ❌       | Nombre de tabla concreto (para GET_SCHEMA)            |
| category  | string | ❌       | Filtro de categoría de atributo (para GET_ATTRIBUTES) |

### Get Schema

Devuelve los esquemas de tablas BigQuery disponibles para los datos del workspace.

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

Devuelve los atributos de cliente disponibles que pueden usarse como condiciones de filtro en el constructor de audiencias.

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

| Category      | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| profile       | Campos principales del perfil de cliente (nombre, email, país, etc.)   |
| behavior      | Datos transaccionales y de comportamiento (pedidos, compras, eventos)  |
| subscriptions | Estado de opt-in/opt-out por canales                                   |
| custom        | Atributos personalizados definidos en el workspace                     |
| computed      | Campos calculados por el sistema (LTV, puntuación de engagement, etc.) |

## BigQuery Field Types

| BigQuery Type | Description                            |
| ------------- | -------------------------------------- |
| STRING        | Valores de texto                       |
| INTEGER       | Números enteros                        |
| FLOAT         | Números decimales                      |
| BOOLEAN       | true / false                           |
| DATE          | Valores de fecha YYYY-MM-DD            |
| TIMESTAMP     | Fecha y hora completa con zona horaria |
| JSON          | Objetos JSON anidados                  |
| ARRAY         | Valores repetidos                      |
