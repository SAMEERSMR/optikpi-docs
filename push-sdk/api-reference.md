# Push SDK API Reference

Complete reference for the **`PushSDK`** class (optikpi-push-sdk.js).

## Constructor

```javascript
const sdk = new PushSDK(optiKPIPushKey, originURL, serviceWorkerPath);
```

| Parameter           | Type     | Required | Default                        | Description                     |
| ------------------- | -------- | -------- | ------------------------------ | ------------------------------- |
| `optiKPIPushKey`    | `string` | ✅       | —                              | VAPID/public key (base64)       |
| `originURL`         | `string` | ❌       | `"https://push.optikpi.com"`   | Push server base URL            |
| `serviceWorkerPath` | `string` | ❌       | `"/optikpi-service-worker.js"` | Path to the service worker file |

## Methods

### `requestNotificationPermission()`

Prompts the user to allow notifications.

```javascript
const granted = await sdk.requestNotificationPermission();
```

**Returns:** `Promise<boolean>` — `true` if permission is `"granted"`, otherwise `false`.

### `registerServiceWorker()`

Registers the service worker at `serviceWorkerPath`.

```javascript
const registration = await sdk.registerServiceWorker();
```

**Returns:** `Promise<ServiceWorkerRegistration>`

**Throws:** If the browser does not support service workers or registration fails.

### `subscribeUser()`

Registers the service worker and subscribes to push via `PushManager` (uses `optiKPIPushKey` as `applicationServerKey`).

```javascript
const subscription = await sdk.subscribeUser();
```

**Returns:** `Promise<PushSubscription>`

**Throws:** If subscription fails.

### `sendSubscriptionToServer(subscription)`

Sends the push subscription to the OptikPI push server.

```javascript
await sdk.sendSubscriptionToServer(subscription);
```

**Parameters**

| Parameter      | Type               | Description            |
| -------------- | ------------------ | ---------------------- |
| `subscription` | `PushSubscription` | From `subscribeUser()` |

**Request:** `POST {originURL}/storeSubscription` with body = subscription object (JSON).

**Returns:** `Promise<Response.json()>`

**Throws:** If the server response is not OK.

### `init()`

Convenience method: requests permission, then if granted subscribes the user and sends the subscription to the server.

```javascript
await sdk.init();
```

**Returns:** `Promise<void>`

No throw; errors are logged to console. After `init()`, `sdk.subscription` holds the current subscription (if granted).

### `registerPushToken(userId, customerId)`

Associates the current subscription with a user and workspace (e.g. call after login).

```javascript
await sdk.registerPushToken(userId, customerId);
```

**Parameters**

| Parameter    | Type     | Description                                           |
| ------------ | -------- | ----------------------------------------------------- |
| `userId`     | `string` | User ID                                               |
| `customerId` | `string` | Workspace/customer ID (sent as `workspaceId` in body) |

**Request:** `POST {originURL}/associatePlayer` with body:

```json
{
  "userId": "usr_abc123",
  "subscription": {
    /* PushSubscription */
  },
  "workspaceId": "ws_xyz789"
}
```

**Returns:** `Promise<Response.json()>`

**Throws:** `Error("Failed to associatePlayer")` if the request fails.

### `unRegisterPushToken(userId, customerId)`

Disassociates the current subscription from the user/workspace (e.g. call on logout).

```javascript
await sdk.unRegisterPushToken(userId, customerId);
```

**Parameters:** Same as `registerPushToken(userId, customerId)`.

**Request:** `POST {originURL}/disassociatePlayer` with the same body shape as `registerPushToken`.

**Returns:** `Promise<Response.json()>`

**Throws:** `Error("Failed to disassociatePlayer")` if the request fails.

## Server Endpoints (used by the SDK)

| Method | Path                  | Body                                                               |
| ------ | --------------------- | ------------------------------------------------------------------ |
| POST   | `/storeSubscription`  | Subscription object (from `PushSubscription`)                      |
| POST   | `/associatePlayer`    | `{ userId, subscription, workspaceId }` (workspaceId = customerId) |
| POST   | `/disassociatePlayer` | `{ userId, subscription, workspaceId }`                            |

All requests use `Content-Type: application/json`.
