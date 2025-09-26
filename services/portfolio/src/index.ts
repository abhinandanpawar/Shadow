import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { getGitHubData } from './github-handler';

dotenv.config();
const app = express();
const port = process.env.PORT || 3007;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/portfolio/github/sync', async (req, res) => {
  const { username } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"

  if (!username || !token) {
    return res.status(400).json({ error: 'Username and GitHub token are required.' });
  }

  // TODO: Agent will implement GitHub fetching logic here.
  return res.status(501).json({ message: 'GitHub sync logic not yet implemented.' });
});

app.listen(port, () => {
  console.log(`Portfolio service listening on http://localhost:${port}`);
});