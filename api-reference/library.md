# Library

The Library API manages reusable content templates — HTML email designs, SMS message bodies, and push notification payloads. Templates stored in the library can be referenced by campaigns and workflows.

**Base path:** `/{locale}/api/library`

## List Library Items

Retrieve a paginated list of templates.

**`GET /{locale}/api/library`**

### Query Parameters

| Parameter | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| page      | number | ❌       | Page number (default: 1)          |
| limit     | number | ❌       | Records per page (default: 10)    |
| type      | string | ❌       | Filter by type: EMAIL, SMS, PUSH  |
| search    | string | ❌       | Search by template name           |
| tab       | string | ❌       | Tab filter: all, email, sms, push |

### Response

```json
{
  "result": {
    "data": [
      {
        "id": "lib_abc123",
        "name": "Welcome Email — Light Theme",
        "type": "EMAIL",
        "thumbnail": "https://s3.amazonaws.com/bucket/thumbnails/lib_abc123.png",
        "tags": ["welcome", "onboarding"],
        "createdAt": "2024-08-01T10:00:00.000Z",
        "updatedAt": "2024-09-15T14:00:00.000Z"
      }
    ],
    "message": "Library items fetched successfully",
    "status": 200,
    "totalCount": 34
  }
}
```

## Create Library Item

Create a new template.

**`POST /{locale}/api/library`**

### Request Body

| Field       | Type     | Required | Description                                   |
| ----------- | -------- | -------- | --------------------------------------------- |
| name        | string   | ✅       | Template display name                         |
| type        | string   | ✅       | Template type: EMAIL, SMS, PUSH               |
| htmlContent | string   | ❌       | Full HTML string (required for EMAIL)         |
| jsonContent | object   | ❌       | JSON design data (for drag-and-drop editors)  |
| smsContent  | string   | ❌       | Plain text SMS body (required for SMS)        |
| pushPayload | object   | ❌       | Push notification payload (required for PUSH) |
| tags        | string[] | ❌       | Tag labels                                    |

### Email Template Request

```json
{
  "name": "Welcome Email — Light Theme",
  "type": "EMAIL",
  "htmlContent": "<!DOCTYPE html><html>...</html>",
  "tags": ["welcome", "onboarding"]
}
```

### SMS Template Request

```json
{
  "name": "Order Confirmation SMS",
  "type": "SMS",
  "smsContent": "Hi {{first_name}}, your order #{{order_id}} has been confirmed! Track it here: {{tracking_url}}",
  "tags": ["transactional"]
}
```

### Push Template Request

```json
{
  "name": "Flash Sale Push",
  "type": "PUSH",
  "pushPayload": {
    "title": "Flash Sale — 50% Off",
    "body": "Limited time. Shop now.",
    "icon": "https://cdn.example.com/icon.png",
    "url": "https://example.com/sale"
  },
  "tags": ["promotions"]
}
```

### Response

```json
{
  "result": {
    "data": {
      "id": "lib_abc123",
      "name": "Welcome Email — Light Theme",
      "type": "EMAIL",
      "createdAt": "2025-02-20T09:00:00.000Z"
    },
    "message": "Template created successfully",
    "status": 201
  }
}
```

## Delete Library Items

Delete one or more templates.

**`DELETE /{locale}/api/library`**

### Request Body

| Field | Type     | Required | Description                         |
| ----- | -------- | -------- | ----------------------------------- |
| ids   | string[] | ✅       | Array of library item IDs to delete |

### Response

```json
{
  "result": {
    "data": { "deletedCount": 2 },
    "message": "Templates deleted successfully",
    "status": 200
  }
}
```

## Get Library Item

Retrieve full template details including content.

**`GET /{locale}/api/library/{libraryId}`**

### Path Parameters

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| libraryId | string | Library item ID |

### Response

```json
{
  "result": {
    "data": {
      "id": "lib_abc123",
      "name": "Welcome Email — Light Theme",
      "type": "EMAIL",
      "htmlContent": "<!DOCTYPE html><html>...</html>",
      "jsonContent": {},
      "tags": ["welcome"],
      "thumbnail": "https://s3.amazonaws.com/...",
      "createdAt": "2024-08-01T10:00:00.000Z",
      "updatedAt": "2024-09-15T14:00:00.000Z"
    },
    "message": "Template fetched successfully",
    "status": 200
  }
}
```

## HTML to Image (Thumbnail Generation)

Generate a thumbnail preview image from HTML content.

**`POST /{locale}/api/library/{libraryId}`** with `type: "HTML_TO_IMAGE"`

### Request Body

| Field | Type   | Required | Description                         |
| ----- | ------ | -------- | ----------------------------------- |
| type  | string | ✅       | Must be "HTML_TO_IMAGE"             |
| html  | string | ✅       | HTML string to render               |
| width | number | ❌       | Viewport width in px (default: 600) |

### Request

```json
{
  "type": "HTML_TO_IMAGE",
  "html": "<!DOCTYPE html><html>...</html>",
  "width": 600
}
```

### Response

```json
{
  "result": {
    "data": {
      "thumbnailUrl": "https://s3.amazonaws.com/bucket/thumbnails/lib_abc123.png"
    },
    "message": "Thumbnail generated successfully",
    "status": 200
  }
}
```

## Send Test Message

Send a test message to a specified email address or phone number.

**`PUT /{locale}/api/library/{libraryId}`**

### Request Body

| Field     | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| type      | string | ✅       | Must be "SEND_TEST"                      |
| channel   | string | ✅       | EMAIL or SMS                             |
| recipient | string | ✅       | Email address or phone number to send to |
| subject   | string | ❌       | Email subject (required for EMAIL)       |
| senderId  | string | ❌       | Integration sender ID to use             |

### Request

```json
{
  "type": "SEND_TEST",
  "channel": "EMAIL",
  "recipient": "dev@example.com",
  "subject": "Test: Welcome Email Template",
  "senderId": "int_sendgrid_01"
}
```

### Response

```json
{
  "result": {
    "data": {
      "sent": true,
      "recipient": "dev@example.com"
    },
    "message": "Test email sent successfully",
    "status": 200
  }
}
```

::: tip
Test sends are dispatched via **AWS Lambda** and use the same delivery pipeline as live campaigns to ensure accurate preview.
:::

## Library Item Object

| Field       | Type           | Description                    |
| ----------- | -------------- | ------------------------------ |
| id          | string         | Unique template ID             |
| name        | string         | Display name                   |
| type        | string         | EMAIL \| SMS \| PUSH           |
| htmlContent | string \| null | Full HTML string (email only)  |
| jsonContent | object \| null | Design editor JSON data        |
| smsContent  | string \| null | SMS body text                  |
| pushPayload | object \| null | Push notification payload      |
| thumbnail   | string \| null | Preview image URL              |
| tags        | string[]       | Tag labels                     |
| workspaceId | string         | Owning workspace ID            |
| createdAt   | string         | ISO 8601 creation timestamp    |
| updatedAt   | string         | ISO 8601 last update timestamp |
