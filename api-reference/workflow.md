# Workflow

Workflow endpoints manage automation workflows — event-triggered sequences of actions built with a visual node-based editor. Workflows are stored in **AWS S3** (JSON format) and deployed via **Google Cloud Run**.

**Base path:** `/{locale}/api/workflow`

## List Workflows

Retrieve a paginated list of workflows for the current workspace.

**`GET /{locale}/api/workflow`**

### Query Parameters

| Parameter | Type   | Required | Description                                                |
| --------- | ------ | -------- | ---------------------------------------------------------- |
| page      | number | ❌       | Page number (default: 1)                                   |
| limit     | number | ❌       | Records per page (default: 10)                             |
| tab       | string | ❌       | Filter by status: all, active, draft, paused, stopped      |
| search    | string | ❌       | Search by workflow name                                    |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "wf_abc123",
        "name": "Welcome Series",
        "status": "ACTIVE",
        "triggerType": "EVENT",
        "triggerEvent": "user_signup",
        "nodeCount": 8,
        "enrolledCount": 2341,
        "completedCount": 1876,
        "tags": ["onboarding", "welcome"],
        "createdAt": "2024-09-01T08:00:00.000Z",
        "updatedAt": "2025-01-10T11:00:00.000Z"
      }
    ],
    "message": "Workflows fetched successfully",
    "status": 200,
    "totalCount": 12
  }
}
```

## Create Workflow

Create a new automation workflow.

**`POST /{locale}/api/workflow`**

### Request Body

| Field         | Type     | Required | Description                                       |
| ------------- | -------- | -------- | ------------------------------------------------- |
| name          | string   | ✅       | Workflow display name                             |
| description   | string   | ❌       | Optional description                             |
| triggerType   | string   | ✅       | Trigger type: EVENT, SCHEDULE, API                |
| triggerEvent  | string   | ❌       | Event name (required for EVENT trigger)           |
| schedule      | string   | ❌       | Cron expression (required for SCHEDULE trigger)   |
| nodes         | object[] | ❌       | Workflow node definitions (React Flow format)     |
| edges         | object[] | ❌       | Workflow edge connections (React Flow format)     |
| tags          | string[] | ❌       | Tag labels                                        |
| status        | string   | ❌       | DRAFT (default)                                   |

::: warning
Workflows must be activated (`ACTIVATE` action) before they can process events. Draft workflows are not executed.
:::

### Request

```json
{
  "name": "Welcome Series",
  "description": "Onboarding sequence for new signups",
  "triggerType": "EVENT",
  "triggerEvent": "user_signup",
  "tags": ["onboarding"],
  "nodes": [
    {
      "id": "trigger_1",
      "type": "trigger",
      "data": { "event": "user_signup" },
      "position": { "x": 250, "y": 50 }
    },
    {
      "id": "email_1",
      "type": "sendEmail",
      "data": {
        "libraryId": "lib_welcome_email",
        "delay": { "value": 0, "unit": "minutes" }
      },
      "position": { "x": 250, "y": 200 }
    }
  ],
  "edges": [{ "id": "e1", "source": "trigger_1", "target": "email_1" }]
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "name": "Welcome Series",
      "status": "DRAFT",
      "createdAt": "2025-02-20T09:00:00.000Z"
    },
    "message": "Workflow created successfully",
    "status": 201
  }
}
```

## Delete Workflows

Delete one or more workflows.

**`DELETE /{locale}/api/workflow`**

### Request Body

| Field | Type     | Required | Description                     |
| ----- | -------- | -------- | ------------------------------- |
| ids   | string[] | ✅       | Array of workflow IDs to delete |

### Response

```json
{
  "result": {
    "data": { "deletedCount": 1 },
    "message": "Workflows deleted successfully",
    "status": 200
  }
}
```

## Get Workflow Details

Retrieve full details of a single workflow including nodes and edges.

**`GET /{locale}/api/workflow/{workflowId}`**

### Path Parameters

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| workflowId | string | Workflow ID |

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "name": "Welcome Series",
      "status": "ACTIVE",
      "triggerType": "EVENT",
      "triggerEvent": "user_signup",
      "nodes": [],
      "edges": [],
      "enrolledCount": 2341,
      "completedCount": 1876,
      "tags": ["onboarding"],
      "createdAt": "2024-09-01T08:00:00.000Z",
      "updatedAt": "2025-01-10T11:00:00.000Z"
    },
    "message": "Workflow fetched successfully",
    "status": 200
  }
}
```

## Update Workflow

Update a workflow's definition, name, or tags.

**`PUT /{locale}/api/workflow/{workflowId}`**

### Path Parameters

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| workflowId | string | Workflow ID |

### Request Body

Same fields as Create Workflow — only include fields to update.

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "name": "Welcome Series — v2",
      "updatedAt": "2025-02-20T12:00:00.000Z"
    },
    "message": "Workflow updated successfully",
    "status": 200
  }
}
```

## Delete Single Workflow

**`DELETE /{locale}/api/workflow/{workflowId}`**

### Path Parameters

| Parameter  | Type   | Description           |
| ---------- | ------ | --------------------- |
| workflowId | string | Workflow ID to delete  |

### Response

```json
{
  "result": {
    "data": null,
    "message": "Workflow deleted successfully",
    "status": 200
  }
}
```

## Activate / Deploy Workflow

Deploy a workflow to production. This uploads the workflow definition to **AWS S3** and triggers the deployment via **Google Cloud Run**.

**`POST /{locale}/api/workflow/{workflowId}/activate`**

### Path Parameters

| Parameter  | Type   | Description             |
| ---------- | ------ | ----------------------- |
| workflowId | string | Workflow ID to activate  |

### Request Body

| Field  | Type   | Required | Description                              |
| ------ | ------ | -------- | ---------------------------------------- |
| action | string | ✅       | ACTIVATE to deploy, DEACTIVATE to stop    |

### Request

```json
{
  "action": "ACTIVATE"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "wf_abc123",
      "status": "ACTIVE",
      "deployedAt": "2025-02-20T12:00:00.000Z"
    },
    "message": "Workflow activated successfully",
    "status": 200
  }
}
```

::: warning
Activating a workflow deploys it to Google Cloud Run. This is an asynchronous operation — the `status` may remain `DEPLOYING` briefly before transitioning to `ACTIVE`.
:::

## Workflow Node Types

| Node Type     | Description                                              |
| ------------- | -------------------------------------------------------- |
| trigger       | Entry point — listens for the trigger event              |
| sendEmail     | Sends an email via the configured integration            |
| sendSms       | Sends an SMS message                                     |
| sendPush      | Sends a web push notification                            |
| wait          | Adds a time delay before the next action                 |
| condition     | Branches workflow based on attribute or event conditions |
| updateContact | Updates a contact's attribute or tag                     |
| exitWorkflow  | Terminates the contact's journey                         |

## Workflow Trigger Types

| Type     | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| EVENT    | Triggered by a specific customer event (e.g. user_signup, purchase) |
| SCHEDULE | Runs on a cron schedule (via Google Cloud Scheduler)             |
| API      | Manually triggered via an API call                               |

## Workflow Statuses

| Status    | Description                             |
| --------- | --------------------------------------- |
| DRAFT     | Being configured, not deployed          |
| ACTIVE    | Deployed and enrolling contacts         |
| PAUSED    | Temporarily paused — no new enrollments |
| STOPPED   | Fully deactivated                       |
| DEPLOYING | Deployment in progress                  |
| FAILED    | Deployment failed                       |
