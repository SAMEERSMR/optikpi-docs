# Campaign

Campaign endpoints manage the full lifecycle of marketing campaigns — creation, scheduling, sending, status updates, and deletion.

**Base path:** `/{locale}/api/campaign`

## List Campaigns

Retrieve a paginated list of campaigns for the current workspace.

**`GET /{locale}/api/campaign`**

### Query Parameters

| Parameter | Type     | Required | Description                                                                   |
| --------- | -------- | -------- | ----------------------------------------------------------------------------- |
| `page`    | `number` | ❌       | Page number (default: `1`)                                                    |
| `limit`   | `number` | ❌       | Records per page (default: `10`)                                              |
| `tab`     | `string` | ❌       | Filter by status tab: `all`, `draft`, `scheduled`, `sent`, `paused`, `failed` |
| `search`  | `string` | ❌       | Search by campaign name                                                       |
| `channel` | `string` | ❌       | Filter by channel: `EMAIL`, `SMS`, `PUSH`                                     |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "cmp_abc123",
        "name": "Summer Sale Announcement",
        "channel": "EMAIL",
        "status": "SCHEDULED",
        "audienceId": "aud_xyz789",
        "audienceName": "High Value Customers",
        "scheduledAt": "2025-06-01T09:00:00.000Z",
        "sentCount": 0,
        "openRate": null,
        "clickRate": null,
        "createdAt": "2025-05-20T10:00:00.000Z"
      }
    ],
    "message": "Campaigns fetched successfully",
    "status": 200,
    "totalCount": 18
  }
}
```

## Create Campaign

Create a new campaign.

**`POST /{locale}/api/campaign`**

### Request Body

| Field         | Type       | Required | Description                                          |
| ------------- | ---------- | -------- | ---------------------------------------------------- |
| `name`        | `string`   | ✅       | Campaign display name                                |
| `channel`     | `string`   | ✅       | Delivery channel: `EMAIL`, `SMS`, `PUSH`             |
| `audienceId`  | `string`   | ✅       | Target audience ID                                   |
| `libraryId`   | `string`   | ✅       | Content template ID from the library                 |
| `subject`     | `string`   | ❌       | Email subject line (required for EMAIL)              |
| `previewText` | `string`   | ❌       | Email preview/preheader text                         |
| `senderId`    | `string`   | ❌       | Integration sender ID                                |
| `scheduledAt` | `string`   | ❌       | ISO 8601 schedule datetime. Omit for immediate send. |
| `tags`        | `string[]` | ❌       | Tag labels for organization                          |
| `utmParams`   | `object`   | ❌       | UTM tracking parameters                              |
| `status`      | `string`   | ❌       | Initial status: `DRAFT` (default) or `SCHEDULED`     |

::: tip
Set `status: "SCHEDULED"` and provide `scheduledAt` to create a campaign that sends automatically at the specified time. Omit `scheduledAt` for immediate sending.
:::

### Request

```json
{
  "name": "Summer Sale Announcement",
  "channel": "EMAIL",
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
  }
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "cmp_abc123",
      "name": "Summer Sale Announcement",
      "channel": "EMAIL",
      "status": "DRAFT",
      "createdAt": "2025-05-20T10:00:00.000Z"
    },
    "message": "Campaign created successfully",
    "status": 201
  }
}
```

## Delete Campaigns

Delete one or more campaigns by ID.

**`DELETE /{locale}/api/campaign`**

### Request Body

| Field | Type       | Required | Description                     |
| ----- | ---------- | -------- | ------------------------------- |
| `ids` | `string[]` | ✅       | Array of campaign IDs to delete |

### Request

```json
{
  "ids": ["cmp_abc123", "cmp_def456"]
}
```

### Response

```json
{
  "result": {
    "data": { "deletedCount": 2 },
    "message": "Campaigns deleted successfully",
    "status": 200
  }
}
```

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
