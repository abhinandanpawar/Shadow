import puppeteer from 'puppeteer';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { Resume } from '@resume-platform/schema';

export async function generatePdf(resume: Resume): Promise<Buffer> {
  // TODO: The EJS template is incomplete. The agent needs to complete it.
  const templatePath = path.join(__dirname, 'templates/basic.ejs');
  const template = await fs.readFile(templatePath, 'utf-8');
  const html = ejs.render(template, { resume });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    tagged: true, // This is crucial for PDF/UA accessibility
  });

  await browser.close();
  return pdfBuffer;
}