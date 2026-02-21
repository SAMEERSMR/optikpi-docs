# Java SDK

The OptiKPI Data Pipeline **Java SDK** is a type-safe client for the Data Pipeline Ingest API (Java 11+). It handles HMAC authentication, validation, and retries.

## Prerequisites

- Java 11+, Maven 3.6+
- OptiKPI credentials: auth token, account ID, workspace ID, API base URL

## Installation

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/java
mvn clean install
```

## Configuration

Use `ClientConfig` for all settings. Required: `authToken`, `accountId`, `workspaceId`. You must set `baseUrl` (e.g. via `setBaseUrl`) before sending requests.

| Option      | Type   | Required | Default | Description           |
| ----------- | ------ | -------- | ------- | --------------------- |
| authToken   | String | ✅       | —       | Authentication token  |
| accountId   | String | ✅       | —       | Account identifier    |
| workspaceId | String | ✅       | —       | Workspace identifier  |
| baseUrl     | String | ✅       | —       | Ingest API base URL   |
| timeout     | long   | ❌       | 30000   | Request timeout (ms)  |
| retries     | int    | ❌       | 3       | Retries on 5xx        |
| retryDelay  | long   | ❌       | 1000    | Base retry delay (ms) |

```java
ClientConfig config = new ClientConfig("auth_token", "account_id", "workspace_id");
config.setBaseUrl("https://your-api-gateway-url/apigw/ingest");
OptikpiDataPipelineSDK sdk = new OptikpiDataPipelineSDK(config);
```

You can use `sdk.updateConfig(newConfig)`, `sdk.getConfig()` (returns config with masked token), or the factory `OptikpiDataPipelineSDK.createClient(config)` / `createClient(authToken, accountId, workspaceId)`.

## Usage

### Customer profile

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

### Events and batch

Use `sendAccountEvent`, `sendDepositEvent`, `sendWithdrawEvent`, `sendGamingActivityEvent`, `sendWalletBalanceEvent`, `sendReferFriendEvent`, `sendExtendedAttributes`. For batch, build a `BatchData` and set the lists below (each optional). Max 500 records total per batch.

| BatchData setter       | Description            |
| ---------------------- | ---------------------- |
| setCustomers           | Customer profiles      |
| setAccountEvents       | Account events         |
| setDepositEvents       | Deposit events         |
| setWithdrawEvents      | Withdrawal events      |
| setGamingEvents        | Gaming activity events |
| setWalletBalanceEvents | Wallet balance events  |
| setReferFriendEvents   | Refer friend events    |
| setExtendedAttributes  | Extended attributes    |

```java
BatchData batchData = new BatchData();
batchData.setCustomers(Arrays.asList(customer1, customer2));
batchData.setAccountEvents(Arrays.asList(accountEvent1));
batchData.setDepositEvents(Arrays.asList(depositEvent1));
// ... other setters
var response = sdk.sendBatch(batchData);
```

::: tip
Call `customer.validate()` (or the model’s `validate()`) before sending. It returns a `ValidationResult` with `isValid()` and `getErrors()`.
:::

## API methods

| Method                                                             | Description                       |
| ------------------------------------------------------------------ | --------------------------------- |
| sendCustomerProfile(data)                                          | Push customer profile             |
| sendAccountEvent(data)                                             | Push account event(s)             |
| sendDepositEvent(data)                                             | Push deposit event(s)             |
| sendWithdrawEvent(data)                                            | Push withdrawal event(s)          |
| sendGamingActivityEvent(data)                                      | Push gaming activity event(s)     |
| sendWalletBalanceEvent(data)                                       | Push wallet balance event(s)      |
| sendReferFriendEvent(data)                                         | Push refer-friend event(s)        |
| sendExtendedAttributes(data)                                       | Push extended attributes          |
| sendBatch(batchData)                                               | Send a batch                      |
| updateConfig(config)                                               | Update client config              |
| getConfig()                                                        | Get current config (token masked) |
| createClient(config) / createClient(token, accountId, workspaceId) | Factory                           |

## Examples

```bash
cd optikpi-datapipeline-sdk/java/examples && ./run.sh TestCustomerEndpoint
```

## See also

- [Overview](/data-pipeline-sdk/overview) · [Integration Guide](/data-pipeline-sdk/integration-guide) · [GitHub](https://github.com/gamingcrafts/optikpi-datapipeline-sdk)
