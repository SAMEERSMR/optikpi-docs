# Referencia de API del Push SDK

Referencia completa de la clase **`PushSDK`** (optikpi-push-sdk.js).

## Constructor

```javascript
const sdk = new PushSDK(optiKPIPushKey, originURL, serviceWorkerPath);
```

| Parameter         | Type   | Required | Default                      | Description                        |
| ----------------- | ------ | -------- | ---------------------------- | ---------------------------------- |
| optiKPIPushKey    | string | ✅       | —                            | Clave pública VAPID (base64)       |
| originURL         | string | ❌       | "https://push.optikpi.com"   | URL base del servidor push         |
| serviceWorkerPath | string | ❌       | "/optikpi-service-worker.js" | Ruta al archivo del service worker |

## Métodos

### `requestNotificationPermission()`

Solicita al usuario permiso para mostrar notificaciones.

```javascript
const granted = await sdk.requestNotificationPermission();
```

**Devuelve:** `Promise<boolean>` — `true` si el permiso es `"granted"`, en caso contrario `false`.

### `registerServiceWorker()`

Registra el service worker en `serviceWorkerPath`.

```javascript
const registration = await sdk.registerServiceWorker();
```

**Devuelve:** `Promise<ServiceWorkerRegistration>`

**Lanza:** Si el navegador no admite service workers o el registro falla.

### `subscribeUser()`

Registra el service worker y suscribe a push mediante `PushManager` (usa `optiKPIPushKey` como `applicationServerKey`).

```javascript
const subscription = await sdk.subscribeUser();
```

**Devuelve:** `Promise<PushSubscription>`

**Lanza:** Si la suscripción falla.

### `sendSubscriptionToServer(subscription)`

Envía la suscripción push al servidor push de OptiKPI.

```javascript
await sdk.sendSubscriptionToServer(subscription);
```

**Parámetros**

| Parameter    | Type             | Description        |
| ------------ | ---------------- | ------------------ |
| subscription | PushSubscription | De subscribeUser() |

**Petición:** `POST {originURL}/storeSubscription` con body = objeto de suscripción (JSON).

**Devuelve:** `Promise<Response.json()>`

**Lanza:** Si la respuesta del servidor no es OK.

### `init()`

Método de conveniencia: solicita permiso y, si se concede, suscribe al usuario y envía la suscripción al servidor.

```javascript
await sdk.init();
```

**Devuelve:** `Promise<void>`

No lanza; los errores se registran en consola. Tras `init()`, `sdk.subscription` contiene la suscripción actual (si se concedió).

### `registerPushToken(userId, customerId)`

Asocia la suscripción actual a un usuario y workspace (p. ej. llamar tras el login).

```javascript
await sdk.registerPushToken(userId, customerId);
```

**Parámetros**

| Parameter  | Type   | Description                                                    |
| ---------- | ------ | -------------------------------------------------------------- |
| userId     | string | ID de usuario                                                  |
| customerId | string | ID de workspace/cliente (se envía como workspaceId en el body) |

**Petición:** `POST {originURL}/associatePlayer` con body:

```json
{
  "userId": "usr_abc123",
  "subscription": {
    /* PushSubscription */
  },
  "workspaceId": "ws_xyz789"
}
```

**Devuelve:** `Promise<Response.json()>`

**Lanza:** `Error("Failed to associatePlayer")` si la petición falla.

### `unRegisterPushToken(userId, customerId)`

Desasocia la suscripción actual del usuario/workspace (p. ej. llamar al cerrar sesión).

```javascript
await sdk.unRegisterPushToken(userId, customerId);
```

**Parámetros:** Igual que `registerPushToken(userId, customerId)`.

**Petición:** `POST {originURL}/disassociatePlayer` con la misma forma de body que `registerPushToken`.

**Devuelve:** `Promise<Response.json()>`

**Lanza:** `Error("Failed to disassociatePlayer")` si la petición falla.

## Endpoints del servidor (usados por el SDK)

| Method | Path                  | Body                                                               |
| ------ | --------------------- | ------------------------------------------------------------------ |
| POST   | `/storeSubscription`  | Objeto de suscripción (de `PushSubscription`)                      |
| POST   | `/associatePlayer`    | `{ userId, subscription, workspaceId }` (workspaceId = customerId) |
| POST   | `/disassociatePlayer` | `{ userId, subscription, workspaceId }`                            |

Todas las peticiones usan `Content-Type: application/json`.
