import express, { Request, Response } from 'express';
import cors from 'cors';
import { generatePdf } from './pdf-generator';
import { generateLatex } from './latex-generator';
import { generateHtml } from './html-generator';

const app = express();
const port = process.env.PORT || 3003;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' })); // Increase limit for resume data

app.post('/api/export/pdf', async (req: Request, res: Response) => {
  try {
    const pdfBuffer = await generatePdf(req.body.resume);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF.' });
  }
});

app.post('/api/export/latex', async (req: Request, res: Response) => {
  try {
    // Default to 'awesome-cv' if no template is specified
    const template = req.body.template || 'awesome-cv';
    const latexString = await generateLatex(req.body.resume, template);
    res.setHeader('Content-Type', 'application/x-tex');
    res.send(latexString);
  } catch (error) {
    console.error('Failed to generate LaTeX:', error);
    res.status(500).json({ error: 'Failed to generate LaTeX file.' });
  }
});

app.post('/api/export/html', async (req: Request, res: Response) => {
  try {
    const theme = req.body.theme || 'Classic';
    const htmlString = await generateHtml(req.body.resume, theme);
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlString);
  } catch (error) {
    console.error('Failed to generate HTML:', error);
    res.status(500).json({ error: 'Failed to generate HTML file.' });
  }
});

app.listen(port, () => {
  console.log(`Exporter service listening on http://localhost:${port}`);
});