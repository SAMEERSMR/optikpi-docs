# JavaScript SDK

El **JavaScript SDK** de OptiKPI Data Pipeline funciona en Node.js y en el navegador. Gestiona autenticación HMAC, validación y reintentos para la API de ingesta del Data Pipeline.

## Requisitos previos

- **Node.js** 14+ (recomendado 18+)
- **npm** 8+
- Credenciales API de OptiKPI: token de autenticación, account ID, workspace ID, URL base de la API

## Instalación

Instala desde el repositorio del SDK (clonar y enlazar) o copia el paquete en tu proyecto:

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/js
npm install
npm run build
```

Luego en tu aplicación:

```javascript
const OptikpiDataPipelineSDK = require("@optikpi/datapipeline-sdk"); // o ruta a dist
const { CustomerProfile } = require("@optikpi/datapipeline-sdk/dist/models"); // si usas modelos
```

O usa los archivos compilados de `dist/` (p. ej. `dist/index.js`, `dist/index.esm.js`).

## Configuración

Inicializa el SDK con tus credenciales. Puedes pasar opciones o usar variables de entorno (p. ej. con `dotenv`).

| Option      | Type   | Required | Default | Description                                                                       |
| ----------- | ------ | -------- | ------- | --------------------------------------------------------------------------------- |
| authToken   | string | ✅       | —       | Token de autenticación de tu gestor de cuenta                                     |
| accountId   | string | ✅       | —       | Identificador de cuenta                                                           |
| workspaceId | string | ✅       | —       | Identificador de workspace                                                        |
| baseURL     | string | ✅       | —       | URL base de la API de ingesta, p. ej. `https://your-api-gateway-url/apigw/ingest` |
| timeout     | number | ❌       | 30000   | Timeout de petición en ms                                                         |
| retries     | number | ❌       | 3       | Número de reintentos en 5xx                                                       |
| retryDelay  | number | ❌       | 1000    | Retraso base en ms (backoff exponencial)                                          |

```javascript
require("dotenv").config();

const sdk = new OptikpiDataPipelineSDK({
  authToken: process.env.AUTH_TOKEN,
  accountId: process.env.ACCOUNT_ID,
  workspaceId: process.env.WORKSPACE_ID,
  baseURL: process.env.API_BASE_URL,
});
```

Puedes actualizar la config en tiempo de ejecución con `sdk.updateConfig(newConfig)` y leerla (con token enmascarado) con `sdk.getConfig()`. También puedes usar la fábrica: `OptikpiDataPipelineSDK.createClient(config)`.

## Uso

### Enviar un perfil de cliente

Construye un objeto de cliente (objeto plano o instancia de `CustomerProfile`), valida y envía:

```javascript
const { CustomerProfile } = require("./src/models"); // ajusta la ruta a tu proyecto

const customer = new CustomerProfile({
  account_id: process.env.ACCOUNT_ID,
  workspace_id: process.env.WORKSPACE_ID,
  user_id: "user123",
  username: "john_doe",
  full_name: "John Doe",
  email: "john.doe@example.com",
  currency: "USD",
  subscription: "Subscribed",
  creation_timestamp: new Date().toISOString(),
});

const validation = customer.validate();
if (!validation.isValid) {
  console.error("Validation errors:", validation.errors);
  process.exit(1);
}

const result = await sdk.sendCustomerProfile(customer);
if (result.success) {
  console.log("Customer profile sent:", result.data);
} else {
  console.error("Failed:", result.data || result.error);
}
```

### Enviar eventos

Mismo patrón: construye el objeto del evento y llama al método correspondiente.

```javascript
// Account event
await sdk.sendAccountEvent({
  account_id: process.env.ACCOUNT_ID,
  workspace_id: process.env.WORKSPACE_ID,
  user_id: "user123",
  event_category: "Account",
  event_name: "Player Registration",
  event_id: "evt_001",
  event_time: new Date().toISOString(),
});

// Deposit event
await sdk.sendDepositEvent({
  account_id: process.env.ACCOUNT_ID,
  workspace_id: process.env.WORKSPACE_ID,
  user_id: "user123",
  event_category: "Deposit",
  event_name: "Successful Deposit",
  event_id: "evt_dep_001",
  event_time: new Date().toISOString(),
  amount: 100.5,
});
```

### Atributos extendidos

```javascript
await sdk.sendExtendedAttributes({
  workspace_id: process.env.WORKSPACE_ID,
  user_id: "user123",
  list_name: "PREFERENCES",
  ext_data: { email: true, sms: false },
});
```

### Operaciones por lotes

Envía varios tipos de entidad en una sola llamada. Cada clave es opcional; omítela o pasa un array vacío si no tienes datos de ese tipo. Límite de tamaño de lote: 500 registros en total (ver [Guía de integración](/es/data-pipeline-sdk/integration-guide)).

| Batch key           | Type  | Description                              |
| ------------------- | ----- | ---------------------------------------- |
| customers           | Array | Perfiles de cliente                      |
| accountEvents       | Array | Eventos de cuenta                        |
| depositEvents       | Array | Eventos de depósito                      |
| withdrawEvents      | Array | Eventos de retiro                        |
| gamingEvents        | Array | Eventos de actividad de juego            |
| walletBalanceEvents | Array | Eventos de saldo de cartera              |
| referFriendEvents   | Array | Eventos de referir amigo                 |
| extendedAttributes  | Array | Atributos extendidos                     |
| operationEvents     | Array | Eventos de operaciones (solo JavaScript) |

```javascript
const batchData = {
  customers: [customer1, customer2],
  accountEvents: [accountEvent1],
  depositEvents: [depositEvent1],
  withdrawEvents: [],
  gamingEvents: [],
  referFriendEvents: [],
  walletBalanceEvents: [],
  extendedAttributes: [],
  operationEvents: [], // JS only
};
const batchResult = await sdk.sendBatch(batchData);
```

## Métodos de la API

| Method                        | Description                                           |
| ----------------------------- | ----------------------------------------------------- |
| sendCustomerProfile(data)     | Enviar perfil de cliente                              |
| sendAccountEvent(data)        | Enviar evento de cuenta                               |
| sendDepositEvent(data)        | Enviar evento de depósito                             |
| sendWithdrawEvent(data)       | Enviar evento de retiro                               |
| sendGamingActivityEvent(data) | Enviar evento de actividad de juego                   |
| sendWalletBalanceEvent(data)  | Enviar evento de saldo de cartera                     |
| sendReferFriendEvent(data)    | Enviar evento de referir amigo                        |
| sendExtendedAttributes(data)  | Enviar atributos extendidos                           |
| sendOperationsEvent(data)     | Enviar evento(s) de operaciones — **solo JavaScript** |
| sendBatch(batchData)          | Enviar un lote (ver tabla de claves de lote arriba)   |
| updateConfig(newConfig)       | Actualizar config del cliente en tiempo de ejecución  |
| getConfig()                   | Obtener config actual (token enmascarado)             |
| createClient(config)          | Fábrica: OptikpiDataPipelineSDK.createClient(config)  |

## Validación

Los modelos como `CustomerProfile` exponen un método `validate()` que devuelve `{ isValid, errors }`.

::: tip
Llama siempre a `validate()` antes de enviar. El SDK seguirá enviando datos inválidos, pero la API puede devolver 400; validar localmente da errores más claros.
:::

## Manejo de errores

Las respuestas incluyen `success` y bien `data` (en éxito) o detalles de error. El SDK usa reintentos con backoff exponencial en fallos transitorios. Para códigos HTTP y comportamiento de reintento, ver la [Guía de integración](/es/data-pipeline-sdk/integration-guide).

## Ejemplos y tests

En el repo, en `optikpi-datapipeline-sdk/js/examples/`, ejecuta:

- `node test-customer-endpoint.js` — perfil de cliente
- `node test-account-endpoint.js` — eventos de cuenta
- `node test-deposit-endpoint.js` — eventos de depósito
- `node test-all-endpoints.js` — todos los endpoints
- `node test-batch-operations.js` — envío por lotes

Configura `API_BASE_URL`, `AUTH_TOKEN`, `ACCOUNT_ID` y `WORKSPACE_ID` en `.env` antes de ejecutar.

## Ver también

- [Resumen](/es/data-pipeline-sdk/overview) — todos los SDKs y tipos de datos
- [Guía de integración](/es/data-pipeline-sdk/integration-guide) — auth, endpoints, modelos de datos, límites de tasa
- [GitHub: optikpi-datapipeline-sdk](https://github.com/gamingcrafts/optikpi-datapipeline-sdk) — código y ejemplos
