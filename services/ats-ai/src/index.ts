import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { scoreResume, suggestImprovements } from './ats-logic';

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
  // TODO: Agent will implement scoring logic here.
  return res.status(501).json({ message: 'Scoring logic not yet implemented.' });
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