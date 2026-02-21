# Service Worker

`optikpi-service-worker.js` maneja el evento **push** y muestra las notificaciones. Debe servirse en la ruta que pasas a `PushSDK` (normalmente la raíz: `/optikpi-service-worker.js`).

## Responsabilidades

| Event | Description                                                                         |
| ----- | ----------------------------------------------------------------------------------- |
| push  | Recibe los payloads push del servicio push del navegador y muestra una notificación |

::: info
El service worker actual **no** implementa `install`, `activate` ni `notificationclick`. El comportamiento al hacer clic (abrir URL, registrar clic) no está implementado en el archivo distribuido; el manejador `notificationclick` está comentado.
:::

## Evento Push

Cuando llega un mensaje push, el service worker parsea el payload como JSON y llama a `showNotification`:

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

## Esquema del payload de notificación

El payload push del servidor debe ser un objeto JSON con los siguientes campos (todos opcionales salvo que normalmente quieras `title` y/o `body`):

| Field | Type   | Description                                                  |
| ----- | ------ | ------------------------------------------------------------ |
| title | string | Título de la notificación (por defecto: "Push Notification") |
| body  | string | Texto del cuerpo                                             |
| icon  | string | URL de la imagen del icono                                   |
| badge | string | URL de la imagen del badge                                   |
| image | string | URL de la imagen grande                                      |
| data  | object | Datos personalizados (se pasan a options.data)               |
| lang  | string | Idioma de la notificación                                    |

## Depuración

1. Abre **DevTools → Application → Service Workers**
2. Activa **Update on reload** durante el desarrollo
3. Haz clic en **Inspect** junto al service worker para ver su consola

::: warning
Los service workers se actualizan con pereza. Durante el desarrollo, usa **Update on reload** en DevTools para activar la última versión rápidamente.
:::
