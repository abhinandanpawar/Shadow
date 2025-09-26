import express from 'express';
import cors from 'cors';
import { generatePdf } from './pdf-generator';
// import { generateLatex } from './latex-generator'; // Logic to be added by agent

const app = express();
const port = process.env.PORT || 3003;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' })); // Increase limit for resume data

app.post('/api/export/pdf', async (req, res) => {
  try {
    const pdfBuffer = await generatePdf(req.body.resume);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF.' });
  }
});

app.post('/api/export/latex', async (req, res) => {
  // TODO: Agent will implement LaTeX generation logic here.
  console.log('LaTeX export request received.');
  res.status(501).json({ message: 'LaTeX export logic not yet implemented.' });
});

app.listen(port, () => {
  console.log(`Exporter service listening on http://localhost:${port}`);
});