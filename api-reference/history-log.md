# History Log

The History Log API provides an audit trail of all significant actions performed within a workspace — campaign changes, workflow deployments, audience updates, user actions, and system events.

**Base path:** `/{locale}/api/history-log`

## List History Logs

Retrieve a paginated list of activity log entries for the current workspace.

**`GET /{locale}/api/history-log`**

### Query Parameters

| Parameter    | Type   | Required | Description                                                                             |
| ------------ | ------ | -------- | --------------------------------------------------------------------------------------- |
| page         | number | ❌       | Page number (default: 1)                                                                |
| limit        | number | ❌       | Records per page (default: 20)                                                          |
| resourceType | string | ❌       | Filter by resource: campaign, workflow, audience, library, integration, workspace, user |
| resourceId   | string | ❌       | Filter logs for a specific resource ID                                                  |
| action       | string | ❌       | Filter by action type                                                                   |
| userId       | string | ❌       | Filter by the user who performed the action                                             |
| startDate    | string | ❌       | Start date filter YYYY-MM-DD                                                            |
| endDate      | string | ❌       | End date filter YYYY-MM-DD                                                              |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "log_abc123",
        "resourceType": "campaign",
        "resourceId": "cmp_abc123",
        "resourceName": "Summer Sale Announcement",
        "action": "STATUS_CHANGED",
        "details": {
          "from": "DRAFT",
          "to": "SCHEDULED",
          "scheduledAt": "2025-06-01T09:00:00.000Z"
        },
        "performedBy": {
          "id": "usr_xyz789",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "ipAddress": "192.168.1.1",
        "createdAt": "2025-05-20T10:00:00.000Z"
      },
      {
        "id": "log_def456",
        "resourceType": "workflow",
        "resourceId": "wf_abc123",
        "resourceName": "Welcome Series",
        "action": "ACTIVATED",
        "details": {
          "deployedAt": "2025-02-10T11:00:00.000Z",
          "nodeCount": 8
        },
        "performedBy": {
          "id": "usr_xyz789",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "ipAddress": "192.168.1.1",
        "createdAt": "2025-02-10T11:00:00.000Z"
      }
    ],
    "message": "History logs fetched successfully",
    "status": 200,
    "totalCount": 284
  }
}
```

## Activity Log Object

| Field             | Type           | Description                                    |
| ----------------- | -------------- | ---------------------------------------------- |
| id                | string         | Unique log entry ID                            |
| resourceType      | string         | Type of resource affected                      |
| resourceId        | string         | ID of the affected resource                    |
| resourceName      | string         | Display name of the resource at time of action |
| action            | string         | Action performed (see Action Types below)      |
| details           | object         | Action-specific metadata                       |
| performedBy       | object         | User who performed the action                  |
| performedBy.id    | string         | User ID                                        |
| performedBy.name  | string         | User display name                              |
| performedBy.email | string         | User email                                     |
| ipAddress         | string \| null | Client IP address                              |
| workspaceId       | string         | Workspace ID                                   |
| createdAt         | string         | ISO 8601 timestamp of when the action occurred |

## Action Types

### Campaign Actions

| Action         | Description                               |
| -------------- | ----------------------------------------- |
| CREATED        | New campaign was created                  |
| UPDATED        | Campaign settings or content was modified |
| STATUS_CHANGED | Campaign status was changed               |
| SCHEDULED      | Campaign was scheduled for delivery       |
| SENT           | Campaign was sent                         |
| PAUSED         | Campaign was paused                       |
| CANCELLED      | Campaign was cancelled                    |
| DELETED        | Campaign was deleted                      |

### Workflow Actions

| Action      | Description                         |
| ----------- | ----------------------------------- |
| CREATED     | New workflow was created            |
| UPDATED     | Workflow definition was modified    |
| ACTIVATED   | Workflow was deployed and activated |
| DEACTIVATED | Workflow was deactivated            |
| DELETED     | Workflow was deleted                |

### Audience Actions

| Action    | Description                                          |
| --------- | ---------------------------------------------------- |
| CREATED   | New audience was created                             |
| UPDATED   | Audience filters or settings changed                 |
| REFRESHED | Audience contact count was recalculated via BigQuery |
| DELETED   | Audience was deleted                                 |

### User & Workspace Actions

| Action              | Description                             |
| ------------------- | --------------------------------------- |
| USER_INVITED        | A new user was invited to the workspace |
| USER_REMOVED        | A user was removed from the workspace   |
| ROLE_CHANGED        | A user's role was updated               |
| WORKSPACE_UPDATED   | Workspace settings were modified        |
| INTEGRATION_ADDED   | A new integration was connected         |
| INTEGRATION_REMOVED | An integration was disconnected         |
