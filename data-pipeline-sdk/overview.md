# Overview

> OptiKPI Data Pipeline SDKs are official client libraries for the Data Pipeline Ingest API. They handle authentication, validation, and retries so you can send customer profiles and event data from your backend with minimal code.

## Official SDKs

Choose your language. Each card links to installation, configuration, and usage for that SDK.

<div class="sdk-card-group">

<a class="sdk-card" href="/data-pipeline-sdk/javascript">
  <span class="sdk-card-icon">🟨</span>
  <div class="sdk-card-title">JavaScript SDK</div>
  <p class="sdk-card-desc">Use the Data Pipeline API from Node.js or the browser. Install via npm; supports CommonJS and ESM.</p>
</a>

<a class="sdk-card" href="/data-pipeline-sdk/java">
  <span class="sdk-card-icon">☕</span>
  <div class="sdk-card-title">Java SDK</div>
  <p class="sdk-card-desc">Java 11+ client with Maven. Type-safe models, validation, and batch support.</p>
</a>

<a class="sdk-card" href="/data-pipeline-sdk/python">
  <span class="sdk-card-icon">🐍</span>
  <div class="sdk-card-title">Python SDK</div>
  <p class="sdk-card-desc">Python 3.8+ client. Use with pip or Poetry; includes models and validation.</p>
</a>

<a class="sdk-card" href="/data-pipeline-sdk/php">
  <span class="sdk-card-icon">🐘</span>
  <div class="sdk-card-title">PHP SDK</div>
  <p class="sdk-card-desc">PHP 7.4+ client via Composer. Requires ext-json, ext-curl, ext-openssl.</p>
</a>

</div>

## Supported data types

All SDKs support the same data types and batch keys. Required fields and field-level schemas are in the [Integration Guide](/data-pipeline-sdk/integration-guide).

| Type                          | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| **Customer profiles**         | User account info, preferences, limits, verification status |
| **Account events**            | Login, logout, registration, verification                   |
| **Deposit / Withdraw events** | Financial transactions                                      |
| **Gaming activity events**    | Bets, wins, game sessions, slots, sports, poker             |
| **Wallet balance events**     | Balance snapshots and updates                               |
| **Refer friend events**       | Referrals and rewards                                       |
| **Extended attributes**       | Custom key-value data per user/list                         |

::: tip Get credentials
You need an **auth token**, **account ID**, **workspace ID**, and **API base URL** from your account manager. The SDK uses them to sign requests (HMAC + HKDF); no crypto code required on your side.
:::

## Next steps

1. Pick an SDK above and open its page for **Installation** and **Configuration**.
2. Read the [Integration Guide](/data-pipeline-sdk/integration-guide) for endpoints, rate limits, error handling, and data model details.
3. Run the examples in the [SDK repository](https://github.com/gamingcrafts/optikpi-datapipeline-sdk) after setting `.env` with your credentials.
