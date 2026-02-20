# Service Worker

`optikpi-service-worker.js` handles background push events, notification display, and click tracking. It must be deployed at the **root** of your web server.

## Responsibilities

| Event               | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `install`           | Activates the service worker immediately on install                          |
| `activate`          | Claims all open clients so the SW takes effect without a page reload         |
| `push`              | Receives push payloads from the browser push service and shows notifications |
| `notificationclick` | Handles notification clicks — opens the target URL and tracks the click      |
| `message`           | Receives messages from the main page (e.g. track-click commands)             |

## Push Event

When a push message arrives from the server, the service worker parses the payload and calls `showNotification()`:

```javascript
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/badge-72.png',
    image: data.image,
    data: {
      url: data.url || '/',
      messageId: data.id
    },
    actions: data.actions || []
  };

  event.waitUntil(self.registration.showNotification(data.title || 'OptikPI', options));
});
```

## Notification Click Event

When a user clicks a notification, the service worker:

1. Closes the notification
2. Focuses an existing open tab at the target URL (if one exists)
3. Opens a new tab if no matching tab is found
4. Posts a `track-click` message back to the SDK

```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';
  const messageId = event.notification.data?.messageId;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          client.postMessage({ type: 'track-click', messageId });
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl).then((client) => {
          if (client) client.postMessage({ type: 'track-click', messageId });
        });
      }
    })
  );
});
```

## Notification Payload Schema

The push payload sent from the OptikPI server must be a JSON object:

```json
{
  "id": "msg_abc123",
  "title": "Flash Sale — 50% Off Today Only",
  "body": "Use code FLASH50 at checkout. Limited time offer.",
  "icon": "https://cdn.example.com/icon-192.png",
  "badge": "https://cdn.example.com/badge-72.png",
  "image": "https://cdn.example.com/banner.jpg",
  "url": "https://example.com/sale",
  "actions": [
    { "action": "open", "title": "Shop Now" },
    { "action": "dismiss", "title": "Dismiss" }
  ]
}
```

| Field     | Type     | Required | Description                                   |
| --------- | -------- | -------- | --------------------------------------------- |
| `id`      | `string` | ✅       | Unique message identifier for click tracking  |
| `title`   | `string` | ✅       | Notification title                            |
| `body`    | `string` | ✅       | Notification body text                        |
| `icon`    | `string` | ❌       | Icon image URL (recommended: 192×192 PNG)     |
| `badge`   | `string` | ❌       | Monochrome badge URL (recommended: 72×72 PNG) |
| `image`   | `string` | ❌       | Large hero image URL                          |
| `url`     | `string` | ❌       | URL to open on click (defaults to `/`)        |
| `actions` | `array`  | ❌       | Up to 2 action buttons                        |

## Debugging

Enable service worker debug logging in Chrome DevTools:

1. Open **DevTools → Application → Service Workers**
2. Check **"Update on reload"** during development
3. Click **"Inspect"** next to your service worker to open its DevTools console

You can also test push events directly from the DevTools panel:

```flow
Application → Service Workers → Push (text field) → Push button
```

::: warning
Service workers are updated lazily by the browser. During development, check **"Update on reload"** in DevTools to force the latest version to activate.
:::

## Legacy FCM Integration

The legacy `firebase-message-tracker.js` uses **Firebase Cloud Messaging (FCM)** as the push transport instead of the native Web Push API. It requires a Firebase project and `firebase-messaging-sw.js` service worker.

::: danger Deprecated
The FCM integration is deprecated and maintained for backward compatibility only. All new integrations should use the current Web Push API-based SDK described in this documentation.
:::
