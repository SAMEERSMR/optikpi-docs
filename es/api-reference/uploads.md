# Uploads

La API Uploads gestiona la subida de archivos a **AWS S3** y la eliminación de archivos. Se usa para subir imágenes (plantillas de email, avatares, logos de workspace) y otros recursos estáticos.

**Base path:** `/{locale}/api/uploads`

## Upload File

Sube un archivo a AWS S3. Devuelve la URL pública del archivo subido.

**`POST /{locale}/api/uploads`**

### Request Headers

| Header       | Value               |
| ------------ | ------------------- |
| Content-Type | multipart/form-data |

### Request Form Fields

| Field       | Type   | Required | Description                                          |
| ----------- | ------ | -------- | ---------------------------------------------------- |
| file        | File   | ✅       | Archivo a subir                                      |
| workSpaceId | string | ✅       | ID del workspace activo                              |
| moduleName  | string | ✅       | Contexto del módulo para la organización de rutas S3 |

### Module Names

| moduleName | Description                           | S3 Path Prefix             |
| ---------- | ------------------------------------- | -------------------------- |
| library    | Imágenes de plantillas de email       | workspaces/{id}/library/   |
| workspace  | Logo de workspace / recursos de marca | workspaces/{id}/workspace/ |
| user       | Fotos de avatar de usuario            | workspaces/{id}/users/     |
| campaign   | Recursos específicos de campaña       | workspaces/{id}/campaigns/ |

### Request (multipart)

```
POST /{locale}/api/uploads
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="banner.jpg"
Content-Type: image/jpeg

[binary file data]
--boundary
Content-Disposition: form-data; name="workSpaceId"

ws_xyz789
--boundary
Content-Disposition: form-data; name="moduleName"

library
--boundary--
```

### JavaScript Example

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("workSpaceId", "ws_xyz789");
formData.append("moduleName", "library");

const response = await fetch("/en/api/uploads", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result.result.data.url);
// → "https://s3.amazonaws.com/bucket/workspaces/ws_xyz789/library/banner.jpg"
```

### Response

```json
{
  "result": {
    "data": {
      "url": "https://s3.amazonaws.com/optikpi-assets/workspaces/ws_xyz789/library/banner_1708425600.jpg",
      "key": "workspaces/ws_xyz789/library/banner_1708425600.jpg",
      "size": 248320,
      "mimeType": "image/jpeg"
    },
    "message": "File uploaded successfully",
    "status": 200
  }
}
```

## Delete File

Elimina un archivo de AWS S3 por su clave de almacenamiento.

**`DELETE /{locale}/api/uploads`**

### Request Body

| Field       | Type   | Required | Description                                                |
| ----------- | ------ | -------- | ---------------------------------------------------------- |
| key         | string | ✅       | Clave del objeto S3 a eliminar (de la respuesta de subida) |
| workSpaceId | string | ✅       | ID del workspace activo                                    |

### Request

```json
{
  "key": "workspaces/ws_xyz789/library/banner_1708425600.jpg",
  "workSpaceId": "ws_xyz789"
}
```

### Response

```json
{
  "result": {
    "data": null,
    "message": "File deleted successfully",
    "status": 200
  }
}
```

## Supported File Types

| Category  | Extensions                                       | Max Size |
| --------- | ------------------------------------------------ | -------- |
| Images    | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg` | 10 MB    |
| Documents | `.pdf`                                           | 20 MB    |
| Data      | `.csv`, `.xlsx`                                  | 100 MB   |

::: warning
El `bodySizeLimit` para las server actions está configurado a `100mb` en `next.config.js` para soportar subidas de audiencias CSV grandes.
:::
