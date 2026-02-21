# Workspace

Los endpoints de Workspace gestionan la configuración del workspace, branding, detalles de suscripción y configuración de funcionalidades.

**Base path:** `/{locale}/api/workspace`

## Get Workspace

Obtiene la configuración del workspace actual. Usa **workSpaceId** de las cabeceras de la petición (establecido por el middleware). La respuesta es **plana**: `{ data: workspace }` (sin wrapper `result`).

**`GET /{locale}/api/workspace`**

### Response (200)

```json
{
  "data": {
    "id": "ws_xyz789",
    "name": "Acme Corp Marketing",
    "domain": "acme.com",
    "timezone": "Asia/Dubai",
    "registerationNumber": "REG123",
    "logo": "https://s3.amazonaws.com/bucket/logos/ws_xyz789.png",
    "enableAudienceAllocationInCampaign": true
  }
}
```

**Errors:** 400 `{ "message": "Invalid request. Id not provided." }`; 404 `{ "message": "Workspace not found" }`; 500 en error de servidor.

## POST — Type-Based Operations

**`POST /{locale}/api/workspace`**

Todas las peticiones requieren un campo `type`. Se admiten los siguientes tipos.

### Type: GET-SELECTED-BRANDS

Devuelve los registros de workspace para los IDs de workspace indicados.

**Request Body**

| Field      | Type     | Required | Description                  |
| ---------- | -------- | -------- | ---------------------------- |
| type       | string   | ✅       | Debe ser GET-SELECTED-BRANDS |
| workspaces | string[] | ✅       | Array de IDs de workspace    |

**Response (200)**

```json
{
  "brands": [
    {
      "id": "ws_01",
      "name": "Acme Main",
      "domain": "acme.com",
      "timezone": "Asia/Dubai",
      "deletedAt": null
    }
  ]
}
```

**Errors:** 500 `{ "error": "Error getting the brands data" }`.

### Type: GET-CUSTOMER360-SUBSCRIPTION-DETAILS

Devuelve los detalles de suscripción de Customer 360 para el workspace actual.

**Request Body**

```json
{
  "type": "GET-CUSTOMER360-SUBSCRIPTION-DETAILS"
}
```

**Response (200)**

```json
{
  "subscriptionDetails": [{ "key": "customer_360", "enabled": true }]
}
```

**Errors:** 500 `{ "error": "Error getting the subscription details data" }`.

## Update Workspace

**`PUT /{locale}/api/workspace`**

Actualiza la configuración del workspace. El body puede incluir campos como `timezone`, `registerationNumber` y otros atributos del workspace. La respuesta es `{ data: updatedWorkspace }`.

**Errors:** 400 cuando falta workSpaceId; 500 en error de servidor.

---

## Workspace Object (GET response)

| Field                              | Type    | Description                                              |
| ---------------------------------- | ------- | -------------------------------------------------------- |
| id                                 | string  | Workspace ID                                             |
| name                               | string  | Nombre del workspace                                     |
| domain                             | string  | Dominio                                                  |
| timezone                           | string  | Zona horaria del workspace                               |
| registerationNumber                | string  | Número de registro                                       |
| logo                               | string  | URL del logo                                             |
| enableAudienceAllocationInCampaign | boolean | Si está habilitada la asignación de audiencia en campaña |
