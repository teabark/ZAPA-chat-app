import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/image', upload.single('file'), async (req, res) => {
  try {
    const bufferStream = Readable.from(req.file.buffer);
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'zapa-chat', resource_type: 'auto' },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        res.json({ url: result.secure_url, type: result.resource_type });
      }
    );
    bufferStream.pipe(stream);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
