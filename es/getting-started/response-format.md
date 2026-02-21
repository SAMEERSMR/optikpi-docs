# Formato de respuesta

Todas las respuestas de la API de OptiKPI siguen un formato de envoltorio consistente. Entender esta estructura es esencial para manejar las respuestas en el frontend y en cualquier código de integración.

## Envoltorio estándar de respuesta

La mayoría de las rutas API devuelven respuestas envueltas en un objeto `result`:

```json
{
  "result": {
    "data": {},
    "message": "Success",
    "status": 200,
    "totalCount": 42
  }
}
```

### Respuesta correcta

| Campo             | Tipo                  | Descripción                                                      |
| ----------------- | --------------------- | ---------------------------------------------------------------- |
| result.data       | any                   | Carga útil de la respuesta — objeto, array o null                |
| result.message    | string                | Mensaje de estado legible                                        |
| result.status     | number                | Código de estado de tipo HTTP                                    |
| result.totalCount | number \| undefined   | Número total para respuestas de listas paginadas                 |
| result.workspace  | object[] \| undefined | Metadatos a nivel de workspace (devueltos por algunos endpoints) |

**Ejemplo — Respuesta de lista**

```json
{
  "result": {
    "data": [
      {
        "id": "audience_abc123",
        "name": "High Value Customers",
        "status": "ACTIVE",
        "contactCount": 15420
      }
    ],
    "message": "Audiences fetched successfully",
    "status": 200,
    "totalCount": 1
  }
}
```

### Respuesta de error

::: warning
Cuando ocurre un error, el campo `data` es `null` y se añade un campo `error`:
:::

```json
{
  "result": {
    "data": null,
    "error": "NOT_FOUND",
    "message": "The requested resource was not found.",
    "status": 404
  }
}
```

| Campo          | Tipo   | Descripción                         |
| -------------- | ------ | ----------------------------------- |
| result.data    | null   | Siempre null en caso de error       |
| result.error   | string | Código de error legible por máquina |
| result.message | string | Descripción del error legible       |
| result.status  | number | Código de estado HTTP               |

## API de Tags — Formato de respuesta plano

La API de Tags y otros pocos endpoints de utilidad devuelven una respuesta **plana** (sin envoltorio `result`):

**Éxito**

```json
{
  "data": ["vip", "churned", "new_user"],
  "message": "Tags fetched successfully",
  "status": 200,
  "totalCount": 3
}
```

**Error**

```json
{
  "data": null,
  "error": "UNAUTHORIZED",
  "message": "You do not have permission to access this resource.",
  "status": 401
}
```

## Códigos de estado HTTP

| Código | Significado                                                              |
| ------ | ------------------------------------------------------------------------ |
| 200    | Éxito                                                                    |
| 201    | Recurso creado                                                           |
| 400    | Petición incorrecta — parámetros inválidos o campos requeridos faltantes |
| 401    | No autorizado — sesión ausente o caducada                                |
| 403    | Prohibido — permisos de rol insuficientes                                |
| 404    | No encontrado                                                            |
| 409    | Conflicto — recurso duplicado                                            |
| 500    | Error interno del servidor                                               |

## Paginación

Los endpoints de listado que admiten paginación aceptan los parámetros de consulta `page` y `pageSize` y devuelven `totalCount` (o equivalente) en la respuesta para poder calcular el número total de páginas.

```http
GET /{locale}/api/audience?page=1&pageSize=20
```

| Parámetro | Tipo   | Por defecto | Descripción                                               |
| --------- | ------ | ----------- | --------------------------------------------------------- |
| page      | number | 1           | Número de página (base 1)                                 |
| pageSize  | number | varía       | Registros por página (p. ej. Audiencia: 100, Campaña: 10) |

::: tip
El campo `totalCount` representa el número total de registros que coinciden con la consulta, no el número de elementos de la página actual. El `pageSize` por defecto puede variar por endpoint; consulta cada referencia de API.
:::

## Lista de audiencias — Forma de respuesta distinta

El endpoint **GET** `/{locale}/api/audience` devuelve un objeto **plano** (sin envoltorio `result`):

```json
{
  "records": [
    {
      "id": "aud_abc123",
      "name": "High Value Customers",
      "tags": ["vip"],
      "status": "active",
      "totalCustomers": 15420,
      "updatedAt": "2024-11-15T14:30:00.000Z"
    }
  ],
  "totalCount": 42
}
```

::: info
Otros endpoints de listado pueden usar el envoltorio estándar `result.data` o una forma plana. Consulta la referencia de API de cada endpoint.
:::
