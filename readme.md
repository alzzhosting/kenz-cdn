Here’s the README.md in English for your **termai-cdn** project:

# Termai CDN

Termai CDN is a simple CDN (Content Delivery Network) service for uploading and serving various types of files (images, PDFs, audio). This project is built using **Express.js** and **Multer** for handling file uploads and storing them on the server.
## Creator
- **Azfir** (GitHub: [Rifza123](https://github.com/Rifza123))

## Features
- Allows uploading of files with various types: JPEG, PNG, PDF, MP3, WAV, MPEG.
- Provides CDN URL for accessing uploaded files.
- Limits file size to 10MB.
- Security system that filters files based on type and size.

## Technologies
- **Node.js**: To run the server.
- **Express.js**: For handling HTTP requests.
- **Multer**: For handling file uploads.
- **FS (File System)**: For handling file storage.

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Rifza123/termai-cdn.git
   ```

2. Navigate to the project folder:
   ```bash
   cd termai-cdn
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will run on port 3000 by default. You can access the API at `http://localhost:3000`.

## API Endpoint

### `POST /api/upload`

To upload a file, send a POST request to the `/api/upload` endpoint with a `form-data` request. Make sure the file does not exceed the 10MB size limit and has a supported type.

#### Example Usage:

```javascript
const axios = require("axios")
const fs = require("fs")
const Form = require("form-data")
const key = "default"
const uploadFile = async (file) => {
  const formData = new Form();
  formData.append('file', file, { filename: 'anu.jpg' });

  try {
    const response = await axios.post('https://cdn.xtermai.xyz/api/upload?key='+key, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('File uploaded successfully', response.data);
  } catch (error) {
    console.error('Error uploading file', error.response?.data || error.message);
  }
};

uploadFile(fs.readFileSync("img.jpg"))
```

#### Response

If successful, you will receive a JSON response like this:

```json
{
  "status": true,
  "path": "https://yourdomain.com/storage/unique-file-id.jpg"
}
```

If there is an error, you will get an error message like this:

```json
{
  "error": "No file uploaded"
}
```

## File Handling

- All uploaded files will be stored in the `storage/` folder.
- Each uploaded file will be given a unique name based on a randomly generated ID.

## Limitations

- The maximum file size is 10MB.
- Supported file types are:
  - Images: `image/jpeg`, `image/png`
  - PDF: `application/pdf`
  - Audio: `audio/mp3`, `audio/wav`, `audio/mpeg`