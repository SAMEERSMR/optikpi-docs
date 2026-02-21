# Service Worker

`optikpi-service-worker.js` handles the **push** event and displays notifications. It must be served at the path you pass to `PushSDK` (typically the root: `/optikpi-service-worker.js`).

## Responsibilities

| Event | Description                                                                   |
| ----- | ----------------------------------------------------------------------------- |
| push  | Receives push payloads from the browser push service and shows a notification |

::: info
The current service worker does **not** implement `install`, `activate`, or `notificationclick`. Click behavior (open URL, track click) is not implemented in the shipped file; the `notificationclick` handler is commented out.
:::

## Push Event

When a push message arrives, the service worker parses the payload as JSON and calls `showNotification`:

```javascript
self.addEventListener("push", function (event) {
  const notificationData = event.data.json();
  const title = notificationData?.title || "Push Notification";
  const options = {
    badge: notificationData?.badge,
    body: notificationData?.body,
    data: notificationData?.data,
    icon: notificationData?.icon,
    image: notificationData?.image,
    title: notificationData?.title,
    lang: notificationData?.lang,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
```

## Notification Payload Schema

The push payload from the server should be a JSON object with the following fields (all optional except you typically want `title` and/or `body`):

| Field | Type   | Description                                       |
| ----- | ------ | ------------------------------------------------- |
| title | string | Notification title (default: "Push Notification") |
| body  | string | Body text                                         |
| icon  | string | Icon image URL                                    |
| badge | string | Badge image URL                                   |
| image | string | Large image URL                                   |
| data  | object | Custom data (passed to options.data)              |
| lang  | string | Language for the notification                     |

## Debugging

1. Open **DevTools → Application → Service Workers**
2. Check **Update on reload** during development
3. Click **Inspect** next to the service worker to see its console

::: warning
Service workers update lazily. During development, use **Update on reload** in DevTools to activate the latest version quickly.
:::
