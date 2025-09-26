# Playbook 05: Parser Service

**Objective:** To create the `@resume-platform/parser-service`. This microservice will be responsible for accepting a PDF or DOCX resume file, parsing it using the OpenResume library, validating the output against our shared schema, and returning a clean JSON Resume object.

---

## 1. Research & Rationale

-   **Framework (`Express.js`):** For a simple microservice that primarily acts as a wrapper around a library, a lightweight and battle-tested framework is ideal. Express.js is chosen for its simplicity, extensive documentation, and large ecosystem of middleware. It is more than sufficient for our needs.
-   **File Uploads (`Multer`):** Multer is the standard, go-to middleware for handling `multipart/form-data` in Express. It is efficient and makes accessing uploaded files straightforward. We will configure it for in-memory storage, as we only need the file buffer to pass to the parser, not to save it to disk.
-   **Parsing Logic (`OpenResume`):** The OpenResume project (`github.com/xitanggg/open-resume`) provides a high-quality, open-source engine for parsing resumes. It is not available as a published npm package. Therefore, a key task for the agent implementing this service will be to **manually integrate the relevant parsing logic and models** from the OpenResume GitHub repository into this service's codebase.
-   **Schema Validation:** A critical step is to validate the output from the parser against our own `@resume-platform/schema`. This ensures that any data entering our system is clean and conforms to our single source of truth, protecting downstream services from malformed data.
-   **CORS:** The `cors` middleware is essential to allow our main web application (running on a different port) to make requests to this service without being blocked by browser security policies.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.0: Manual Integration Guide for OpenResume Parser**

**Objective:** To adapt the core parsing logic from the `xitanggg/open-resume` GitHub repository for use in this service.

**Process:**

1.  **Clone the Source Repository:** In a separate, temporary directory outside of this project, clone the OpenResume repository.
    ```bash
    git clone https://github.com/xitanggg/open-resume.git
    ```

2.  **Identify Core Logic:** The key files for parsing are located in `open-resume/src/lib/parser/`. The most important file is `process-resume.ts`, which orchestrates the parsing process. It relies on other utilities in that directory for things like text cleaning and sectioning.

3.  **Copy Relevant Files:**
    *   Create a new directory in our service: `services/parser/src/lib/`.
    *   Copy the entire contents of the `open-resume/src/lib/parser/` directory from the cloned repository into our new `services/parser/src/lib/` directory.

4.  **Adapt the Code:**
    *   The copied code is written for a Next.js environment and may have dependencies on Next.js-specific features or other parts of the OpenResume codebase.
    *   The assigned agent's primary task is to refactor this code so that it can run in a standard Node.js environment. This will primarily involve:
        *   Creating a main entry point function, for example, `parseResumeFromFile(fileBuffer: Buffer): Promise<JsonResume>`.
        *   Removing any React/Next.js specific code.
        *   Ensuring all necessary helper functions are correctly imported within the new `lib` directory.

5.  **Install Additional Dependencies:**
    *   The OpenResume parser relies on `pdfjs-dist`. The agent must add this dependency to the `services/parser/package.json` file.
    *   **Command:** `pnpm --filter @resume-platform/parser-service add pdfjs-dist`

6.  **Integrate with the Express Endpoint:**
    *   In `services/parser/src/index.ts`, import the newly created `parseResumeFromFile` function.
    *   Call this function from within the `/api/import` endpoint, passing it the `req.file.buffer`.

This provides a clear, actionable plan for integrating the parsing logic.

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new service.
2.  **Command:**
    ```bash
    mkdir -p services/parser/src
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file for the service.
2.  **File Content (`services/parser/package.json`):**
    ```json
    {
      "name": "@resume-platform/parser-service",
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
        "multer": "^1.4.5-lts.1",
        "cors": "^2.8.5",
        "@openresume/parser": "latest",
        "@resume-platform/schema": "workspace:*"
      },
      "devDependencies": {
        "typescript": "^5.4.5",
        "ts-node-dev": "^2.0.0",
        "@types/express": "^4.17.21",
        "@types/multer": "^1.4.11",
        "@types/cors": "^2.8.17",
        "eslint": "^8.57.0"
      }
    }
    ```

### **Step 2.3: Create `tsconfig.json`**

1.  **Action:** Create a `tsconfig.json` file extending the base configuration.
2.  **File Content (`services/parser/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": {
        "outDir": "./dist",
        "module": "commonjs"
      },
      "include": ["src"],
      "exclude": ["node_modules", "dist"]
    }
    ```

### **Step 2.4: Implement the Express Server**

1.  **Action:** Create the main server file `services/parser/src/index.ts`.
2.  **File Content:**
    ```typescript
    import express from 'express';
    import multer from 'multer';
    import cors from 'cors';
    import { parseResume } from '@openresume/parser';
    import { resumeSchema } from '@resume-platform/schema';

    const app = express();
    const port = process.env.PORT || 3001;

    // --- Middleware ---
    app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the web app
    app.use(express.json());

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // --- API Routes ---
    app.post('/api/import', upload.single('file'), async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      try {
        // 1. Parse the resume from the file buffer
        const parsedData = await parseResume(req.file.buffer);

        // 2. Validate the parsed data against our Zod schema
        const validationResult = resumeSchema.safeParse(parsedData);

        if (!validationResult.success) {
          console.error("Parser output failed validation:", validationResult.error);
          return res.status(500).json({
            error: 'The parsed resume data failed our internal validation.'
          });
        }

        // 3. Return the clean, validated data
        return res.status(200).json(validationResult.data);

      } catch (error) {
        console.error('Error parsing resume:', error);
        return res.status(500).json({ error: 'An unexpected error occurred during parsing.' });
      }
    });

    // --- Server Start ---
    app.listen(port, () => {
      console.log(`Parser service listening on http://localhost:${port}`);
    });
    ```

### **Step 2.5: Install Dependencies**

1.  **Action:** Run `pnpm install` from the monorepo root to install dependencies and link the shared schema package.
2.  **Command:**
    ```bash
    pnpm install
    ```

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure the `services/parser` directory and all specified files have been created correctly.
2.  **[ ] Check `node_modules`:** Verify that `node_modules` exists inside `services/parser` and contains `express`, `multer`, etc., and that `@resume-platform/schema` is a symbolic link.
3.  **[ ] Run Linter & Type Check:** Run `pnpm lint` and `pnpm tsc --noEmit -p services/parser/tsconfig.json` from the root. Both should complete without errors.
4.  **[ ] Start the Service:** From the root, run `pnpm --filter @resume-platform/parser-service dev`. The console should log `Parser service listening on http://localhost:3001`.
5.  **[ ] Test with `curl`:**
    *   Save a sample resume PDF as `sample.pdf`.
    *   Execute the following command in your terminal:
        ```bash
        curl -X POST -F "file=@sample.pdf" http://localhost:3001/api/import
        ```
    *   **Expected Outcome:** The command should return a `200 OK` status and a JSON object that matches the JSON Resume schema structure.
6.  **[ ] Test Error Case:**
    *   Execute `curl -X POST http://localhost:3001/api/import`.
    *   **Expected Outcome:** The command should return a `400 Bad Request` status and the JSON body `{ "error": "No file uploaded." }`.