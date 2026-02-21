# Java SDK

El **Java SDK** de OptiKPI Data Pipeline es un cliente con tipos seguros para la API de ingesta del Data Pipeline (Java 11+). Gestiona autenticación HMAC, validación y reintentos.

## Requisitos previos

- Java 11+, Maven 3.6+
- Credenciales OptiKPI: token de autenticación, account ID, workspace ID, URL base de la API

## Instalación

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/java
mvn clean install
```

## Configuración

Usa `ClientConfig` para toda la configuración. Obligatorios: `authToken`, `accountId`, `workspaceId`. Debes establecer `baseUrl` (p. ej. con `setBaseUrl`) antes de enviar peticiones.

| Option      | Type   | Required | Default | Description                    |
| ----------- | ------ | -------- | ------- | ------------------------------ |
| authToken   | String | ✅       | —       | Token de autenticación         |
| accountId   | String | ✅       | —       | Identificador de cuenta        |
| workspaceId | String | ✅       | —       | Identificador de workspace     |
| baseUrl     | String | ✅       | —       | URL base de la API de ingesta  |
| timeout     | long   | ❌       | 30000   | Timeout de petición (ms)       |
| retries     | int    | ❌       | 3       | Reintentos en 5xx              |
| retryDelay  | long   | ❌       | 1000    | Retraso base de reintento (ms) |

```java
ClientConfig config = new ClientConfig("auth_token", "account_id", "workspace_id");
config.setBaseUrl("https://your-api-gateway-url/apigw/ingest");
OptikpiDataPipelineSDK sdk = new OptikpiDataPipelineSDK(config);
```

Puedes usar `sdk.updateConfig(newConfig)`, `sdk.getConfig()` (devuelve config con token enmascarado) o la fábrica `OptikpiDataPipelineSDK.createClient(config)` / `createClient(authToken, accountId, workspaceId)`.

## Uso

### Perfil de cliente

```java
CustomerProfile customer = new CustomerProfile();
customer.setAccountId(accountId);
customer.setWorkspaceId(workspaceId);
customer.setUserId("user123");
customer.setUsername("john_doe");
customer.setFullName("John Doe");
customer.setEmail("john.doe@example.com");
customer.setCurrency("USD");
customer.setSubscription("Subscribed");
customer.setCreationTimestamp("2024-01-15T10:30:00Z");
if (!customer.validate().isValid()) return;
var response = sdk.sendCustomerProfile(customer);
```

### Eventos y lote

Usa `sendAccountEvent`, `sendDepositEvent`, `sendWithdrawEvent`, `sendGamingActivityEvent`, `sendWalletBalanceEvent`, `sendReferFriendEvent`, `sendExtendedAttributes`. Para lote, construye un `BatchData` y establece las listas siguientes (cada una opcional). Máximo 500 registros por lote.

| BatchData setter       | Description                   |
| ---------------------- | ----------------------------- |
| setCustomers           | Perfiles de cliente           |
| setAccountEvents       | Eventos de cuenta             |
| setDepositEvents       | Eventos de depósito           |
| setWithdrawEvents      | Eventos de retiro             |
| setGamingEvents        | Eventos de actividad de juego |
| setWalletBalanceEvents | Eventos de saldo de cartera   |
| setReferFriendEvents   | Eventos de referir amigo      |
| setExtendedAttributes  | Atributos extendidos          |

```java
BatchData batchData = new BatchData();
batchData.setCustomers(Arrays.asList(customer1, customer2));
batchData.setAccountEvents(Arrays.asList(accountEvent1));
batchData.setDepositEvents(Arrays.asList(depositEvent1));
// ... otros setters
var response = sdk.sendBatch(batchData);
```

::: tip
Llama a `customer.validate()` (o al `validate()` del modelo) antes de enviar. Devuelve un `ValidationResult` con `isValid()` y `getErrors()`.
:::

## Métodos de la API

| Method                                                             | Description                               |
| ------------------------------------------------------------------ | ----------------------------------------- |
| sendCustomerProfile(data)                                          | Enviar perfil de cliente                  |
| sendAccountEvent(data)                                             | Enviar evento(s) de cuenta                |
| sendDepositEvent(data)                                             | Enviar evento(s) de depósito              |
| sendWithdrawEvent(data)                                            | Enviar evento(s) de retiro                |
| sendGamingActivityEvent(data)                                      | Enviar evento(s) de actividad de juego    |
| sendWalletBalanceEvent(data)                                       | Enviar evento(s) de saldo de cartera      |
| sendReferFriendEvent(data)                                         | Enviar evento(s) de referir amigo         |
| sendExtendedAttributes(data)                                       | Enviar atributos extendidos               |
| sendBatch(batchData)                                               | Enviar un lote                            |
| updateConfig(config)                                               | Actualizar config del cliente             |
| getConfig()                                                        | Obtener config actual (token enmascarado) |
| createClient(config) / createClient(token, accountId, workspaceId) | Fábrica                                   |

## Ejemplos

```bash
cd optikpi-datapipeline-sdk/java/examples && ./run.sh TestCustomerEndpoint
```

## Ver también

- [Resumen](/es/data-pipeline-sdk/overview) · [Guía de integración](/es/data-pipeline-sdk/integration-guide) · [GitHub](https://github.com/gamingcrafts/optikpi-datapipeline-sdk)
