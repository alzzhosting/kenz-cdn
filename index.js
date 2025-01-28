const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs').promises

const app = express()
const PORT = 3000
const domain = "https://cdn.xtermai.xyz"

function generateRandomId(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result;
}

app.use('/storage', express.static(path.join(__dirname, 'storage')))

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'storage')
    try {
      await fs.mkdir(uploadDir, { recursive: true })
      cb(null, uploadDir)
    } catch (err) {
      cb(err)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${generateRandomId()}`
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'application/pdf', 
    'audio/mp3', 'audio/wav', 'audio/mpeg'
  ]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type'), false)
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
})

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const uploadedFilePath = path.join(__dirname, 'storage', req.file.filename)
    const fileExists = await fs
      .access(uploadedFilePath)
      .then(() => true)
      .catch(() => false)

    if (!fileExists) {
      return res.status(400).json({ error: 'File not found after upload' })
    }

    res.json({
      status: true,
      path: `${domain}/storage/${req.file.filename}`,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 10 MB limit' })
    }
  } else if (err.message === 'Unsupported file type') {
    return res.status(400).json({ error: 'Unsupported file type' })
  }
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
