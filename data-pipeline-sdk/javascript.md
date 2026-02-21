# JavaScript SDK

The OptiKPI Data Pipeline **JavaScript SDK** works in Node.js and the browser. It handles HMAC authentication, validation, and retries for the Data Pipeline Ingest API.

## Prerequisites

- **Node.js** 14+ (or 18+ recommended)
- **npm** 8+
- OptiKPI API credentials: auth token, account ID, workspace ID, API base URL

## Installation

Install from the SDK repository (clone and link) or copy the package into your project:

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/js
npm install
npm run build
```

Then in your app:

```javascript
const OptikpiDataPipelineSDK = require("@optikpi/datapipeline-sdk"); // or path to dist
const { CustomerProfile } = require("@optikpi/datapipeline-sdk/dist/models"); // if using models
```

Or use the built files from `dist/` (e.g. `dist/index.js`, `dist/index.esm.js`).

## Configuration

Initialize the SDK with your credentials. You can pass options or use environment variables (e.g. via `dotenv`).

| Option      | Type   | Required | Default | Description                                                           |
| ----------- | ------ | -------- | ------- | --------------------------------------------------------------------- |
| authToken   | string | Yes      | —       | Authentication token from your account manager                        |
| accountId   | string | Yes      | —       | Account identifier                                                    |
| workspaceId | string | Yes      | —       | Workspace identifier                                                  |
| baseURL     | string | Yes      | —       | Ingest API base URL, e.g. `https://your-api-gateway-url/apigw/ingest` |
| timeout     | number | No       | 30000   | Request timeout in ms                                                 |
| retries     | number | No       | 3       | Number of retries on 5xx                                              |
| retryDelay  | number | No       | 1000    | Base delay in ms (exponential backoff)                                |

```javascript
require("dotenv").config();

const sdk = new OptikpiDataPipelineSDK({
  authToken: process.env.AUTH_TOKEN,
  accountId: process.env.ACCOUNT_ID,
  workspaceId: process.env.WORKSPACE_ID,
  baseURL: process.env.API_BASE_URL,
});
```

You can update config at runtime with `sdk.updateConfig(newConfig)` and read it (with masked token) with `sdk.getConfig()`. Alternatively use the factory: `OptikpiDataPipelineSDK.createClient(config)`.

## Usage

### Send a customer profile

Build a customer object (plain object or `CustomerProfile` instance), validate, then send:

```javascript
const { CustomerProfile } = require("./src/models"); // adjust path to your setup

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

### Send events

Same pattern: build the event object, then call the matching method.

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

### Extended attributes

```javascript
await sdk.sendExtendedAttributes({
  workspace_id: process.env.WORKSPACE_ID,
  user_id: "user123",
  list_name: "PREFERENCES",
  ext_data: { email: true, sms: false },
});
```

### Batch operations

Send multiple entity types in one call. Each key is optional; omit or pass an empty array if you have no data for that type. Batch size limit: 500 records total (see [Integration Guide](/data-pipeline-sdk/integration-guide)).

| Batch key           | Type  | Description                         |
| ------------------- | ----- | ----------------------------------- |
| customers           | Array | Customer profiles                   |
| accountEvents       | Array | Account events                      |
| depositEvents       | Array | Deposit events                      |
| withdrawEvents      | Array | Withdrawal events                   |
| gamingEvents        | Array | Gaming activity events              |
| walletBalanceEvents | Array | Wallet balance events               |
| referFriendEvents   | Array | Refer friend events                 |
| extendedAttributes  | Array | Extended attributes                 |
| operationEvents     | Array | Operations events (JavaScript only) |

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

## API methods

| Method                          | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| `sendCustomerProfile(data)`     | Push customer profile                                  |
| `sendAccountEvent(data)`        | Push account event                                     |
| `sendDepositEvent(data)`        | Push deposit event                                     |
| `sendWithdrawEvent(data)`       | Push withdrawal event                                  |
| `sendGamingActivityEvent(data)` | Push gaming activity event                             |
| `sendWalletBalanceEvent(data)`  | Push wallet balance event                              |
| `sendReferFriendEvent(data)`    | Push refer-friend event                                |
| `sendExtendedAttributes(data)`  | Push extended attributes                               |
| `sendOperationsEvent(data)`     | Push operations event(s) — **JavaScript only**         |
| `sendBatch(batchData)`          | Send a batch (see batch keys table above)              |
| `updateConfig(newConfig)`       | Update client config at runtime                        |
| `getConfig()`                   | Get current config (auth token masked)                 |
| `createClient(config)`          | Factory: `OptikpiDataPipelineSDK.createClient(config)` |

## Validation

Models like `CustomerProfile` expose a `validate()` method that returns `{ isValid, errors }`.

::: tip
Always call `validate()` before sending. The SDK will still send invalid data, but the API may return 400; validating locally gives clearer errors.
:::

## Error handling

Responses include `success` and either `data` (on success) or error details. The SDK uses retries with exponential backoff for transient failures. For HTTP status codes and retry behavior, see the [Integration Guide](/data-pipeline-sdk/integration-guide).

## Examples and tests

In the repo, under `optikpi-datapipeline-sdk/js/examples/`, run:

- `node test-customer-endpoint.js` — customer profile
- `node test-account-endpoint.js` — account events
- `node test-deposit-endpoint.js` — deposit events
- `node test-all-endpoints.js` — all endpoints
- `node test-batch-operations.js` — batch send

Set `API_BASE_URL`, `AUTH_TOKEN`, `ACCOUNT_ID`, and `WORKSPACE_ID` in `.env` before running.

## See also

- [Overview](/data-pipeline-sdk/overview) — all SDKs and data types
- [Integration Guide](/data-pipeline-sdk/integration-guide) — auth, endpoints, data models, rate limits
- [GitHub: optikpi-datapipeline-sdk](https://github.com/gamingcrafts/optikpi-datapipeline-sdk) — source and examples
