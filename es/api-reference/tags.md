# Tags

Los tags son etiquetas a nivel de workspace usadas para organizar audiencias, campañas, workflows y plantillas de biblioteca. La API de Tags usa un **formato de respuesta plano** (sin wrapper `result`).

**Base path:** `/{locale}/api/tags`

## List Tags

Obtiene los tags del workspace actual. La API de Tags usa una respuesta **plana** (sin wrapper `result`).

**`GET /{locale}/api/tags`**

### Query Parameters

| Parameter  | Type   | Required | Description                                                                 |
| ---------- | ------ | -------- | --------------------------------------------------------------------------- |
| tagName    | string | ❌       | Filtrar por nombre de tag (coincidencia parcial, sin distinguir mayúsculas) |
| moduleName | string | ❌       | Filtrar por módulo: campaign, audience, library, workflow                   |
| page       | number | ❌       | Número de página (por defecto: 1)                                           |
| pageSize   | number | ❌       | Registros por página (por defecto: 8)                                       |

### Request Headers

| Header      | Description                                          |
| ----------- | ---------------------------------------------------- |
| workSpaceId | ID del workspace activo (establecido por middleware) |

### Response (200)

```json
{
  "data": [
    { "id": "tag_abc123", "name": "vip" },
    { "id": "tag_def456", "name": "churned" }
  ],
  "message": "Successful.",
  "status": 200,
  "totalCount": 2
}
```

::: tip
La API de Tags devuelve una respuesta **plana** — no hay wrapper `result`. Cada tag en `data` incluye `id` y `name`.
:::

## Delete Tag

Elimina un tag en borrado lógico por nombre y módulo. Usa **parámetros de consulta**, no un body en la petición.

**`DELETE /{locale}/api/tags`**

### Query Parameters

| Parameter  | Type   | Required | Description                                               |
| ---------- | ------ | -------- | --------------------------------------------------------- |
| tagName    | string | ✅       | Nombre del tag a eliminar                                 |
| moduleName | string | ✅       | Ámbito del módulo: campaign, audience, library o workflow |

### Example

```http
DELETE /{locale}/api/tags?tagName=vip&moduleName=campaign
```

### Response (200)

```json
{
  "result": {
    "data": { "count": 1 },
    "message": "Tag delete successfully."
  }
}
```

**Errors:** 500 `{ "result": { "data": null, "message": "Could not delete tag.", "error": "..." } }`.

## Tag Object (List)

| Field | Type   | Description      |
| ----- | ------ | ---------------- |
| id    | string | ID único del tag |
| name  | string | Etiqueta del tag |

## Tag Naming Rules

- El nombre del tag se **recorta** cuando se proporciona en las consultas
- El filtrado **no distingue mayúsculas y minúsculas**
- Debe ser único dentro del workspace por módulo
