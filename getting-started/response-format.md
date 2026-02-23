# Response Format

The **Data Pipeline Ingest API** returns a consistent shape for success and error. The SDK wraps this in a result object with `success` and either `data` or error details.

## Success response

When the ingest request is accepted, the API returns:

```json
{
  "message": "Success description",
  "recordIds": ["record-id-1", "record-id-2"],
  "count": 2
}
```

| Field     | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| message   | string   | Human-readable success message |
| recordIds | string[] | IDs of created/updated records |
| count     | number   | Number of records processed    |

## Error response

When the request is invalid or the server fails, the API returns:

```json
{
  "error": "Bad Request",
  "message": "Validation failed: account_id is required",
  "details": { "field": "account_id", "issue": "missing required field" }
}
```

| Field   | Type   | Description                      |
| ------- | ------ | -------------------------------- |
| error   | string | Machine-readable error code      |
| message | string | Human-readable error description |
| details | object | Optional; field-level validation |

## HTTP status codes

| Code | Meaning           | Action                         |
| ---- | ----------------- | ------------------------------ |
| 200  | Success           | Request processed              |
| 400  | Bad Request       | Check body and required fields |
| 401  | Unauthorized      | Verify token and signature     |
| 403  | Forbidden         | Token may be expired/invalid   |
| 404  | Not Found         | Check base URL and path        |
| 429  | Too Many Requests | Back off; respect rate limits  |
| 500  | Server Error      | Retry after a delay            |

## SDK result shape

The SDK does not expose the raw HTTP body directly. It returns an object:

- **On success:** `{ success: true, data: <API response> }` (or equivalent in Java/Python/PHP).
- **On failure:** `{ success: false, data?: ..., error?: ... }` with error details.

The SDK uses **retry with exponential backoff** for 5xx and 429. Do not retry 4xx without fixing the request.

## Rate limits

- **Customer and extended attributes:** 50 requests per second.
- **Event endpoints:** 250 requests per second.
- **Batch size:** Up to 500 records per batch request.
- **Window:** 1 minute. On limit, the API returns **429 Too Many Requests**.

For full endpoint list and batch payload keys, see the [Integration Guide](/data-pipeline-sdk/integration-guide).
