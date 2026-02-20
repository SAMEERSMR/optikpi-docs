# Push SDK Overview

The **OptikPI Push SDK** (`optikpi-push-sdk.js`) is a vanilla JavaScript library that enables web push notification delivery using the **Web Push API** and **Service Workers**. It is designed to run in any modern browser without a framework dependency.

## How It Works

```flow
  Browser                     OptikPI Server
  ───────                     ──────────────
  SDK Init
     │
     ├─► Request Notification Permission
     │       │
     │       └─► granted ──► Subscribe to Push Manager
     │                            │
     │                            └─► Send subscription to OptikPI
     │                                  (endpoint + keys saved)
     │
  User visits page
     │
     ├─► Fetch pending messages from server
     │       │
     │       └─► Display web push notification via Service Worker
     │
  Service Worker (background)
     ├─► Receives push event ──► show notification
     └─► Notification click ──► open URL / track event
```

## Versions

| Version | Technology                     | File                          | Status        |
| ------- | ------------------------------ | ----------------------------- | ------------- |
| Current | Web Push API + Service Worker  | `optikpi-push-sdk.js`         | ✅ Active     |
| Legacy  | Firebase Cloud Messaging (FCM) | `firebase-message-tracker.js` | ⚠️ Deprecated |

The current SDK does **not** depend on Firebase. The legacy FCM integration is maintained for backward compatibility only.

## Browser Compatibility

| Browser     | Support             |
| ----------- | ------------------- |
| Chrome 50+  | ✅ Full             |
| Firefox 44+ | ✅ Full             |
| Edge 17+    | ✅ Full             |
| Safari 16+  | ✅ Full (macOS/iOS) |
| Opera 37+   | ✅ Full             |

::: warning
Push notifications require a **secure context (HTTPS)** or `localhost`. HTTP websites cannot use the Push API.
:::

## Key Features

- **Automatic permission request** with user-first prompting
- **VAPID authentication** for secure server-to-browser push
- **Automatic re-subscription** if push subscription expires
- **Message inbox** — fetches undelivered messages on page load
- **Click tracking** — records notification clicks via postMessage
- **Custom data payloads** — supports title, body, icon, badge, URL, image
- **Service Worker registration** — manages `optikpi-service-worker.js` lifecycle

## Quick Start

```html
<!-- 1. Include the SDK -->
<script src="https://cdn.your-domain.com/optikpi-push-sdk.js"></script>

<!-- 2. Initialize -->
<script>
  const push = new OptikpiPush({
    workspaceId: 'ws_abc123',
    apiUrl: 'https://your-optikpi-instance.com',
    vapidPublicKey: 'YOUR_VAPID_PUBLIC_KEY',
    serviceWorkerPath: '/optikpi-service-worker.js'
  });

  push.init();
</script>
```

- [Installation Guide →](/push-sdk/installation)
- [API Reference →](/push-sdk/api-reference)
- [Service Worker →](/push-sdk/service-worker)
