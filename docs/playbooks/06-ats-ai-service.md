# Playbook 06: ATS & AI Service

**Objective:** To create the `@resume-platform/ats-ai-service`. This service is the intelligent core of the platform, responsible for scoring resumes against job descriptions, analyzing keyword gaps, and providing AI-powered content suggestions.

---

## 1. Research & Rationale

-   **Framework (`Express.js`):** Continuing with Express.js for its simplicity and robustness, which is well-suited for this API-driven service.
-   **AI Model Integration Strategy:** This service needs to interact with multiple AI models. The architecture will be designed for modularity and flexibility:
    -   **LLM Abstraction:** We will create a simple abstraction layer (e.g., `llm-provider.ts`) to handle communication with Large Language Models. This allows us to easily swap between providers like OpenAI, Anthropic, or a self-hosted model without changing the core application logic.
    -   **Sentence-Transformers:** For semantic similarity, the most effective libraries are Python-based. The best approach is to either:
        1.  Create a very small, dedicated Python microservice (e.g., using Flask or FastAPI) that this Node.js service can call.
        2.  Use a Node.js library that can run ONNX-exported transformer models.
        For this playbook, we will assume the existence of a simple, callable Python service and focus on the Node.js orchestration, as it's the more common and scalable pattern.
-   **ATS Scoring Logic:** The initial ATS score will be based on a straightforward keyword matching algorithm. It will extract keywords from the job description and check for their presence in the resume. This provides immediate value and can be enhanced with more sophisticated NLP techniques later.
-   **Configuration (`.env`):** This service will require API keys for external services (like an LLM provider). These will be managed through environment variables, and a `.env.example` file will be documented to show what's required.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new service.
2.  **Command:**
    ```bash
    mkdir -p services/ats-ai/src
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file for the service.
2.  **File Content (`services/ats-ai/package.json`):**
    ```json
    {
      "name": "@resume-platform/ats-ai-service",
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
        "dotenv": "^16.4.5",
        "openai": "^4.47.1", // Example LLM client
        "axios": "^1.7.2", // For calling other microservices (e.g., sentence-transformer service)
        "@resume-platform/schema": "workspace:*"
      },
      "devDependencies": {
        "typescript": "^5.4.5",
        "ts-node-dev": "^2.0.0",
        "@types/express": "^4.17.21",
        "@types/cors": "^2.8.17",
        "eslint": "^8.57.0"
      }
    }
    ```

### **Step 2.3: Create `tsconfig.json` and Environment File**

1.  **Action:** Create a `tsconfig.json` file.
2.  **File Content (`services/ats-ai/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": { "outDir": "./dist", "module": "commonjs" },
      "include": ["src"]
    }
    ```
3.  **Action:** Create a `.env.example` file to document required environment variables.
4.  **File Content (`services/ats-ai/.env.example`):**
    ```
    PORT=3002
    OPENAI_API_KEY="your-key-here"
    SENTENCE_TRANSFORMER_SERVICE_URL="http://localhost:5000/embed"
    ```

### **Step 2.4: Implement the Express Server**

1.  **Action:** Create the main server file `services/ats-ai/src/index.ts`.
2.  **File Content:**
    ```typescript
    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import { scoreResume, suggestImprovements } from './ats-logic';

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
      const { resume, section, context } = req.body;
      if (!resume || !section) {
        return res.status(400).json({ error: 'Resume and section are required.' });
      }
      try {
        const result = await suggestImprovements({ resume, section, context });
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to get suggestions.' });
      }
    });

    // --- Server Start ---
    app.listen(port, () => {
      console.log(`ATS & AI service listening on http://localhost:${port}`);
    });
    ```

### **Step 2.5: Implement Core Logic**

1.  **Action:** Create `services/ats-ai/src/ats-logic.ts` to contain the business logic.
2.  **File Content:**
    ```typescript
    import { Resume } from '@resume-platform/schema';
    // This is a placeholder for the actual LLM provider logic
    import { getLLMSuggestions } from './llm-provider';

    // A simple keyword extraction function (can be improved with NLP libraries)
    const extractKeywords = (text: string): string[] => {
      return text.toLowerCase().match(/\b(\w+)\b/g) || [];
    };

    export async function scoreResume(resume: Resume, jobDescription: string) {
      const resumeText = JSON.stringify(resume);
      const jdKeywords = new Set(extractKeywords(jobDescription));
      const resumeKeywords = new Set(extractKeywords(resumeText));

      const found = [...jdKeywords].filter(k => resumeKeywords.has(k));
      const missing = [...jdKeywords].filter(k => !resumeKeywords.has(k));

      const overallScore = Math.round((found.length / jdKeywords.size) * 100);

      return {
        overallScore: isNaN(overallScore) ? 0 : overallScore,
        keywordCoverage: { found, missing },
        formatOk: true, // Placeholder
      };
    }

    export async function suggestImprovements(data: { resume: Resume, section: string, context?: string }) {
      // In a real implementation, this would be a more sophisticated prompt
      const prompt = `Given the resume section "${data.section}", suggest improvements. Context: ${data.context || 'N/A'}`;
      const suggestions = await getLLMSuggestions(prompt);
      return { suggestions };
    }
    ```

### **Step 2.6: Install Dependencies**

1.  **Action:** Run `pnpm install` from the monorepo root.
2.  **Command:**
    ```bash
    pnpm install
    ```

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure all files and directories for the service are created correctly.
2.  **[ ] Check `node_modules`:** Verify `node_modules` exists and contains the required dependencies.
3.  **[ ] Run Linter & Type Check:** Run `pnpm lint` and `pnpm tsc --noEmit -p services/ats-ai/tsconfig.json`.
4.  **[ ] Start the Service:** Create a `.env` file from the example, then run `pnpm --filter @resume-platform/ats-ai-service dev`. The service should start successfully.
5.  **[ ] Test `/api/ats/score` with `curl`:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"resume": {"basics": {"summary": "I am a skilled React developer"}}, "jobDescription": "We need a React and Node developer"}' \
    http://localhost:3002/api/ats/score
    ```
    *   **Expected Outcome:** A JSON response with `overallScore`, `keywordCoverage`, etc.
6.  **[ ] Test `/api/ai/suggest` with `curl`:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"resume": {}, "section": "summary", "context": "Make it more professional for a FAANG company"}' \
    http://localhost:3002/api/ai/suggest
    ```
    *   **Expected Outcome:** A JSON response with an array of `suggestions` (this will be a mock/placeholder if the LLM provider is not fully configured).