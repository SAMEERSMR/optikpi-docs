# Push SDK Overview

The **OptiKPI Push SDK** (`optikpi-push-sdk.js`) is a vanilla JavaScript library that enables web push notification delivery using the **Web Push API** and **Service Workers**. It exposes a **`PushSDK`** class and is designed to run in any modern browser without a framework dependency.

## How It Works

```text
  Browser                     OptiKPI Push Server
  ───────                     ───────────────────
  new PushSDK(key, endpoint)
     │
  init()
     ├─► requestNotificationPermission()
     │       │
     │       └─► granted ──► registerServiceWorker()
     │                            │
     │                            └─► subscribeUser() (PushManager)
     │                                      │
     │                                      └─► sendSubscriptionToServer(subscription)
     │                                                POST {originURL}/storeSubscription
     │
  On user login
     └─► registerPushToken(userId, customerId)
               POST {originURL}/associatePlayer
               body: { userId, subscription, workspaceId: customerId }

  On user logout
     └─► unRegisterPushToken(userId, customerId)
               POST {originURL}/disassociatePlayer
               body: { userId, subscription, workspaceId: customerId }

  Service Worker (background)
     └─► push event ──► showNotification(title, options)
```

## Constructor

The SDK uses a **`PushSDK`** class with three arguments:

| Argument            | Type   | Required | Default                        | Description                        |
| ------------------- | ------ | -------- | ------------------------------ | ---------------------------------- |
| optiKPIPushKey      | string | ✅       | —                              | VAPID/public key (base64) for push |
| originURL           | string | ❌       | "https://push.optikpi.com"     | Push server base URL               |
| serviceWorkerPath   | string | ❌       | "/optikpi-service-worker.js"   | Path to the service worker file    |

## Key Features

- **Permission and subscribe on init** — `init()` requests notification permission, then subscribes and sends the subscription to the server.
- **VAPID / application server key** — Uses the provided key for secure push subscription.
- **Service Worker registration** — Registers and uses `optikpi-service-worker.js` for push events.
- **Associate / disassociate user** — `registerPushToken(userId, customerId)` on login and `unRegisterPushToken(userId, customerId)` on logout to link the subscription to a user and workspace.

## Quick Start

```html
<script src="/optikpi-push-sdk.js"></script>
<script>
  const OPTIKPI_PUSH_KEY = "YOUR_VAPID_PUBLIC_KEY";
  const OPTIKPI_PUSH_END_POINT = "https://push.optikpi.com";
  window.optiKPIPushSDK = new PushSDK(OPTIKPI_PUSH_KEY, OPTIKPI_PUSH_END_POINT);
  window.optiKPIPushSDK.init();

  function onLogin(userId, customerId) {
    window.optiKPIPushSDK.registerPushToken(userId, customerId);
  }
  function onLogout(userId, customerId) {
    window.optiKPIPushSDK.unRegisterPushToken(userId, customerId);
  }
</script>
```

## Browser Compatibility

| Browser     | Support             |
| ----------- | ------------------- |
| Chrome 50+  | ✅ Full             |
| Firefox 44+ | ✅ Full             |
| Edge 17+    | ✅ Full             |
| Safari 16+  | ✅ Full (macOS/iOS) |
| Opera 37+   | ✅ Full             |

::: warning
Push notifications require a **secure context (HTTPS)** or `localhost`. HTTP sites cannot use the Push API.
:::

- [Installation Guide →](/push-sdk/installation)
- [API Reference →](/push-sdk/api-reference)
- [Service Worker →](/push-sdk/service-worker)
