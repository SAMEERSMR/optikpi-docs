# Module Usage

La API Module Usage devuelve el consumo actual y los límites de cada módulo facturable en el workspace. Se usa para aplicar límites del plan y mostrar indicadores de uso en la interfaz.

**Base path:** `/{locale}/api/module-usage`

## Get Module Usage

Obtiene estadísticas de uso y límites del plan para todos los módulos de un workspace.

**`POST /{locale}/api/module-usage`**

### Request Body

| Field       | Type   | Required | Description                     |
| ----------- | ------ | -------- | ------------------------------- |
| workspaceId | string | ✅       | Workspace ID para consultar uso |

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

| Field       | Type   | Description                                           |
| ----------- | ------ | ----------------------------------------------------- |
| used        | number | Uso actual en el periodo de facturación               |
| limit       | number | Límite del plan para este módulo (-1 = ilimitado)     |
| unit        | string | Etiqueta de unidad (emails, messages, segments, etc.) |
| percentUsed | number | (used / limit) \* 100 redondeado a 2 decimales        |

::: warning
Cuando `percentUsed` alcanza el **80%** o más, la interfaz muestra un aviso de uso. Al **100%**, el módulo se bloquea hasta que se reinicie el periodo de facturación o se actualice el plan.
:::

## Modules

| Module Key | Description                                            |
| ---------- | ------------------------------------------------------ |
| email      | Envíos de email mensuales en todas las campañas        |
| sms        | Mensajes SMS enviados al mes                           |
| push       | Notificaciones push web entregadas al mes              |
| audiences  | Total de segmentos de audiencia activos                |
| workflows  | Total de workflows de automatización activos           |
| campaigns  | Total de campañas creadas en el periodo de facturación |
| contacts   | Total de contactos únicos en el workspace              |
