# Campaign

Campaign endpoints manage the full lifecycle of marketing campaigns — creation, scheduling, sending, status updates, and deletion.

**Base path:** `/{locale}/api/campaign`

## List Campaigns

Retrieve a paginated list of campaigns for the current workspace.

**`GET /{locale}/api/campaign`**

### Query Parameters

| Parameter  | Type     | Required | Description                                         |
| ---------- | -------- | -------- | --------------------------------------------------- |
| `page`     | `number` | ❌       | Page number (default: `1`)                          |
| `pageSize` | `number` | ❌       | Records per page (default: `10`)                    |
| `status`   | `string` | ❌       | Filter by status (e.g. draft, scheduled, completed) |

### Request Headers

| Header        | Description                             |
| ------------- | --------------------------------------- |
| `workSpaceId` | Active workspace ID (set by middleware) |
| `userId`      | User ID (set by middleware)             |

### Response (200)

Returns a list of campaigns (shape depends on `fetchAndFlattenCampaigns`). Typically includes campaign records and pagination info.

**Errors:** 401 when workSpaceId/userId missing; 500 `{ "message": "Error fetching the campaigns", "error": ... }`.

## Create Campaign

Create a new campaign. The API uses a **type-based** request body: include `type` and the fields for that operation.

**`POST /{locale}/api/campaign`**

### Create (type: CAMPAIGN_CREATED)

| Field           | Type       | Required | Description                                                              |
| --------------- | ---------- | -------- | ------------------------------------------------------------------------ |
| `type`          | `string`   | ✅       | Must be `CAMPAIGN_CREATED`                                               |
| `name`          | `string`   | ✅       | Campaign display name                                                    |
| `color`         | `string`   | ✅       | Campaign color                                                           |
| `tags`          | `string[]` | ✅       | Tag labels (array)                                                       |
| `goal`          | `object`   | ❌       | Campaign goal config                                                     |
| `audience`      | `object`   | ❌       | Audience config                                                          |
| `communication` | `object`   | ❌       | Templates and channel config                                             |
| `trigger`       | `object`   | ❌       | Trigger config                                                           |
| (other)         | —          | ❌       | Additional fields per app (e.g. campaignGoal, channelTypes, triggerType) |

### Response (200)

```json
{
  "newCampaign": {
    "id": "cmp_abc123",
    "name": "Summer Sale",
    "color": "#6172F3",
    "tags": ["summer", "promo"],
    "workspaceId": "ws_xyz789",
    "status": "draft",
    "createdAt": "2025-05-20T10:00:00.000Z"
  }
}
```

**Errors:** 400 `{ "message": "Invalid request, missing fields" }` (missing name/color/tags/type); 400 `{ "message": "Campaign with the same name already exists.", "nameError": true }`; 401; 500.

::: info
Other campaign operations (update name/color/tags, update goal/audience/trigger/communication, launch) use the same **POST** endpoint with different `type` values: e.g. `CAMPAIGN_UPDATED`, `GOAL`, `AUDIENCE`, `TRIGGER`, `COMMUNICATION`, `CAMPAIGN_LAUNCHED`. Each has a specific body shape; `campaignId` is required for updates.
:::

## Delete Campaigns

Delete one or more campaigns by ID.

**`DELETE /{locale}/api/campaign`**

### Request Body

| Field         | Type       | Required | Description                            |
| ------------- | ---------- | -------- | -------------------------------------- |
| `campaignIds` | `string[]` | ✅       | Array of campaign IDs to delete        |
| `tags`        | `string[]` | ❌       | Optional; for tag cleanup after delete |

### Request

```json
{
  "campaignIds": ["cmp_abc123", "cmp_def456"],
  "tags": ["summer"]
}
```

### Response (200)

Standard success envelope:

```json
{
  "result": {
    "data": [],
    "message": "Campaigns deleted successfully",
    "status": 200
  }
}
```

**Errors:** 400 when workSpaceId/userId missing or campaignIds empty; 500 on delete failure.

## Get Campaign Details

Retrieve full details of a single campaign.

**`GET /{locale}/api/campaign/{campaignId}`**

### Path Parameters

| Parameter    | Type     | Description |
| ------------ | -------- | ----------- |
| `campaignId` | `string` | Campaign ID |

### Response

```json
{
  "result": {
    "data": {
      "id": "cmp_abc123",
      "name": "Summer Sale Announcement",
      "channel": "EMAIL",
      "status": "SCHEDULED",
      "audienceId": "aud_xyz789",
      "libraryId": "lib_abc123",
      "subject": "☀️ Our Biggest Sale of the Year Starts Now",
      "previewText": "Up to 50% off — this weekend only.",
      "senderId": "int_sendgrid_01",
      "scheduledAt": "2025-06-01T09:00:00.000Z",
      "tags": ["summer", "promo"],
      "utmParams": {
        "utm_source": "email",
        "utm_medium": "newsletter",
        "utm_campaign": "summer-sale-2025"
      },
      "stats": {
        "sent": 0,
        "delivered": 0,
        "opened": 0,
        "clicked": 0,
        "bounced": 0,
        "unsubscribed": 0
      },
      "createdAt": "2025-05-20T10:00:00.000Z",
      "updatedAt": "2025-05-20T10:00:00.000Z"
    },
    "message": "Campaign fetched successfully",
    "status": 200
  }
}
```

## Update Campaign

Update a campaign's content or settings.

**`PUT /{locale}/api/campaign/{campaignId}`**

### Path Parameters

| Parameter    | Type     | Description |
| ------------ | -------- | ----------- |
| `campaignId` | `string` | Campaign ID |

### Request Body

Same fields as Create Campaign — only include the fields you want to update.

### Response

```json
{
  "result": {
    "data": {
      "id": "cmp_abc123",
      "name": "Summer Sale Announcement — Updated",
      "scheduledAt": "2025-06-02T09:00:00.000Z",
      "updatedAt": "2025-05-21T08:00:00.000Z"
    },
    "message": "Campaign updated successfully",
    "status": 200
  }
}
```

## Update Campaign Status

Update the delivery status of a campaign (schedule, pause, cancel, etc.).

**`POST /{locale}/api/campaign/{campaignId}`**

### Request Body

| Field         | Type     | Required | Description                                 |
| ------------- | -------- | -------- | ------------------------------------------- |
| `type`        | `string` | ✅       | Status action type                          |
| `scheduledAt` | `string` | ❌       | New schedule datetime (for `SCHEDULE` type) |

### Status Action Types

| `type`     | Description                                               |
| ---------- | --------------------------------------------------------- |
| `SCHEDULE` | Schedule the campaign for delivery                        |
| `PAUSE`    | Pause a running campaign                                  |
| `RESUME`   | Resume a paused campaign                                  |
| `CANCEL`   | Cancel a scheduled or running campaign                    |
| `SEND_NOW` | Immediately trigger campaign delivery (bypasses schedule) |

### Request

```json
{
  "type": "SCHEDULE",
  "scheduledAt": "2025-06-01T09:00:00.000Z"
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "cmp_abc123",
      "status": "SCHEDULED",
      "scheduledAt": "2025-06-01T09:00:00.000Z"
    },
    "message": "Campaign scheduled successfully",
    "status": 200
  }
}
```

## Campaign Object

| Field         | Type             | Description                                                                          |
| ------------- | ---------------- | ------------------------------------------------------------------------------------ |
| `id`          | `string`         | Unique campaign ID                                                                   |
| `name`        | `string`         | Display name                                                                         |
| `channel`     | `string`         | `EMAIL` \| `SMS` \| `PUSH`                                                           |
| `status`      | `string`         | `DRAFT` \| `SCHEDULED` \| `RUNNING` \| `SENT` \| `PAUSED` \| `CANCELLED` \| `FAILED` |
| `audienceId`  | `string`         | Target audience ID                                                                   |
| `libraryId`   | `string`         | Content template ID                                                                  |
| `subject`     | `string \| null` | Email subject (EMAIL only)                                                           |
| `previewText` | `string \| null` | Email preheader text                                                                 |
| `senderId`    | `string \| null` | Integration/sender ID                                                                |
| `scheduledAt` | `string \| null` | Scheduled send datetime                                                              |
| `tags`        | `string[]`       | Tag labels                                                                           |
| `utmParams`   | `object \| null` | UTM tracking parameters                                                              |
| `stats`       | `object`         | Delivery metrics (sent, opened, clicked, etc.)                                       |
| `workspaceId` | `string`         | Owning workspace ID                                                                  |
| `createdAt`   | `string`         | ISO 8601 creation timestamp                                                          |
| `updatedAt`   | `string`         | ISO 8601 last update timestamp                                                       |

## Campaign Channels

| Channel | Delivery Via               | Template Type             |
| ------- | -------------------------- | ------------------------- |
| `EMAIL` | SendGrid / Elastic Email   | HTML email template       |
| `SMS`   | Integrated SMS provider    | Plain text / rich text    |
| `PUSH`  | Web Push API (OptikPI SDK) | Push notification payload |
