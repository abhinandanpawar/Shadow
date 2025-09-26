import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { issueCredential, verifyCredential } from './vc-handler';

dotenv.config();
const app = express();
const port = process.env.PORT || 3006;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/vc/issue', async (req, res) => {
  const { subjectDid, credentialPayload } = req.body;
  if (!subjectDid || !credentialPayload) {
    return res.status(400).json({ error: 'Subject DID and credential payload are required.' });
  }
  // TODO: Agent will implement VC issuing logic here.
  return res.status(501).json({ message: 'Issuing logic not yet implemented.' });
});

app.post('/api/vc/verify', async (req, res) => {
  const { vcJwt } = req.body;
  if (!vcJwt) {
    return res.status(400).json({ error: 'VC JWT is required.' });
  }
  // TODO: Agent will implement VC verification logic here.
  return res.status(501).json({ message: 'Verification logic not yet implemented.' });
});

app.listen(port, () => {
  console.log(`VC service listening on http://localhost:${port}`);
});