# Installation

This guide walks you through integrating the OptiKPI Push SDK (`PushSDK`) into your website.

## Prerequisites

- A website served over **HTTPS** (or `localhost` for development)
- Your **VAPID public key** (application server key) for web push
- The push server **endpoint URL** (e.g. `https://push.optikpi.com`)

## Step 1 — Add the Service Worker

Copy `optikpi-service-worker.js` to the **root** of your web server (e.g. `/optikpi-service-worker.js`).

::: warning Important
The service worker file **must** be served from the root path `/optikpi-service-worker.js` (or the path you pass to the constructor). Placing it in a subdirectory will limit its scope.
:::

```text
your-website/
  ├── index.html
  ├── optikpi-service-worker.js   ← root
  └── js/
      └── optikpi-push-sdk.js
```

## Step 2 — Include the SDK

Add the SDK script before the closing `</body>` tag:

```html
<script src="/js/optikpi-push-sdk.js"></script>
```

Or from a CDN:

```html
<script src="https://cdn.your-domain.com/optikpi-push-sdk.js"></script>
```

## Step 3 — Initialize

Create a `PushSDK` instance with your **push key** and **endpoint**, then call `init()`:

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const OPTIKPI_PUSH_KEY = "YOUR_VAPID_PUBLIC_KEY_BASE64";
    const OPTIKPI_PUSH_END_POINT = "https://push.optikpi.com";
    window.optiKPIPushSDK = new PushSDK(
      OPTIKPI_PUSH_KEY,
      OPTIKPI_PUSH_END_POINT,
      "/optikpi-service-worker.js",
    );
    window.optiKPIPushSDK.init();
  });
</script>
```

::: tip
`init()` will request notification permission immediately. If you prefer to prompt on a user action (e.g. button click), call `requestNotificationPermission()` first on that action, then `subscribeUser()` and `sendSubscriptionToServer(subscription)` when granted — or keep a single `init()` if immediate prompt is acceptable.
:::

## Step 4 — Register Push Token on Login

After the user logs in, associate the current subscription with the user and workspace (customer):

```javascript
function onLogin(userId, customerId) {
  window.optiKPIPushSDK.registerPushToken(userId, customerId);
}
```

## Step 5 — Unregister Push Token on Logout

When the user logs out, disassociate the subscription:

```javascript
function onLogout(userId, customerId) {
  window.optiKPIPushSDK.unRegisterPushToken(userId, customerId);
}
```

## Constructor Parameters

| Parameter           | Type     | Required | Default                        | Description                     |
| ------------------- | -------- | -------- | ------------------------------ | ------------------------------- |
| `optiKPIPushKey`    | `string` | ✅       | —                              | VAPID/public key (base64)       |
| `originURL`         | `string` | ❌       | `"https://push.optikpi.com"`   | Push server base URL            |
| `serviceWorkerPath` | `string` | ❌       | `"/optikpi-service-worker.js"` | Path to the service worker file |

## Verifying Installation

Open DevTools → Application → Service Workers. You should see `optikpi-service-worker.js` registered and running.
