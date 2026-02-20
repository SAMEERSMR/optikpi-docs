# Push SDK API Reference

Complete reference for all methods and events exposed by `OptikpiPush`.

## Constructor

```javascript
const push = new OptikpiPush(config);
```

| Parameter | Type                | Description                                                                             |
| --------- | ------------------- | --------------------------------------------------------------------------------------- |
| `config`  | `OptikpiPushConfig` | Configuration object (see [Installation](/push-sdk/installation#configuration-options)) |

## Methods

### `init()`

Initializes the SDK. Registers the service worker, checks for an existing push subscription, and optionally fetches pending messages.

```javascript
push.init();
```

**Returns:** `Promise<void>`

If `autoRequestPermission: true` is set in the config, this will also trigger the browser permission prompt.

### `requestPermission()`

Prompts the user to allow push notifications. Should be called in response to a user gesture (button click, etc.).

```javascript
const status = await push.requestPermission();
```

**Returns:** `Promise<'granted' | 'denied' | 'default'>`

```javascript
const status = await push.requestPermission();

switch (status) {
  case 'granted':
    console.log('Subscribed!');
    break;
  case 'denied':
    console.warn('Notifications blocked by user.');
    break;
  case 'default':
    console.log('User dismissed the prompt.');
    break;
}
```

### `identify(user)`

Associates the current browser's push subscription with a user/contact in OptikPI.

```javascript
push.identify({
  email: 'user@example.com',
  customerId: 'cust_abc123'
});
```

**Parameters**

| Field         | Type     | Required | Description                           |
| ------------- | -------- | -------- | ------------------------------------- |
| `email`       | `string` | ✅       | User's email address                  |
| `customerId`  | `string` | ❌       | Your internal customer/user ID        |
| `workspaceId` | `string` | ❌       | Overrides the workspace set in config |

**Returns:** `Promise<void>`

### `getSubscription()`

Returns the current browser push subscription object, or `null` if not subscribed.

```javascript
const subscription = await push.getSubscription();
```

**Returns:** `Promise<PushSubscription | null>`

```javascript
const sub = await push.getSubscription();

if (sub) {
  console.log('Endpoint:', sub.endpoint);
  console.log('Keys:', sub.toJSON().keys);
} else {
  console.log('Not subscribed');
}
```

### `unsubscribe()`

Unsubscribes the current browser from push notifications and removes the subscription from OptikPI.

```javascript
await push.unsubscribe();
```

**Returns:** `Promise<boolean>` — `true` if successfully unsubscribed, `false` otherwise.

### `fetchMessages()`

Manually fetches pending push messages for the current subscription from the OptikPI server.

```javascript
const messages = await push.fetchMessages();
```

**Returns:** `Promise<PushMessage[]>`

**PushMessage Object**

| Field    | Type                  | Description                       |
| -------- | --------------------- | --------------------------------- |
| `id`     | `string`              | Unique message ID                 |
| `title`  | `string`              | Notification title                |
| `body`   | `string`              | Notification body text            |
| `icon`   | `string \| undefined` | URL to notification icon          |
| `badge`  | `string \| undefined` | URL to badge image                |
| `image`  | `string \| undefined` | URL to hero image                 |
| `url`    | `string \| undefined` | URL to open on notification click |
| `data`   | `object \| undefined` | Custom key-value payload          |
| `sentAt` | `string`              | ISO 8601 timestamp                |

### `trackClick(messageId)`

Manually records a click event for a given notification message ID.

```javascript
push.trackClick('msg_abc123');
```

**Parameters**

| Parameter   | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `messageId` | `string` | The message ID to record a click for |

**Returns:** `Promise<void>`

## Events

Listen to SDK events using the `on()` method:

```javascript
push.on('subscribed', (subscription) => {
  console.log('New subscription:', subscription.endpoint);
});

push.on('message', (message) => {
  console.log('New push message:', message.title);
});

push.on('error', (error) => {
  console.error('Push SDK error:', error.message);
});
```

| Event               | Payload            | Description                                    |
| ------------------- | ------------------ | ---------------------------------------------- |
| `subscribed`        | `PushSubscription` | Fired when user successfully subscribes        |
| `unsubscribed`      | `void`             | Fired when user unsubscribes                   |
| `message`           | `PushMessage`      | Fired when a new message is received           |
| `permission_denied` | `void`             | Fired when user denies notification permission |
| `error`             | `Error`            | Fired on any SDK error                         |

## Subscription Payload (Sent to Server)

When a user subscribes, the SDK sends this payload to the OptikPI backend:

```json
{
  "workspaceId": "ws_abc123",
  "email": "user@example.com",
  "customerId": "cust_xyz789",
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "expirationTime": null,
    "keys": {
      "p256dh": "BHn...",
      "auth": "abc..."
    }
  },
  "userAgent": "Mozilla/5.0...",
  "subscribedAt": "2025-02-20T09:00:00.000Z"
}
```
