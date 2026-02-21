# Python SDK

El **Python SDK** de OptiKPI Data Pipeline funciona con **Python 3.8+** (recomendado 3.9+). Gestiona autenticación HMAC, validación y reintentos para la API de ingesta del Data Pipeline.

## Requisitos previos

- **Python** 3.9 o superior
- **Poetry** o pip
- Credenciales API de OptiKPI: token de autenticación, account ID, workspace ID, URL base de la API

## Instalación

```bash
git clone https://github.com/gamingcrafts/optikpi-datapipeline-sdk.git
cd optikpi-datapipeline-sdk/python
pip install -e .
# o: poetry install
```

Dependencias: `requests`, `cryptography`, `python-dotenv` (ver `pyproject.toml`).

## Configuración

| Option      | Required | Default | Description                     |
| ----------- | -------- | ------- | ------------------------------- |
| authToken   | ✅       | —       | Token de autenticación          |
| accountId   | ✅       | —       | Identificador de cuenta         |
| workspaceId | ✅       | —       | Identificador de workspace      |
| baseURL     | ✅       | —       | URL base de la API de ingesta   |
| timeout     | ❌       | 30      | Timeout de petición (segundos)  |
| retries     | ❌       | 3       | Reintentos en fallo             |
| retryDelay  | ❌       | 1       | Backoff de reintento (segundos) |

```python
import os
from dotenv import load_dotenv
from index import OptikpiDataPipelineSDK  # ajusta la ruta a tu proyecto

load_dotenv()
sdk = OptikpiDataPipelineSDK({
    'authToken': os.getenv('AUTH_TOKEN'),
    'accountId': os.getenv('ACCOUNT_ID'),
    'workspaceId': os.getenv('WORKSPACE_ID'),
    'baseURL': os.getenv('API_BASE_URL')
})
```

## Uso

### Perfil de cliente

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

### Eventos y lote

Usa `send_account_event`, `send_deposit_event`, `send_withdraw_event`, `send_gaming_activity_event`, `send_wallet_balance_event`, `send_refer_friend_event`, `send_extended_attributes`. Para lote, pasa un dict con las claves siguientes (cada una opcional). Máximo 500 registros. Usa claves en **camelCase**.

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
Llama a `customer.validate()` antes de enviar. Devuelve un dict con `isValid` y `errors`.
:::

## Métodos de la API

| Method                           | Description          |
| -------------------------------- | -------------------- |
| send_customer_profile(data)      | Perfil de cliente    |
| send_account_event(data)         | Evento de cuenta     |
| send_deposit_event(data)         | Evento de depósito   |
| send_withdraw_event(data)        | Evento de retiro     |
| send_gaming_activity_event(data) | Actividad de juego   |
| send_wallet_balance_event(data)  | Saldo de cartera     |
| send_refer_friend_event(data)    | Referir amigo        |
| send_extended_attributes(data)   | Atributos extendidos |
| send_batch(batch_data)           | Envío por lotes      |

## Ejemplos

```bash
cd optikpi-datapipeline-sdk/python/examples
# Configura .env: API_BASE_URL, AUTH_TOKEN, ACCOUNT_ID, WORKSPACE_ID
poetry run python test-customer-endpoint.py
poetry run python test-all-endpoints.py
poetry run python test-batch-operations.py
```

## Ver también

- [Resumen](/es/data-pipeline-sdk/overview)
- [Guía de integración](/es/data-pipeline-sdk/integration-guide)
- [GitHub: optikpi-datapipeline-sdk](https://github.com/gamingcrafts/optikpi-datapipeline-sdk)
