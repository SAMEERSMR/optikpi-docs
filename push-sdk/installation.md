# Installation

This guide walks you through integrating the OptikPI Push SDK into your website.

## Prerequisites

- A website served over **HTTPS** (or `localhost` for development)
- An OptikPI workspace with push notifications enabled
- Your workspace's **VAPID Public Key** (available in workspace settings)

## Step 1 — Add the Service Worker

Copy `optikpi-service-worker.js` to the **root** of your web server (e.g. `/public/optikpi-service-worker.js`).

::: warning Important
The service worker file **must** be served from the root path `/optikpi-service-worker.js`. Placing it in a subdirectory like `/js/` will limit its scope and prevent it from intercepting push events for your entire domain.
:::

```path
your-website/
  ├── index.html
  ├── optikpi-service-worker.js   ← must be here (root)
  └── js/
      └── optikpi-push-sdk.js
```

## Step 2 — Include the SDK

Add the SDK script to your HTML. Place it before the closing `</body>` tag:

```html
<script src="/js/optikpi-push-sdk.js"></script>
```

Or load it from a CDN:

```html
<script src="https://cdn.your-domain.com/optikpi-push-sdk.js"></script>
```

## Step 3 — Initialize

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const push = new OptikpiPush({
      workspaceId: 'ws_abc123', // your OptikPI workspace ID
      apiUrl: 'https://api.optikpi.com', // OptikPI backend base URL
      vapidPublicKey: 'BHn...', // VAPID public key from workspace settings
      serviceWorkerPath: '/optikpi-service-worker.js',
      autoRequestPermission: false // set true to auto-prompt on init
    });

    push.init();
  });
</script>
```

::: tip Best Practice
Set `autoRequestPermission: false` and trigger permission requests on user actions (button clicks) for better UX and higher opt-in rates.
:::

## Step 4 — Request Permission

By default, permission is **not** auto-requested. Trigger it on a user action (button click, etc.) for better UX and higher opt-in rates:

```javascript
document.getElementById('subscribe-btn').addEventListener('click', async () => {
  const result = await push.requestPermission();

  if (result === 'granted') {
    console.log('User subscribed to push notifications');
  } else if (result === 'denied') {
    console.log('User denied push notifications');
  }
});
```

## Step 5 — Identify the User

To associate push subscriptions with a specific contact in OptikPI, call `identify()` after permission is granted:

```javascript
push.identify({
  email: 'user@example.com',
  customerId: 'cust_abc123', // optional — your internal customer ID
  workspaceId: 'ws_abc123'
});
```

## Configuration Options

| Option                  | Type      | Required | Default                      | Description                            |
| ----------------------- | --------- | -------- | ---------------------------- | -------------------------------------- |
| `workspaceId`           | `string`  | ✅       | —                            | Your OptikPI workspace ID              |
| `apiUrl`                | `string`  | ✅       | —                            | OptikPI backend base URL               |
| `vapidPublicKey`        | `string`  | ✅       | —                            | VAPID public key for push auth         |
| `serviceWorkerPath`     | `string`  | ✅       | `/optikpi-service-worker.js` | Path to the service worker file        |
| `autoRequestPermission` | `boolean` | ❌       | `false`                      | Auto-prompt for permission on `init()` |
| `fetchOnLoad`           | `boolean` | ❌       | `true`                       | Fetch pending messages on page load    |
| `debug`                 | `boolean` | ❌       | `false`                      | Enable verbose console logging         |

## Verifying Installation

Open your browser's DevTools → Application → Service Workers. You should see `optikpi-service-worker.js` registered and running:

```text
Service Worker  Status: activated and running
Scope:          https://your-website.com/
Source:         /optikpi-service-worker.js
```

::: tip
Use `push.getSubscription()` to check the current push subscription status programmatically.
:::
