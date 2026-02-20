# Introduction

OptikPI is a full-stack marketing automation platform built on **Next.js 14**. It enables teams to create audience segments, run multi-channel campaigns, design automation workflows, and track engagement — all from a unified interface.

## Architecture Overview

OptikPI is structured as a Next.js application with locale-prefixed API routes. All API endpoints follow this base path pattern:

```url
/{locale}/api/{resource}
```

For example, the audience API is available at `/en/api/audience`.

A small set of internal utility APIs (e.g. authentication, user lookup) live at `/api/...` without locale prefix.

## Tech Stack

| Layer                | Technology                                                   |
| -------------------- | ------------------------------------------------------------ |
| Frontend Framework   | Next.js 14 (App Router), React 18, TypeScript                |
| Styling              | Tailwind CSS                                                 |
| ORM / Database       | Prisma + MongoDB                                             |
| Authentication       | NextAuth (JWT, CredentialsProvider)                          |
| Data Fetching        | SWR, React Hook Form                                         |
| Cloud Storage        | AWS S3, Google Cloud Storage (GCS)                           |
| Big Data / Audiences | Google BigQuery                                              |
| Scheduling           | Google Cloud Scheduler, Cloud Run                            |
| Serverless           | AWS Lambda                                                   |
| Analytics / Search   | ElasticSearch                                                |
| Email                | SendGrid, Elastic Email                                      |
| Push Notifications   | Web Push API (custom SDK), Firebase Cloud Messaging (legacy) |

## Key Concepts

### Workspace

Every user belongs to a **Workspace**. A workspace is an organizational unit that contains campaigns, audiences, workflows, integrations, and user roles. All API requests are scoped to a workspace via the `workSpaceId` header.

### Locale

The application supports multiple locales (English `en`, Arabic `ar`, etc.). Locale is part of the URL path and is used to localize responses and UI labels. The middleware extracts the active locale from the session and routes requests accordingly.

### Session Headers

All API calls within the platform include session-derived headers injected by the Next.js middleware:

| Header        | Description                                   |
| ------------- | --------------------------------------------- |
| `accountId`   | The account (company/organization) ID         |
| `workSpaceId` | The active workspace ID                       |
| `userId`      | The authenticated user's ID                   |
| `timezone`    | User's preferred timezone (e.g. `Asia/Dubai`) |
| `language`    | User's preferred language (e.g. `en`)         |

These headers are not sent by the client — they are automatically set by `middleware.ts` on every server-side API request after reading the session from the JWT cookie.

## Next Steps

- [Authentication →](/getting-started/authentication)
- [Response Format →](/getting-started/response-format)
- [API Reference →](/api-reference/user)
