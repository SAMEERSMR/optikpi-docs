# PHP SDK

El **PHP SDK** de OptiKPI Data Pipeline integra la API de ingesta del Data Pipeline con PHP 7.4+. Gestiona autenticación HMAC, validación y reintentos. Requiere **ext-json**, **ext-curl** y **ext-openssl**.

## Requisitos previos

- **PHP** 7.4 o superior
- **Composer**
- Extensiones: `ext-json`, `ext-curl`, `ext-openssl`
- Credenciales API de OptiKPI: token de autenticación, account ID, workspace ID, URL base de la API

## Instalación

Clona el repositorio del SDK e instala dependencias:

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/php
composer install
```

En tu aplicación, incluye el autoloader y usa el namespace del SDK:

```php
require_once __DIR__ . '/path/to/optikpi-datapipeline-sdk/php/vendor/autoload.php';

use Optikpi\DataPipeline\OptikpiDataPipelineSDK;
use Optikpi\DataPipeline\Models\CustomerProfile;
```

## Configuración

Inicializa el SDK con un array de opciones. Puedes cargar credenciales desde `.env` (p. ej. con `vlucas/phpdotenv`) o pasarlas directamente.

| Option      | Type   | Required | Description                                                                       |
| ----------- | ------ | -------- | --------------------------------------------------------------------------------- |
| authToken   | string | ✅       | Token de autenticación                                                            |
| accountId   | string | ✅       | Identificador de cuenta                                                           |
| workspaceId | string | ✅       | Identificador de workspace                                                        |
| baseURL     | string | ✅       | URL base de la API de ingesta, p. ej. `https://your-api-gateway-url/apigw/ingest` |

```php
$dotenv = parse_ini_file(__DIR__ . '/.env'); // o usa Dotenv

$sdk = new OptikpiDataPipelineSDK([
    'authToken'   => $dotenv['AUTH_TOKEN'],
    'accountId'   => $dotenv['ACCOUNT_ID'],
    'workspaceId' => $dotenv['WORKSPACE_ID'],
    'baseURL'     => $dotenv['API_BASE_URL']
]);
```

## Uso

### Enviar un perfil de cliente

Crea una instancia de `CustomerProfile`, valida y envía:

```php
use Optikpi\DataPipeline\Models\CustomerProfile;

$customer = new CustomerProfile([
    'account_id'   => $ACCOUNT_ID,
    'workspace_id'  => $WORKSPACE_ID,
    'user_id'       => 'user123',
    'username'      => 'john_doe',
    'full_name'     => 'John Doe',
    'email'         => 'john.doe@example.com',
    'currency'      => 'USD',
    'subscription' => 'Subscribed',
    'creation_timestamp' => date('c')
]);

$validation = $customer->validate();
if (!$validation['isValid']) {
    foreach ($validation['errors'] as $error) {
        echo "  - $error\n";
    }
    exit(1);
}

$result = $sdk->sendCustomerProfile($customer);
if ($result['success']) {
    echo "Customer profile sent: " . json_encode($result['data'], JSON_PRETTY_PRINT);
} else {
    echo "Failed: " . json_encode($result['data'] ?? $result['error'], JSON_PRETTY_PRINT);
}
```

### Enviar eventos

Usa el modelo y el método de envío correspondientes:

```php
// Account event
$accountEvent = [
    'account_id'     => $ACCOUNT_ID,
    'workspace_id'   => $WORKSPACE_ID,
    'user_id'        => 'user123',
    'event_category' => 'Account',
    'event_name'     => 'Player Registration',
    'event_id'       => 'evt_001',
    'event_time'     => date('c')
];
$sdk->sendAccountEvent($accountEvent);

// Deposit event
$depositEvent = [
    'account_id'     => $ACCOUNT_ID,
    'workspace_id'   => $WORKSPACE_ID,
    'user_id'        => 'user123',
    'event_category' => 'Deposit',
    'event_name'     => 'Successful Deposit',
    'event_id'       => 'evt_dep_001',
    'event_time'     => date('c'),
    'amount'         => 100.50
];
$sdk->sendDepositEvent($depositEvent);
```

### Atributos extendidos

```php
$sdk->sendExtendedAttributes([
    'workspace_id' => $WORKSPACE_ID,
    'user_id'     => 'user123',
    'list_name'   => 'PREFERENCES',
    'ext_data'    => ['email' => true, 'sms' => false]
]);
```

### Operaciones por lotes

Pasa un array con las claves siguientes (cada una opcional). Máximo 500 registros por lote.

| Key                 | Description                   |
| ------------------- | ----------------------------- |
| customers           | Perfiles de cliente           |
| accountEvents       | Eventos de cuenta             |
| depositEvents       | Eventos de depósito           |
| withdrawEvents      | Eventos de retiro             |
| gamingEvents        | Eventos de actividad de juego |
| walletBalanceEvents | Eventos de saldo de cartera   |
| referFriendEvents   | Eventos de referir amigo      |
| extendedAttributes  | Atributos extendidos          |

```php
$batchData = [
    'customers'           => [$customer],
    'accountEvents'       => [$accountEvent],
    'depositEvents'       => [$depositEvent],
    'withdrawEvents'      => [],
    'gamingEvents'        => [],
    'referFriendEvents'   => [],
    'walletBalanceEvents' => [],
    'extendedAttributes'  => []
];
$response = $sdk->sendBatch($batchData);
```

::: tip
Llama a `$customer->validate()` antes de enviar. Devuelve un array con `isValid` y `errors`.
:::

## Métodos de la API

| Method                         | Description                         |
| ------------------------------ | ----------------------------------- |
| sendCustomerProfile($data)     | Enviar perfil de cliente            |
| sendAccountEvent($data)        | Enviar evento de cuenta             |
| sendDepositEvent($data)        | Enviar evento de depósito           |
| sendWithdrawEvent($data)       | Enviar evento de retiro             |
| sendGamingActivityEvent($data) | Enviar evento de actividad de juego |
| sendWalletBalanceEvent($data)  | Enviar evento de saldo de cartera   |
| sendReferFriendEvent($data)    | Enviar evento de referir amigo      |
| sendExtendedAttributes($data)  | Enviar atributos extendidos         |
| sendBatch($batchData)          | Enviar un lote de varios tipos      |

## Validación

Los modelos exponen `validate()` que devuelve un array con `isValid` y `errors`. Úsalo antes de enviar.

## Ejecutar ejemplos

Desde el repo:

```bash
cd optikpi-datapipeline-sdk/php/examples
# Copia .env y configura API_BASE_URL, AUTH_TOKEN, ACCOUNT_ID, WORKSPACE_ID
php test-customer-endpoint.php
php test-all-endpoints.php
php test-batch-operations.php
```

## Ver también

- [Resumen](/es/data-pipeline-sdk/overview) — todos los SDKs y tipos de datos
- [Guía de integración](/es/data-pipeline-sdk/integration-guide) — auth, endpoints, modelos de datos, límites de tasa
- [GitHub: optikpi-datapipeline-sdk](https://github.com/gamingcrafts/optikpi-datapipeline-sdk) — código y ejemplos
