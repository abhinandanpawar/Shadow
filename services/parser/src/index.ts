import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { parseResumeFromFile } from './lib';
import { resumeSchema } from '@resume-platform/schema';

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- API Routes ---
app.post('/api/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // Pass the entire file object, which includes the buffer and mimetype
    const resume = await parseResumeFromFile(req.file);
    const validationResult = resumeSchema.safeParse(resume);

    if (validationResult.success) {
      return res.status(200).json(validationResult.data);
    } else {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.flatten(),
      });
    }
  } catch (error) {
    console.error('Error parsing resume:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Error parsing resume.', details: message });
  }
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`Parser service listening on http://localhost:${port}`);
});