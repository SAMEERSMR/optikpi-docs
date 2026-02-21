# Python SDK

The OptiKPI Data Pipeline **Python SDK** works with **Python 3.8+** (3.9+ recommended). It handles HMAC authentication, validation, and retries for the Data Pipeline Ingest API.

## Prerequisites

- **Python** 3.9 or higher
- **Poetry** or pip
- OptiKPI API credentials: auth token, account ID, workspace ID, API base URL

## Installation

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/python
pip install -e .
# or: poetry install
```

Dependencies: `requests`, `cryptography`, `python-dotenv` (see `pyproject.toml`).

## Configuration

| Option      | Required | Default | Description               |
| ----------- | -------- | ------- | ------------------------- |
| authToken   | ✅       | —       | Authentication token      |
| accountId   | ✅       | —       | Account identifier        |
| workspaceId | ✅       | —       | Workspace identifier      |
| baseURL     | ✅       | —       | Ingest API base URL       |
| timeout     | ❌       | 30      | Request timeout (seconds) |
| retries     | ❌       | 3       | Retries on failure        |
| retryDelay  | ❌       | 1       | Retry backoff (seconds)   |

```python
import os
from dotenv import load_dotenv
from index import OptikpiDataPipelineSDK  # adjust path to your setup

load_dotenv()
sdk = OptikpiDataPipelineSDK({
    'authToken': os.getenv('AUTH_TOKEN'),
    'accountId': os.getenv('ACCOUNT_ID'),
    'workspaceId': os.getenv('WORKSPACE_ID'),
    'baseURL': os.getenv('API_BASE_URL')
})
```

## Usage

### Customer profile

```python
from models.CustomerProfile import CustomerProfile

customer = CustomerProfile(
    account_id=os.getenv('ACCOUNT_ID'),
    workspace_id=os.getenv('WORKSPACE_ID'),
    user_id='user123',
    username='john_doe',
    full_name='John Doe',
    email='john.doe@example.com',
    currency='USD',
    subscription='Subscribed',
    creation_timestamp='2024-01-15T10:30:00Z'
)
if not customer.validate().get('isValid', False):
    print('Validation errors:', customer.validate().get('errors'))
    exit(1)
result = sdk.send_customer_profile(customer.to_dict())
```

### Events and batch

Use `send_account_event`, `send_deposit_event`, `send_withdraw_event`, `send_gaming_activity_event`, `send_wallet_balance_event`, `send_refer_friend_event`, `send_extended_attributes`. For batch, pass a dict with the keys below (each optional). Max 500 records total. Use **camelCase** keys.

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

```python
batch_data = {
    'customers': [customer.to_dict()],
    'accountEvents': [...],
    'depositEvents': [...],
    'withdrawEvents': [],
    'gamingEvents': [],
    'referFriendEvents': [],
    'walletBalanceEvents': [],
    'extendedAttributes': []
}
batch_result = sdk.send_batch(batch_data)
```

::: tip
Call `customer.validate()` before sending. It returns a dict with `isValid` and `errors`.
:::

## API methods

| Method                             | Description         |
| ---------------------------------- | ------------------- |
| `send_customer_profile(data)`      | Customer profile    |
| `send_account_event(data)`         | Account event       |
| `send_deposit_event(data)`         | Deposit event       |
| `send_withdraw_event(data)`        | Withdrawal event    |
| `send_gaming_activity_event(data)` | Gaming activity     |
| `send_wallet_balance_event(data)`  | Wallet balance      |
| `send_refer_friend_event(data)`    | Refer friend        |
| `send_extended_attributes(data)`   | Extended attributes |
| `send_batch(batch_data)`           | Batch send          |

## Examples

```bash
cd optikpi-datapipeline-sdk/python/examples
# Set .env: API_BASE_URL, AUTH_TOKEN, ACCOUNT_ID, WORKSPACE_ID
poetry run python test-customer-endpoint.py
poetry run python test-all-endpoints.py
poetry run python test-batch-operations.py
```

## See also

- [Overview](/data-pipeline-sdk/overview)
- [Integration Guide](/data-pipeline-sdk/integration-guide)
- [GitHub: optikpi-datapipeline-sdk](https://github.com/gamingcrafts/optikpi-datapipeline-sdk)
