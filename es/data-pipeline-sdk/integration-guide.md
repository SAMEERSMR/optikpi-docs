# Guía de integración

Esta página resume cómo funcionan la API de ingesta del Data Pipeline y los SDKs oficiales: autenticación, endpoints, modelos de datos, manejo de errores, límites de tasa y buenas prácticas.

## Autenticación

La API usa **seguridad de doble capa**. El SDK la gestiona por ti.

1. **Token**: Se envía en la cabecera `x-optikpi-token`.
2. **Firma HMAC**: Cada petición se firma con HMAC-SHA256 usando derivación de clave HKDF.
3. **Cabeceras**: El SDK añade `x-optikpi-account-id`, `x-optikpi-workspace-id` y las cabeceras de firma.

Necesitas (de tu gestor de cuenta):

- **Token de autenticación**
- **Account ID** y **Workspace ID**
- **URL del API Gateway** (URL base para ingesta)

::: tip
Proporciónalos una vez al inicializar el SDK; no hace falta código de criptografía por tu parte.
:::

## Endpoints de la API

**URL base:** `https://your-api-gateway-url/apigw/ingest`

| Endpoint                  | Method | Description                   | Rate limit  |
| ------------------------- | ------ | ----------------------------- | ----------- |
| `/customers`              | POST   | Datos de perfil de cliente    | 50 req/sec  |
| `/events/account`         | POST   | Eventos de cuenta             | 250 req/sec |
| `/events/deposit`         | POST   | Eventos de depósito           | 250 req/sec |
| `/events/withdraw`        | POST   | Eventos de retiro             | 250 req/sec |
| `/events/gaming-activity` | POST   | Eventos de actividad de juego | 250 req/sec |
| `/events/wallet-balance`  | POST   | Eventos de saldo de cartera   | 250 req/sec |
| `/events/refer-friend`    | POST   | Eventos de referir amigo      | 250 req/sec |
| `/extattributes`          | POST   | Atributos extendidos          | 50 req/sec  |

### Cabeceras requeridas (el SDK las establece)

| Header                 | Description                      |
| ---------------------- | -------------------------------- |
| x-optikpi-account-id   | Identificador de tu cuenta       |
| x-optikpi-workspace-id | Identificador de tu workspace    |
| x-optikpi-token        | Token de autenticación           |
| Signature headers      | HMAC/HKDF (generadas por el SDK) |

### Respuesta de éxito

```json
{
  "message": "Success description",
  "recordIds": ["record-id-1", "record-id-2"],
  "count": 2
}
```

### Claves del payload de lote

Al usar `sendBatch` (o equivalente), el payload usa las claves siguientes. Cada clave es opcional; omítela o pasa un array vacío si no tienes datos. **Máximo 500 registros** por petición de lote.

| Key                 | Description                                  |
| ------------------- | -------------------------------------------- |
| customers           | Perfiles de cliente                          |
| accountEvents       | Eventos de cuenta                            |
| depositEvents       | Eventos de depósito                          |
| withdrawEvents      | Eventos de retiro                            |
| gamingEvents        | Eventos de actividad de juego                |
| walletBalanceEvents | Eventos de saldo de cartera                  |
| referFriendEvents   | Eventos de referir amigo                     |
| extendedAttributes  | Atributos extendidos                         |
| operationEvents     | Eventos de operaciones (solo JavaScript SDK) |

## Modelos de datos (resumen)

- **Perfil de cliente**: `account_id`, `workspace_id`, `user_id`, `creation_timestamp` (obligatorios); más username, email, currency, limits, verification status, preferences, etc.
- **Evento de cuenta**: `account_id`, `workspace_id`, `user_id`, `event_category`, `event_name`, `event_id`, `event_time`.
- **Evento Deposit/Withdraw**: Mismos campos comunes más `amount`; deposit incluye `payment_method`, `transaction_id`, etc.
- **Evento de actividad de juego**: Campos comunes más `wager_amount`, `win_amount`, `game_id`, `game_title` y muchos campos opcionales de juego/sesión.
- **Evento de saldo de cartera**: Campos comunes más `wallet_type`, `currency`, `current_cash_balance`, `current_bonus_balance`, `current_total_balance`.
- **Evento referir amigo**: Campos comunes más `referral_code_used`, `successful_referral_confirmation`, `reward_type`, `referee_user_id`, etc.
- **Atributos extendidos**: `workspace_id`, `user_id`, `list_name`, `ext_data` (objeto o string JSON).

Todos los campos de fecha-hora usan **ISO 8601 UTC** (p. ej. `2024-01-15T10:30:00Z`). Los esquemas completos a nivel de campo están en el repositorio: [INTEGRATION_GUIDE.md](https://github.com/gamingcrafts/optikpi-datapipeline-sdk/blob/main/INTEGRATION_GUIDE.md).

## Manejo de errores

### Códigos de estado HTTP

| Code | Meaning           | Action                                 |
| ---- | ----------------- | -------------------------------------- |
| 200  | Éxito             | Petición procesada                     |
| 400  | Bad Request       | Revisa body y campos obligatorios      |
| 401  | Unauthorized      | Verifica token y firma                 |
| 403  | Forbidden         | El token puede estar caducado/inválido |
| 404  | Not Found         | Revisa URL base y ruta                 |
| 429  | Too Many Requests | Retrocede; respeta límites de tasa     |
| 500  | Server Error      | Reintenta tras un retraso              |

### Forma de la respuesta de error

```json
{
  "error": "Bad Request",
  "message": "Validation failed: account_id is required",
  "details": { "field": "account_id", "issue": "missing required field" }
}
```

El SDK devuelve un objeto resultado con `success` y bien `data` o detalles de error. Implementa **reintento con backoff exponencial** en fallos transitorios; evita reintentar en errores 4xx del cliente.

## Límites de tasa

- **Cliente y atributos extendidos**: 50 peticiones por segundo
- **Endpoints de eventos**: 250 peticiones por segundo
- **Tamaño de lote**: Hasta 500 registros por petición de lote
- **Ventana**: 1 minuto
- **Al superar el límite**: La API devuelve **429 Too Many Requests**

## Buenas prácticas

1. **Validar antes de enviar** — Usa el `validate()` del modelo del SDK para detectar errores localmente.
2. **Lotes** — Usa endpoints de lote para datos masivos; mantén el tamaño dentro de los límites.
3. **Errores** — Usa backoff exponencial en 5xx/429; no reintentes 4xx sin corregir la petición.
4. **Seguridad** — Mantén los tokens en secreto, usa HTTPS, evita registrar payloads sensibles.
5. **Monitorización** — Registra tiempos de respuesta y tasas de fallo; configura alertas ante tasas de error altas.

## Soporte

- **Documentación**: [Guía de usuario OptiKPI](https://www.optikpi.com/user-guide/)
- **SDK e incidencias**: [GitHub: optikpi-datapipeline-sdk](https://github.com/gamingcrafts/optikpi-datapipeline-sdk/issues)

## Siguientes pasos

- Elige un SDK: [JavaScript](/es/data-pipeline-sdk/javascript), [Java](/es/data-pipeline-sdk/java), [Python](/es/data-pipeline-sdk/python), [PHP](/es/data-pipeline-sdk/php).
- Obtén credenciales de tu gestor de cuenta y configura el cliente.
- Envía un perfil de cliente de prueba y un evento, luego añade lotes y manejo de errores según necesites.
