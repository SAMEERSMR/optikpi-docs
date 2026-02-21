# Overview

> OptiKPI Data Pipeline SDKs are official client libraries for the Data Pipeline Ingest API. They handle authentication, validation, and retries so you can send customer profiles and event data from your backend with minimal code.

## Official SDKs

Choose your language. Each card links to installation, configuration, and usage for that SDK.

<div class="sdk-card-group">

<a class="sdk-card" href="/data-pipeline-sdk/javascript">
  <span class="sdk-card-icon">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#ffdf00" d="M0 0h512v512H0z" opacity="1" data-original="#ffdf00" class=""></path><path d="M343.934 400.002c10.313 16.839 23.731 29.216 47.462 29.216 19.935 0 32.67-9.964 32.67-23.731 0-16.498-13.084-22.341-35.027-31.939l-12.028-5.161c-34.719-14.791-57.783-33.321-57.783-72.493 0-36.084 27.494-63.553 70.461-63.553 30.59 0 52.582 10.646 68.429 38.522l-37.465 24.056c-8.249-14.791-17.148-20.618-30.964-20.618-14.092 0-23.024 8.94-23.024 20.618 0 14.434 8.94 20.277 29.582 29.217l12.028 5.152c40.879 17.53 63.959 35.401 63.959 75.581 0 43.317-34.028 67.048-79.726 67.048-44.682 0-73.549-21.293-87.674-49.201zm-169.96 4.169c7.558 13.41 14.434 24.747 30.964 24.747 15.807 0 25.779-6.185 25.779-30.232V235.089h48.112v164.246c0 49.818-29.208 72.493-71.843 72.493-38.522 0-60.83-19.936-72.176-43.947z" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>
  </span>
  <div class="sdk-card-title">JavaScript SDK</div>
  <p class="sdk-card-desc">Use the Data Pipeline API from Node.js or the browser. Install via npm; supports CommonJS and ESM.</p>
</a>

<a class="sdk-card" href="/data-pipeline-sdk/java">
  <span class="sdk-card-icon">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#427595" d="M118.736 304.549c0-14.173 53.774-22.125 78.815-24.057l2.395 1.383c-9.619 1.752-48.217 8.558-48.217 17.439 0 9.666 59.199 16 93.556 16 58.356 0 98.025-8.833 108.694-11.739l14.93 8.682c-10.225 5.008-54.106 18.12-123.624 18.12-77.253-.001-126.549-15.111-126.549-25.828M236.48 503.552c-30.579.265-67.909-2.263-99.312-7.536l-2.916 1.666c31.289 9.174 74.848 14.712 122.706 14.296 93.991-.814 170.194-24.123 171.699-52.174l-1.079-.634c-6.305 7.687-46.958 43.123-191.098 44.382m8-18.063c76.931-.672 162.999-15.725 162.781-41.031-.047-4.592-3.03-7.735-5.624-9.628l-1.269.729c-7.11 19.597-67.208 34.082-156.012 34.849-57.296.502-136.67-13.226-136.812-29.084-.133-15.905 37.604-24.643 37.604-24.643l-2.67-1.524c-25.287 3.484-71.885 15.593-71.734 33.079.22 25.276 107.314 37.83 173.736 37.253m173.309-174.17c-1.552 29.68-28.97 48.16-56.378 63.772l2.481 1.439c29.245-8.236 81.428-32.189 77.111-69.017-2.149-18.357-18.935-31.479-40.814-31.479-6.816 0-12.875 1.202-17.789 2.698l-.019.047-1.042 2.613c19.579-3.834 37.463 10.462 36.45 29.927m-225.975 88.187c-8.928 1.78-28.383 6.249-28.383 15.706 0 13.103 41.618 23.148 81.807 23.148 55.299 0 77.954-14.229 78.976-14.968l-22.996-13.302c-9.78 2.329-26.253 5.983-55.923 5.983-33.107 0-54.683-5.661-54.683-11.872 0-1.316.824-2.887 2.357-4.023zm135.846-44.174c-12.715 3.598-41.363 9.467-82.328 9.467-40.198 0-73.04-6.873-73.145-14.977-.076-5.397 6.447-7.744 6.447-7.744l-1.155-.672c-19.256 3.399-37.131 8.663-37.036 16.539.18 14.286 54.825 25.013 104.813 25.013 42.499 0 83.312-7.129 101.726-16.473z" opacity="1" data-original="#427595" class=""></path><path fill="#de8e2f" d="M316.697 36.62c0 78.778-107.956 108.921-107.956 164.93 0 39.318 26.073 63.971 40.501 79.563l-1.174.682c-18.215-11.399-66.129-40.028-66.129-87.317 0-66.394 124.003-98.119 124.003-173.526 0-9.278-1.373-16.397-2.338-20.232l1.25-.72c3.928 4.933 11.843 17.278 11.843 36.62m35.503 69.764-1.297-.738c-23.488 7.867-95.819 36.42-95.819 89.646 0 30.096 29.396 46.778 29.396 75 0 10.073-5.69 19.512-10.31 25.154l2.319 1.344c12.241-7.952 33.902-25.173 33.902-47.402 0-18.83-26.054-41.457-26.054-65.656.001-38.134 50.272-68.051 67.863-77.348" opacity="1" data-original="#de8e2f"></path></g></svg>
  </span>
  <div class="sdk-card-title">Java SDK</div>
  <p class="sdk-card-desc">Java 11+ client with Maven. Type-safe models, validation, and batch support.</p>
</a>

<a class="sdk-card" href="/data-pipeline-sdk/python">
  <span class="sdk-card-icon">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 256 256" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#f0c020" d="M248 96.655a136.66 136.66 0 0 1-.13 63.218 26.891 26.891 0 0 1-26.194 20.744H180.6V221.7c0 11.669-7.588 23.1-21.326 26.331a136.635 136.635 0 0 1-62.565.006C83 244.814 75.351 233.435 75.351 221.7v-66.8a26.911 26.911 0 0 1 26.911-26.911h51.427a26.912 26.912 0 0 0 26.911-26.908V75.368h41.078A26.892 26.892 0 0 1 248 96.655z" opacity="1" data-original="#f0c020" class=""></path><path fill="#72c1e8" d="M180.6 34.292v66.789a26.912 26.912 0 0 1-26.912 26.912h-51.426A26.911 26.911 0 0 0 75.351 154.9v25.713H34.269a26.891 26.891 0 0 1-26.19-20.728 136.691 136.691 0 0 1 0-63.788 26.892 26.892 0 0 1 26.192-20.729h41.08V34.289A26.9 26.9 0 0 1 96.639 7.967a136.645 136.645 0 0 1 62.545-.028c13.645 3.202 21.416 14.474 21.416 26.353z" opacity="1" data-original="#72c1e8"></path><circle cx="106.102" cy="42.13" r="8.41" fill="#ffffff" transform="rotate(-22.48 106.042 42.05)" opacity="1" data-original="#ffffff"></circle><circle cx="149.849" cy="213.855" r="8.41" fill="#ffffff" opacity="1" data-original="#ffffff"></circle><path fill="#f9e5af" d="M169.975 224.765a2.5 2.5 0 0 1-2.5-2.5v-4.854a2.5 2.5 0 0 1 5 0v4.854a2.5 2.5 0 0 1-2.5 2.5zm0-14.854a2.5 2.5 0 0 1-2.5-2.5v-40.794a2.5 2.5 0 0 1 2.5-2.5h51.7a10.355 10.355 0 0 0 10.132-8.019 120.884 120.884 0 0 0 0-56.24 10.34 10.34 0 0 0-10.125-7.99 2.5 2.5 0 0 1 0-5c6.723 0 13.2 4.237 15.116 12.37a125.875 125.875 0 0 1-.118 58 15.333 15.333 0 0 1-15 11.877h-49.2v38.294a2.5 2.5 0 0 1-2.505 2.502z" opacity="1" data-original="#f9e5af" class=""></path><path fill="#c5e5ff" d="M61.351 169.117a2.5 2.5 0 0 1-2.5-2.5v-4.481a2.5 2.5 0 0 1 5 0v4.481a2.5 2.5 0 0 1-2.5 2.5zm-.074-14.484a2.5 2.5 0 0 1-2.327-2.661 43.51 43.51 0 0 1 43.312-40.48h51.427a10.422 10.422 0 0 0 10.411-10.411V34.292a10.351 10.351 0 0 0-8.013-10.131l-.671-.161a2.5 2.5 0 0 1 1.14-4.868l.671.157a15.331 15.331 0 0 1 11.873 15v66.789a15.428 15.428 0 0 1-15.411 15.411h-51.427a38.5 38.5 0 0 0-38.324 35.814 2.5 2.5 0 0 1-2.661 2.33z" opacity="1" data-original="#c5e5ff"></path><path d="M250.3 95.514a29.435 29.435 0 0 0-28.62-22.65h-38.59v-11.57a2.5 2.5 0 0 0-4.99-.02.035.035 0 0 0-.01.02v39.79a24.5 24.5 0 0 1-24.41 24.41h-51.42a29.388 29.388 0 0 0-29.41 29.41v23.21H34.274a24.281 24.281 0 0 1-23.76-18.8 135.341 135.341 0 0 1-3.02-17.77 2.5 2.5 0 0 0-4.98.51 140.184 140.184 0 0 0 3.13 18.41 29.406 29.406 0 0 0 28.63 22.65h38.58v38.58a29.409 29.409 0 0 0 23.22 28.76c4.676.754 28.643 7.972 63.99-.04a29.427 29.427 0 0 0 23.04-28.72v-38.58h12.01a2.5 2.5 0 0 0 0-5h-67.14a2.5 2.5 0 0 0 0 5H178.1v38.58a24.292 24.292 0 0 1-19.4 23.9 134.7 134.7 0 0 1-61.42.01c-12.655-3-19.43-13.259-19.43-23.91V154.9a24.489 24.489 0 0 1 24.41-24.41h51.43a29.42 29.42 0 0 0 29.41-29.41V77.864h38.58a24.289 24.289 0 0 1 23.8 19.03 3.383 3.383 0 0 1 .08.34c5.083 21.6 4.421 44.5-.13 62.07a24.279 24.279 0 0 1-23.76 18.81h-6.56a2.5 2.5 0 0 0 0 5h6.56a29.4 29.4 0 0 0 28.63-22.67c6.219-26.199 3.906-43.666 0-64.93z" fill="#000000" opacity="1" data-original="#000000"></path><circle cx="205.114" cy="180.614" r="2.5" fill="#000000" opacity="1" data-original="#000000"></circle><path d="M180.6 48.794a2.5 2.5 0 1 0 2.49 2.5 2.509 2.509 0 0 0-2.49-2.5zM4.444 124.324a2.5 2.5 0 0 0 2.5-2.37v-.02a134.257 134.257 0 0 1 3.57-25.26 24.279 24.279 0 0 1 23.76-18.81h93.7a2.5 2.5 0 0 0 0-5h-50.12v-38.57A24.282 24.282 0 0 1 97.214 10.4c21.223-5 43.46-4.493 61.6.02a24.3 24.3 0 0 1 19.28 23.87v7a2.505 2.505 0 0 0 5.01 0l-.01-7c0-12.964-8.506-25.332-23.34-28.79a139.672 139.672 0 0 0-63.69.03 29.427 29.427 0 0 0-23.21 28.76v38.57h-38.58c-12.832 0-25.245 8.387-28.78 23.29a140.313 140.313 0 0 0-3.55 25.56 2.5 2.5 0 0 0 2.5 2.614zM4.424 134.324a2.508 2.508 0 0 0 2.43-2.57 2.471 2.471 0 0 0-2.57-2.43 2.5 2.5 0 1 0 .14 5z" fill="#000000" opacity="1" data-original="#000000"></path><path d="M95.192 42.13A10.91 10.91 0 1 0 106.1 31.22a10.922 10.922 0 0 0-10.908 10.91zm16.819 0a5.91 5.91 0 1 1-5.909-5.91 5.916 5.916 0 0 1 5.909 5.91zM160.759 213.856a10.91 10.91 0 1 0-10.91 10.909 10.922 10.922 0 0 0 10.91-10.909zm-16.82 0a5.91 5.91 0 1 1 5.91 5.909 5.917 5.917 0 0 1-5.91-5.909z" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>
  </span>
  <div class="sdk-card-title">Python SDK</div>
  <p class="sdk-card-desc">Python 3.8+ client. Use with pip or Poetry; includes models and validation.</p>
</a>

<a class="sdk-card" href="/data-pipeline-sdk/php">
  <span class="sdk-card-icon">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"><g><path d="M512 256c0 15.485-1.379 30.647-4.012 45.369C486.578 421.115 381.9 512 256 512c-94.856 0-177.664-51.587-221.884-128.24a254.005 254.005 0 0 1-25.088-60.155C3.135 302.07 0 279.395 0 256 0 114.615 114.615 0 256 0c116.694 0 215.144 78.075 245.979 184.842C508.5 207.433 512 231.309 512 256z" style="" fill="#8f9ed1" data-original="#8f9ed1"></path><path d="M130.173 178.239H35.892L9.028 323.605a254.005 254.005 0 0 0 25.088 60.155h8.746l10.407-56.299h51.806c63.08 0 80.039-56.633 84.104-84.449 4.075-27.805-16.269-64.773-59.006-64.773zm13.678 69.464c-2.309 15.768-13.96 47.877-49.716 47.877H59.162l15.632-84.605h35.6c34.701 0 35.766 20.961 33.457 36.728zM501.979 184.842c-8.014-4.138-17.565-6.604-28.599-6.604h-94.281L341.117 383.76h44.951l10.407-56.299h51.806c28.056 0 46.989-11.201 59.705-26.091A257.373 257.373 0 0 0 512 256c0-24.691-3.5-48.567-10.021-71.158zm-14.921 62.861c-2.309 15.768-13.96 47.877-49.727 47.877h-34.962l15.632-84.605h35.6c34.701 0 35.766 20.961 33.457 36.728zM309.238 178.919h-54.597l10.248-55.451h-44.766L182.14 328.984h44.766l21.843-118.186h28.61c18.991 0 31.879 4.07 29.165 21.705-2.713 17.635-18.313 95.636-18.313 95.636h45.444s17.635-86.818 20.348-111.237c2.714-24.418-19.669-37.983-44.765-37.983z" style="" fill="#f2f2f2" data-original="#f2f2f2"></path></g></svg>
  </span>
  <div class="sdk-card-title">PHP SDK</div>
  <p class="sdk-card-desc">PHP 7.4+ client via Composer. Requires ext-json, ext-curl, ext-openssl.</p>
</a>

</div>

## Supported data types

All SDKs support the same data types and batch keys. Required fields and field-level schemas are in the [Integration Guide](/data-pipeline-sdk/integration-guide).

| Type                          | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| **Customer profiles**         | User account info, preferences, limits, verification status |
| **Account events**            | Login, logout, registration, verification                   |
| **Deposit / Withdraw events** | Financial transactions                                      |
| **Gaming activity events**    | Bets, wins, game sessions, slots, sports, poker             |
| **Wallet balance events**     | Balance snapshots and updates                               |
| **Refer friend events**       | Referrals and rewards                                       |
| **Extended attributes**       | Custom key-value data per user/list                         |

::: tip Get credentials
You need an **auth token**, **account ID**, **workspace ID**, and **API base URL** from your account manager. The SDK uses them to sign requests (HMAC + HKDF); no crypto code required on your side.
:::

## Next steps

1. Pick an SDK above and open its page for **Installation** and **Configuration**.
2. Read the [Integration Guide](/data-pipeline-sdk/integration-guide) for endpoints, rate limits, error handling, and data model details.
3. Run the examples in the [SDK repository](https://github.com/gamingcrafts/optikpi-datapipeline-sdk) after setting `.env` with your credentials.
