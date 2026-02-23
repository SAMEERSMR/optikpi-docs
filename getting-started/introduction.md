# Introduction

OptiKPI **Data Pipeline SDKs** are official client libraries for the **Data Pipeline Ingest API**. They handle authentication, validation, and retries so you can send customer profiles and event data from your backend with minimal code.

## What the SDKs do

- **Authentication** — Token plus HMAC-SHA256 (HKDF) signing; the SDK sets the required headers. No crypto code on your side.
- **Validation** — Model `validate()` methods catch errors before send.
- **Retries** — Exponential backoff on 5xx and 429.

You need an **auth token**, **account ID**, **workspace ID**, and **API base URL** from your account manager. The SDK uses them to sign requests.

## Official SDKs

| SDK        | Runtime / stack      | Link                                              |
| ---------- | -------------------- | ------------------------------------------------- |
| JavaScript | Node.js 14+, browser | [JavaScript SDK →](/data-pipeline-sdk/javascript) |
| Java       | Java 11+, Maven      | [Java SDK →](/data-pipeline-sdk/java)             |
| Python     | Python 3.8+          | [Python SDK →](/data-pipeline-sdk/python)         |
| PHP        | PHP 7.4+, Composer   | [PHP SDK →](/data-pipeline-sdk/php)               |

## Supported data types

All SDKs support the same data types. Required fields and schemas are in the [Integration Guide](/data-pipeline-sdk/integration-guide).

| Type                      | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| Customer profiles         | User account info, preferences, limits, verification |
| Account events            | Login, logout, registration, verification            |
| Deposit / Withdraw events | Financial transactions                               |
| Gaming activity events    | Bets, wins, game sessions, slots, sports, poker      |
| Wallet balance events     | Balance snapshots and updates                        |
| Refer friend events       | Referrals and rewards                                |
| Extended attributes       | Custom key-value data per user/list                  |

## Key concepts

- **Account** — Your organization identifier. Sent in `x-optikpi-account-id`.
- **Workspace** — Scope for data. Sent in `x-optikpi-workspace-id`. All ingest requests are scoped to an account and workspace.
- **Ingest API base URL** — e.g. `https://your-api-gateway-url/apigw/ingest`. All ingest endpoints live under this base.

## Next steps

- [Authentication →](/getting-started/authentication) — How the Ingest API is secured and what credentials you need.
- [Response Format →](/getting-started/response-format) — Success and error shapes from the Ingest API.
- [Data Pipeline SDK Overview →](/data-pipeline-sdk/overview) — SDKs by language and [Integration Guide](/data-pipeline-sdk/integration-guide) for endpoints, rate limits, and data models.
