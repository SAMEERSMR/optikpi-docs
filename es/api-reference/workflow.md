# Workflow

Los endpoints de Workflow gestionan flujos de trabajo de automatización: secuencias de acciones disparadas por eventos construidas con un editor visual basado en nodos. Los workflows se almacenan en **AWS S3** (formato JSON) y se despliegan vía **Google Cloud Run**.

**Base path:** `/{locale}/api/workflow`

## List Workflows

Obtiene una lista paginada de workflows del workspace actual.

**`GET /{locale}/api/workflow`**

### Query Parameters

| Parameter | Type   | Required | Description                                             |
| --------- | ------ | -------- | ------------------------------------------------------- |
| page      | number | ❌       | Número de página (por defecto: 1)                       |
| limit     | number | ❌       | Registros por página (por defecto: 10)                  |
| tab       | string | ❌       | Filtrar por estado: all, active, draft, paused, stopped |
| search    | string | ❌       | Buscar por nombre de workflow                           |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "wf_abc123",
        "name": "Welcome Series",
        "status": "ACTIVE",
        "triggerType": "EVENT",
        "triggerEvent": "user_signup",
        "nodeCount": 8,
        "enrolledCount": 2341,
        "completedCount": 1876,
        "tags": ["onboarding", "welcome"],
        "createdAt": "2024-09-01T08:00:00.000Z",
        "updatedAt": "2025-01-10T11:00:00.000Z"
      }
    ],
    "message": "Workflows fetched successfully",
    "status": 200,
    "totalCount": 12
  }
}
```

## Create Workflow

Crea un nuevo flujo de trabajo de automatización.

**`POST /{locale}/api/workflow`**

### Request Body

| Field        | Type     | Required | Description                                             |
| ------------ | -------- | -------- | ------------------------------------------------------- |
| name         | string   | ✅       | Nombre para mostrar del workflow                        |
| description  | string   | ❌       | Descripción opcional                                    |
| triggerType  | string   | ✅       | Tipo de disparador: EVENT, SCHEDULE, API                |
| triggerEvent | string   | ❌       | Nombre del evento (obligatorio para disparador EVENT)   |
| schedule     | string   | ❌       | Expresión cron (obligatoria para disparador SCHEDULE)   |
| nodes        | object[] | ❌       | Definiciones de nodos del workflow (formato React Flow) |
| edges        | object[] | ❌       | Conexiones entre nodos (formato React Flow)             |
| tags         | string[] | ❌       | Etiquetas                                               |
| status       | string   | ❌       | DRAFT (por defecto)                                     |

::: warning
Los workflows deben activarse (acción `ACTIVATE`) antes de poder procesar eventos. Los workflows en borrador no se ejecutan.
:::

### Request

```json
{
  "name": "Welcome Series",
  "description": "Onboarding sequence for new signups",
  "triggerType": "EVENT",
  "triggerEvent": "user_signup",
  "tags": ["onboarding"],
  "nodes": [
    {
      "id": "trigger_1",
      "type": "trigger",
      "data": { "event": "user_signup" },
      "position": { "x": 250, "y": 50 }
    },
    {
      "id": "email_1",
      "type": "sendEmail",
      "data": {
        "libraryId": "lib_welcome_email",
        "delay": { "value": 0, "unit": "minutes" }
      },
      "position": { "x": 250, "y": 200 }
    }
  ],
  "edges": [{ "id": "e1", "source": "trigger_1", "target": "email_1" }]
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "name": "Welcome Series",
      "status": "DRAFT",
      "createdAt": "2025-02-20T09:00:00.000Z"
    },
    "message": "Workflow created successfully",
    "status": 201
  }
}
```

## Delete Workflows

Elimina uno o más workflows.

**`DELETE /{locale}/api/workflow`**

### Request Body

| Field | Type     | Required | Description                         |
| ----- | -------- | -------- | ----------------------------------- |
| ids   | string[] | ✅       | Array de IDs de workflow a eliminar |

### Response

```json
{
  "result": {
    "data": { "deletedCount": 1 },
    "message": "Workflows deleted successfully",
    "status": 200
  }
}
```

## Get Workflow Details

Obtiene los detalles completos de un workflow, incluidos nodos y aristas.

**`GET /{locale}/api/workflow/{workflowId}`**

### Path Parameters

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| workflowId | string | Workflow ID |

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "name": "Welcome Series",
      "status": "ACTIVE",
      "triggerType": "EVENT",
      "triggerEvent": "user_signup",
      "nodes": [],
      "edges": [],
      "enrolledCount": 2341,
      "completedCount": 1876,
      "tags": ["onboarding"],
      "createdAt": "2024-09-01T08:00:00.000Z",
      "updatedAt": "2025-01-10T11:00:00.000Z"
    },
    "message": "Workflow fetched successfully",
    "status": 200
  }
}
```

## Update Workflow

Actualiza la definición, nombre o etiquetas de un workflow.

**`PUT /{locale}/api/workflow/{workflowId}`**

### Path Parameters

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| workflowId | string | Workflow ID |

### Request Body

Mismos campos que Create Workflow — incluye solo los campos a actualizar.

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "name": "Welcome Series — v2",
      "updatedAt": "2025-02-20T12:00:00.000Z"
    },
    "message": "Workflow updated successfully",
    "status": 200
  }
}
```

## Delete Single Workflow

**`DELETE /{locale}/api/workflow/{workflowId}`**

### Path Parameters

| Parameter  | Type   | Description            |
| ---------- | ------ | ---------------------- |
| workflowId | string | Workflow ID a eliminar |

### Response

```json
{
  "result": {
    "data": null,
    "message": "Workflow deleted successfully",
    "status": 200
  }
}
```

## Activate / Deploy Workflow

Despliega un workflow a producción. Sube la definición del workflow a **AWS S3** y dispara el despliegue vía **Google Cloud Run**.

**`POST /{locale}/api/workflow/{workflowId}/activate`**

### Path Parameters

| Parameter  | Type   | Description           |
| ---------- | ------ | --------------------- |
| workflowId | string | Workflow ID a activar |

### Request Body

| Field  | Type   | Required | Description                                      |
| ------ | ------ | -------- | ------------------------------------------------ |
| action | string | ✅       | ACTIVATE para desplegar, DEACTIVATE para detener |

### Request

```json
{
  "action": "ACTIVATE"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "status": "ACTIVE",
      "deployedAt": "2025-02-20T12:00:00.000Z"
    },
    "message": "Workflow activated successfully",
    "status": 200
  }
}
```

::: warning
Activar un workflow lo despliega en Google Cloud Run. Es una operación asíncrona — el `status` puede permanecer `DEPLOYING` brevemente antes de pasar a `ACTIVE`.
:::

## Workflow Node Types

| Node Type     | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| trigger       | Punto de entrada — escucha el evento disparador             |
| sendEmail     | Envía un email vía la integración configurada               |
| sendSms       | Envía un mensaje SMS                                        |
| sendPush      | Envía una notificación push web                             |
| wait          | Añade un retraso temporal antes de la siguiente acción      |
| condition     | Ramifica el workflow según atributo o condiciones de evento |
| updateContact | Actualiza un atributo o tag del contacto                    |
| exitWorkflow  | Termina el recorrido del contacto                           |

## Workflow Trigger Types

| Type     | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| EVENT    | Disparado por un evento de cliente (p. ej. user_signup, purchase)   |
| SCHEDULE | Se ejecuta según una programación cron (vía Google Cloud Scheduler) |
| API      | Disparado manualmente vía una llamada API                           |

## Workflow Statuses

| Status    | Description                                      |
| --------- | ------------------------------------------------ |
| DRAFT     | En configuración, no desplegado                  |
| ACTIVE    | Desplegado e inscribiendo contactos              |
| PAUSED    | Pausado temporalmente — sin nuevas inscripciones |
| STOPPED   | Totalmente desactivado                           |
| DEPLOYING | Despliegue en curso                              |
| FAILED    | Despliegue fallido                               |
