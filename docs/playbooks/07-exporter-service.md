# Playbook 07: Exporter Service

**Objective:** To create the `@resume-platform/exporter-service`. This service will accept JSON Resume data and render it into various file formats, specifically high-fidelity PDFs (including PDF/UA compliance) and LaTeX (`.tex`) files.

---

## 1. Research & Rationale

-   **Framework (`Express.js`):** We will continue to use Express.js for its simplicity and reliability in creating API-driven microservices.
-   **PDF Generation (`Puppeteer`):** For generating PDFs from HTML, Puppeteer is the industry standard. It provides programmatic control over a headless Chrome instance, ensuring that the generated PDF is a pixel-perfect representation of the rendered HTML.
    -   **Templating:** The service will contain simple HTML/CSS templates (using a templating engine like `EJS` for simplicity) that can be populated with JSON Resume data. This allows for themeable PDF exports.
    -   **Accessibility (PDF/UA):** A key requirement is PDF/UA compliance. Puppeteer supports the creation of "tagged PDFs," which is the foundation of accessibility. The HTML templates must be structured semantically (using `<h1>`, `<p>`, `<ul>`, etc.) for Puppeteer's accessibility tree generation to work correctly.
-   **LaTeX Generation:** Generating LaTeX files is best handled with a template-based approach. The service will store `.tex` template files (e.g., for Awesome-CV) with placeholders. When a request comes in, the service will replace the placeholders with the corresponding data from the JSON Resume object. This is more reliable and maintainable than trying to build a LaTeX document programmatically from scratch.
-   **Separation of Concerns:** Creating a dedicated exporter service isolates the heavy dependencies (like Puppeteer, which downloads a full Chromium browser) from other services and the main web app, keeping them lightweight.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new service and its templates.
2.  **Command:**
    ```bash
    mkdir -p services/exporter/src/templates
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file.
2.  **File Content (`services/exporter/package.json`):**
    ```json
    {
      "name": "@resume-platform/exporter-service",
      "version": "1.0.0",
      "private": true,
      "main": "dist/index.js",
      "scripts": {
        "dev": "ts-node-dev src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "lint": "eslint . --ext .ts"
      },
      "dependencies": {
        "express": "^4.19.2",
        "cors": "^2.8.5",
        "puppeteer": "^22.9.0",
        "ejs": "^3.1.10",
        "@resume-platform/schema": "workspace:*"
      },
      "devDependencies": {
        "typescript": "^5.4.5",
        "ts-node-dev": "^2.0.0",
        "@types/express": "^4.17.21",
        "@types/cors": "^2.8.17",
        "@types/ejs": "^3.1.5",
        "eslint": "^8.57.0"
      }
    }
    ```

### **Step 2.3: Create `tsconfig.json` and Template Files**

1.  **Action:** Create the `tsconfig.json` file.
2.  **File Content (`services/exporter/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": { "outDir": "./dist", "module": "commonjs", "resolveJsonModule": true },
      "include": ["src"]
    }
    ```
3.  **Action:** Create a sample EJS template for PDF generation.
4.  **File Content (`services/exporter/src/templates/basic.ejs`):**
    ```html
    <!DOCTYPE html>
    <html>
    <head><title><%= resume.basics.name %></title></head>
    <body>
      <h1><%= resume.basics.name %></h1>
      <p><%= resume.basics.summary %></p>
    </body>
    </html>
    ```
5.  **Action:** Create a sample LaTeX template.
6.  **File Content (`services/exporter/src/templates/awesome-cv.tex.template`):**
    ```latex
    % Awesome-CV Template
    \documentclass{awesome-cv}
    \name{<%= resume.basics.name %>}{}
    \begin{document}
    \makecvheader
    % ... rest of template with placeholders
    \end{document}
    ```

### **Step 2.4: Implement the Express Server**

1.  **Action:** Create the main server file `services/exporter/src/index.ts`.
2.  **File Content:**
    ```typescript
    import express from 'express';
    import cors from 'cors';
    import { generatePdf } from './pdf-generator';
    import { generateLatex } from './latex-generator';

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
        res.status(500).json({ error: 'Failed to generate PDF.' });
      }
    });

    app.post('/api/export/latex', async (req, res) => {
      try {
        const latexString = await generateLatex(req.body.resume, req.body.template);
        res.setHeader('Content-Type', 'application/x-tex');
        res.send(latexString);
      } catch (error) {
        res.status(500).json({ error: 'Failed to generate LaTeX file.' });
      }
    });

    app.listen(port, () => {
      console.log(`Exporter service listening on http://localhost:${port}`);
    });
    ```

### **Step 2.5: Implement Generator Logic**

1.  **Action:** Create `services/exporter/src/pdf-generator.ts`.
2.  **File Content:**
    ```typescript
    import puppeteer from 'puppeteer';
    import ejs from 'ejs';
    import fs from 'fs/promises';
    import path from 'path';
    import { Resume } from '@resume-platform/schema';

    export async function generatePdf(resume: Resume): Promise<Buffer> {
      const templatePath = path.join(__dirname, 'templates/basic.ejs');
      const template = await fs.readFile(templatePath, 'utf-8');
      const html = ejs.render(template, { resume });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        // This is the key for accessibility
        tagged: true,
      });

      await browser.close();
      return pdfBuffer;
    }
    ```
*(A similar `latex-generator.ts` would be created for LaTeX generation)*

### **Step 2.6: Install Dependencies**

1.  **Action:** Run `pnpm install` from the monorepo root.
2.  **Command:**
    ```bash
    pnpm install
    ```

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure all files and directories are created correctly.
2.  **[ ] Check `node_modules`:** Verify `node_modules` exists and contains `puppeteer`, `ejs`, etc.
3.  **[ ] Run Linter & Type Check:** Run `pnpm lint` and `pnpm tsc --noEmit -p services/exporter/tsconfig.json`.
4.  **[ ] Start the Service:** Run `pnpm --filter @resume-platform/exporter-service dev`.
5.  **[ ] Test PDF Export with `curl`:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"resume": {"basics": {"name": "John Doe", "summary": "A test summary"}}}' \
    http://localhost:3003/api/export/pdf --output test.pdf
    ```
    *   **Expected Outcome:** A file named `test.pdf` is created. Opening it should show a simple document with the name "John Doe".
6.  **[ ] Test LaTeX Export with `curl`:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"resume": {"basics": {"name": "John Doe"}}, "template": "awesome-cv"}' \
    http://localhost:3003/api/export/latex --output test.tex
    ```
    *   **Expected Outcome:** A file named `test.tex` is created with the name "John Doe" populated in the LaTeX template.