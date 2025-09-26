import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { normalizeSkills } from './skill-normalizer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/skills/normalize', async (req, res) => {
  const { skills } = req.body;
  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'An array of skills is required.' });
  }
  // TODO: Agent will implement normalization logic here.
  return res.status(501).json({ message: 'Skill normalization logic not yet implemented.' });
});

app.listen(port, () => {
  console.log(`Skills service listening on http://localhost:${port}`);
});