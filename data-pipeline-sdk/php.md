# PHP SDK

The OptiKPI Data Pipeline **PHP SDK** integrates the Data Pipeline Ingest API with PHP 7.4+. It handles HMAC authentication, validation, and retries. Requires **ext-json**, **ext-curl**, and **ext-openssl**.

## Prerequisites

- **PHP** 7.4 or higher
- **Composer**
- Extensions: `ext-json`, `ext-curl`, `ext-openssl`
- OptiKPI API credentials: auth token, account ID, workspace ID, API base URL

## Installation

Clone the SDK repository and install dependencies:

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/php
composer install
```

In your application, require the autoloader and use the SDK namespace:

```php
require_once __DIR__ . '/path/to/optikpi-datapipeline-sdk/php/vendor/autoload.php';

use Optikpi\DataPipeline\OptikpiDataPipelineSDK;
use Optikpi\DataPipeline\Models\CustomerProfile;
```

## Configuration

Initialize the SDK with an options array. You can load credentials from `.env` (e.g. with `vlucas/phpdotenv`) or pass them directly.

| Option      | Type   | Required | Description                                                           |
| ----------- | ------ | -------- | --------------------------------------------------------------------- |
| authToken   | string | Yes      | Authentication token                                                  |
| accountId   | string | Yes      | Account identifier                                                    |
| workspaceId | string | Yes      | Workspace identifier                                                  |
| baseURL     | string | Yes      | Ingest API base URL, e.g. `https://your-api-gateway-url/apigw/ingest` |

```php
$dotenv = parse_ini_file(__DIR__ . '/.env'); // or use Dotenv

$sdk = new OptikpiDataPipelineSDK([
    'authToken'   => $dotenv['AUTH_TOKEN'],
    'accountId'   => $dotenv['ACCOUNT_ID'],
    'workspaceId' => $dotenv['WORKSPACE_ID'],
    'baseURL'     => $dotenv['API_BASE_URL']
]);
```

## Usage

### Send a customer profile

Create a `CustomerProfile` instance, validate, then send:

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

### Send events

Use the matching model and send method:

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

### Extended attributes

```php
$sdk->sendExtendedAttributes([
    'workspace_id' => $WORKSPACE_ID,
    'user_id'     => 'user123',
    'list_name'   => 'PREFERENCES',
    'ext_data'    => ['email' => true, 'sms' => false]
]);
```

### Batch operations

Pass an array with the keys below (each optional). Max 500 records total per batch.

| Key                 | Description            |
| ------------------- | ---------------------- |
| customers           | Customer profiles      |
| accountEvents       | Account events         |
| depositEvents       | Deposit events         |
| withdrawEvents      | Withdrawal events      |
| gamingEvents        | Gaming activity events |
| walletBalanceEvents | Wallet balance events  |
| referFriendEvents   | Refer friend events    |
| extendedAttributes  | Extended attributes    |

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
Call `$customer->validate()` before sending. It returns an array with `isValid` and `errors`.
:::

## API methods

| Method                           | Description                    |
| -------------------------------- | ------------------------------ |
| `sendCustomerProfile($data)`     | Push customer profile          |
| `sendAccountEvent($data)`        | Push account event             |
| `sendDepositEvent($data)`        | Push deposit event             |
| `sendWithdrawEvent($data)`       | Push withdrawal event          |
| `sendGamingActivityEvent($data)` | Push gaming activity event     |
| `sendWalletBalanceEvent($data)`  | Push wallet balance event      |
| `sendReferFriendEvent($data)`    | Push refer-friend event        |
| `sendExtendedAttributes($data)`  | Push extended attributes       |
| `sendBatch($batchData)`          | Send a batch of multiple types |

## Validation

Models expose `validate()` returning an array with `isValid` and `errors`. Use it before sending.

## Running examples

From the repo:

```bash
cd optikpi-datapipeline-sdk/php/examples
# Copy .env and set API_BASE_URL, AUTH_TOKEN, ACCOUNT_ID, WORKSPACE_ID
php test-customer-endpoint.php
php test-all-endpoints.php
php test-batch-operations.php
```

## See also

- [Overview](/data-pipeline-sdk/overview) — all SDKs and data types
- [Integration Guide](/data-pipeline-sdk/integration-guide) — auth, endpoints, data models, rate limits
- [GitHub: optikpi-datapipeline-sdk](https://github.com/gamingcrafts/optikpi-datapipeline-sdk) — source and examples
