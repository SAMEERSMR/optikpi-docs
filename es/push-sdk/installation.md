# Instalación

Esta guía te lleva paso a paso para integrar el OptiKPI Push SDK (`PushSDK`) en tu sitio web.

## Requisitos previos

- Un sitio web servido por **HTTPS** (o `localhost` para desarrollo)
- Tu **clave pública VAPID** (application server key) para web push
- La **URL del endpoint** del servidor push (p. ej. `https://push.optikpi.com`)

## Paso 1 — Añadir el Service Worker

Copia `optikpi-service-worker.js` en la **raíz** de tu servidor web (p. ej. `/optikpi-service-worker.js`).

::: warning Importante
El archivo del service worker **debe** servirse desde la ruta raíz `/optikpi-service-worker.js` (o la ruta que pases al constructor). Colocarlo en un subdirectorio limitará su alcance.
:::

```text
your-website/
  ├── index.html
  ├── optikpi-service-worker.js   ← root
  └── js/
      └── optikpi-push-sdk.js
```

## Paso 2 — Incluir el SDK

Añade el script del SDK antes de la etiqueta de cierre `</body>`:

```html
<script src="/js/optikpi-push-sdk.js"></script>
```

O desde un CDN:

```html
<script src="https://cdn.your-domain.com/optikpi-push-sdk.js"></script>
```

## Paso 3 — Inicializar

Crea una instancia de `PushSDK` con tu **clave push** y **endpoint**, y luego llama a `init()`:

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
`init()` solicitará el permiso de notificaciones de inmediato. Si prefieres mostrar el aviso en una acción del usuario (p. ej. clic en un botón), llama primero a `requestNotificationPermission()` en esa acción, luego `subscribeUser()` y `sendSubscriptionToServer(subscription)` cuando se conceda — o mantén un único `init()` si el aviso inmediato es aceptable.
:::

## Paso 4 — Registrar el token push al iniciar sesión

Después de que el usuario inicie sesión, asocia la suscripción actual al usuario y al workspace (cliente):

```javascript
function onLogin(userId, customerId) {
  window.optiKPIPushSDK.registerPushToken(userId, customerId);
}
```

## Paso 5 — Anular el token push al cerrar sesión

Cuando el usuario cierre sesión, desasocia la suscripción:

```javascript
function onLogout(userId, customerId) {
  window.optiKPIPushSDK.unRegisterPushToken(userId, customerId);
}
```

## Parámetros del constructor

| Parameter         | Type   | Required | Default                      | Description                        |
| ----------------- | ------ | -------- | ---------------------------- | ---------------------------------- |
| optiKPIPushKey    | string | ✅       | —                            | Clave pública VAPID (base64)       |
| originURL         | string | ❌       | "https://push.optikpi.com"   | URL base del servidor push         |
| serviceWorkerPath | string | ❌       | "/optikpi-service-worker.js" | Ruta al archivo del service worker |

## Verificar la instalación

Abre DevTools → Application → Service Workers. Deberías ver `optikpi-service-worker.js` registrado y en ejecución.
