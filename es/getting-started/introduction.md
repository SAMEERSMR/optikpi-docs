# Introducción

OptiKPI es una plataforma de automatización de marketing full-stack construida con **Next.js 14**. Permite a los equipos crear segmentos de audiencia, ejecutar campañas multicanal, diseñar flujos de trabajo automatizados y medir el engagement, todo desde una interfaz unificada.

## Resumen de la arquitectura

OptiKPI está estructurado como una aplicación Next.js con rutas API con prefijo de locale. Todas las rutas API siguen este patrón de ruta base:

```http
/{locale}/api/{resource}
```

Por ejemplo, la API de audiencia está disponible en `/en/api/audience`.

Un pequeño conjunto de APIs internas de utilidad (p. ej. autenticación, búsqueda de usuario) están en `/api/...` sin prefijo de locale.

## Stack tecnológico

| Capa                  | Tecnología                                                   |
| --------------------- | ------------------------------------------------------------ |
| Framework frontend    | Next.js 14 (App Router), React 18, TypeScript                |
| Estilos               | Tailwind CSS                                                 |
| ORM / Base de datos   | Prisma + MongoDB                                             |
| Autenticación         | NextAuth (JWT, CredentialsProvider)                          |
| Obtención de datos    | SWR, React Hook Form                                         |
| Almacenamiento cloud  | AWS S3, Google Cloud Storage (GCS)                           |
| Big Data / Audiencias | Google BigQuery                                              |
| Programación          | Google Cloud Scheduler, Cloud Run                            |
| Serverless            | AWS Lambda                                                   |
| Analíticas / Búsqueda | ElasticSearch                                                |
| Email                 | SendGrid, Elastic Email                                      |
| Notificaciones push   | Web Push API (SDK propio), Firebase Cloud Messaging (legacy) |

## Conceptos clave

### Workspace

Cada usuario pertenece a un **Workspace**. Un workspace es una unidad organizativa que contiene campañas, audiencias, flujos de trabajo, integraciones y roles de usuario. Todas las peticiones API se limitan a un workspace mediante la cabecera `workSpaceId`.

### Locale

La aplicación admite varios locales. El locale forma parte de la ruta de la URL y se usa para localizar respuestas y etiquetas de la interfaz. Valores soportados: `en`, `es`, `zh-CN`, `zh-TW`, `th`, `vi`, `ru`, `pt`. El middleware obtiene el locale activo de la sesión y enruta las peticiones en consecuencia.

### Cabeceras de sesión

Todas las llamadas API dentro de la plataforma incluyen cabeceras derivadas de la sesión inyectadas por el middleware de Next.js:

| Cabecera    | Descripción                                            |
| ----------- | ------------------------------------------------------ |
| accountId   | ID de la cuenta (empresa/organización)                 |
| workSpaceId | ID del workspace activo                                |
| userId      | ID del usuario autenticado                             |
| timezone    | Zona horaria preferida del usuario (p. ej. Asia/Dubai) |
| language    | Idioma preferido del usuario (p. ej. en)               |

Estas cabeceras no las envía el cliente; las establece automáticamente `middleware.ts` en cada petición API en el servidor tras leer la sesión de la cookie JWT.

## Siguientes pasos

- [Autenticación →](/getting-started/authentication)
- [Formato de respuesta →](/getting-started/response-format)
- [Referencia de API →](/api-reference/user)
