# Resumen del Push SDK

El **OptiKPI Push SDK** (`optikpi-push-sdk.js`) es una librería JavaScript vanilla que permite la entrega de notificaciones push web mediante la **Web Push API** y los **Service Workers**. Expone una clase **`PushSDK`** y está diseñado para ejecutarse en cualquier navegador moderno sin dependencia de un framework.

## Cómo funciona

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

El SDK utiliza una clase **`PushSDK`** con tres argumentos:

| Argument          | Type   | Required | Default                      | Description                            |
| ----------------- | ------ | -------- | ---------------------------- | -------------------------------------- |
| optiKPIPushKey    | string | ✅       | —                            | Clave pública VAPID (base64) para push |
| originURL         | string | ❌       | "https://push.optikpi.com"   | URL base del servidor push             |
| serviceWorkerPath | string | ❌       | "/optikpi-service-worker.js" | Ruta al archivo del service worker     |

## Características principales

- **Permiso y suscripción en init** — `init()` solicita permiso de notificaciones, luego suscribe y envía la suscripción al servidor.
- **Clave VAPID / application server key** — Utiliza la clave proporcionada para una suscripción push segura.
- **Registro del Service Worker** — Registra y utiliza `optikpi-service-worker.js` para eventos push.
- **Asociar / desasociar usuario** — `registerPushToken(userId, customerId)` al iniciar sesión y `unRegisterPushToken(userId, customerId)` al cerrar sesión para vincular la suscripción a un usuario y workspace.

## Inicio rápido

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

## Compatibilidad de navegadores

| Browser     | Support             |
| ----------- | ------------------- |
| Chrome 50+  | ✅ Full             |
| Firefox 44+ | ✅ Full             |
| Edge 17+    | ✅ Full             |
| Safari 16+  | ✅ Full (macOS/iOS) |
| Opera 37+   | ✅ Full             |

::: warning
Las notificaciones push requieren un **contexto seguro (HTTPS)** o `localhost`. Los sitios HTTP no pueden usar la Push API.
:::

- [Guía de instalación →](/es/push-sdk/installation)
- [Referencia de API →](/es/push-sdk/api-reference)
- [Service Worker →](/es/push-sdk/service-worker)
