import express from 'express';
import multer from 'multer';
import cors from 'cors';
// import { parseResume } from '@openresume/parser'; // Logic will be added by agent
// import { resumeSchema } from '@resume-platform/schema'; // Logic will be added by agent

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
  // TODO: Agent will implement parsing and validation logic here.
  console.log('File received, parsing logic to be implemented.');
  return res.status(501).json({ message: 'Parsing logic not yet implemented.' });
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`Parser service listening on http://localhost:${port}`);
});