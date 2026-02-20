# Uploads

The Uploads API handles file uploads to **AWS S3** and file deletion. It is used for uploading images (email templates, avatars, workspace logos) and other static assets.

**Base path:** `/{locale}/api/uploads`

## Upload File

Upload a file to AWS S3. Returns the public URL of the uploaded file.

**`POST /{locale}/api/uploads`**

### Request Headers

| Header         | Value                 |
| -------------- | --------------------- |
| `Content-Type` | `multipart/form-data` |

### Request Form Fields

| Field         | Type     | Required | Description                             |
| ------------- | -------- | -------- | --------------------------------------- |
| `file`        | `File`   | ✅       | The file to upload                      |
| `workSpaceId` | `string` | ✅       | Active workspace ID                     |
| `moduleName`  | `string` | ✅       | Module context for S3 path organization |

### Module Names

| `moduleName` | Description                   | S3 Path Prefix               |
| ------------ | ----------------------------- | ---------------------------- |
| `library`    | Email template images         | `workspaces/{id}/library/`   |
| `workspace`  | Workspace logo / brand assets | `workspaces/{id}/workspace/` |
| `user`       | User avatar photos            | `workspaces/{id}/users/`     |
| `campaign`   | Campaign-specific assets      | `workspaces/{id}/campaigns/` |

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
formData.append('file', fileInput.files[0]);
formData.append('workSpaceId', 'ws_xyz789');
formData.append('moduleName', 'library');

const response = await fetch('/en/api/uploads', {
  method: 'POST',
  body: formData
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

Remove a file from AWS S3 by its storage key.

**`DELETE /{locale}/api/uploads`**

### Request Body

| Field         | Type     | Required | Description                                            |
| ------------- | -------- | -------- | ------------------------------------------------------ |
| `key`         | `string` | ✅       | The S3 object key to delete (from the upload response) |
| `workSpaceId` | `string` | ✅       | Active workspace ID                                    |

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
The `bodySizeLimit` for server actions is configured to `100mb` in `next.config.js` to support large CSV audience uploads.
:::
