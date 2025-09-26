import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { scoreResume } from './ats-logic';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// --- API Routes ---
app.post('/api/ats/score', async (req, res) => {
  const { resume, jobDescription } = req.body;
  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Resume and Job Description are required.' });
  }
  try {
    const result = await scoreResume(resume, jobDescription);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to score resume.' });
  }
});

app.post('/api/ai/suggest', async (req, res) => {
  const { resume, section } = req.body;
  if (!resume || !section) {
    return res.status(400).json({ error: 'Resume and section are required.' });
  }
  // TODO: Agent will implement suggestion logic here.
  return res.status(501).json({ message: 'Suggestion logic not yet implemented.' });
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`ATS & AI service listening on http://localhost:${port}`);
});