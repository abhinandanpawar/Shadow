# Playbook 08: Skills Service

**Objective:** To create the `@resume-platform/skills-service`. This microservice will accept a list of skills, normalize them against standardized taxonomies (ESCO and O*NET), and return enriched data, including standardized names and URIs.

---

## 1. Research & Rationale

-   **Framework (`Express.js`):** We will continue with Express.js for its simplicity and suitability for API-driven services.
-   **Taxonomy Integration (ESCO/O*NET):**
    -   **ESCO (European Skills, Competences, Qualifications and Occupations):** Provides a multilingual classification of skills and occupations. ESCO offers a REST API that can be used to search for skills. This is the preferred method as it ensures we are always using the most up-to-date data.
    -   **O*NET (Occupational Information Network):** A US-based database. While it also has APIs, for this service, we will primarily focus on ESCO for its comprehensive API and multilingual support, which aligns with our broader feature goals.
-   **API Client (`Axios`):** Axios is a robust and widely-used HTTP client for Node.js. It will be used to make requests to the external ESCO API. Its clear syntax for handling requests and responses makes it an ideal choice.
-   **Caching Strategy:** External API calls can be slow and may be rate-limited. A simple in-memory cache (e.g., using a `Map`) will be implemented to store the results of recent normalization requests. For a production system, this could be upgraded to a more persistent cache like Redis.
-   **Environment Variables:** The service will need to store the base URL for the ESCO API, which should be managed via environment variables.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new service.
2.  **Command:**
    ```bash
    mkdir -p services/skills/src
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file.
2.  **File Content (`services/skills/package.json`):**
    ```json
    {
      "name": "@resume-platform/skills-service",
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
        "axios": "^1.7.2"
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

1.  **Action:** Create the `tsconfig.json` file.
2.  **File Content (`services/skills/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": { "outDir": "./dist", "module": "commonjs" },
      "include": ["src"]
    }
    ```
3.  **Action:** Create a `.env.example` file.
4.  **File Content (`services/skills/.env.example`):**
    ```
    PORT=3004
    ESCO_API_URL="https://ec.europa.eu/esco/api"
    ```

### **Step 2.4: Implement the Express Server**

1.  **Action:** Create the main server file `services/skills/src/index.ts`.
2.  **File Content:**
    ```typescript
    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import { normalizeSkills } from './skill-normalizer';

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
      try {
        const results = await normalizeSkills(skills);
        return res.status(200).json({ normalized: results });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to normalize skills.' });
      }
    });

    app.listen(port, () => {
      console.log(`Skills service listening on http://localhost:${port}`);
    });
    ```

### **Step 2.5: Implement Normalizer Logic**

1.  **Action:** Create `services/skills/src/skill-normalizer.ts`.
2.  **File Content:**
    ```typescript
    import axios from 'axios';

    const ESCO_API_URL = process.env.ESCO_API_URL || 'https://ec.europa.eu/esco/api';
    const cache = new Map<string, any>();

    interface NormalizedSkill {
      original: string;
      standard: string | null;
      escoUri: string | null;
    }

    export async function normalizeSkills(skills: string[]): Promise<NormalizedSkill[]> {
      const promises = skills.map(async (skill) => {
        if (cache.has(skill)) {
          return cache.get(skill);
        }

        try {
          const response = await axios.get(`${ESCO_API_URL}/search`, {
            params: {
              language: 'en',
              type: 'skill',
              text: skill,
            },
          });

          const results = response.data?._embedded?.results;
          if (results && results.length > 0) {
            const topResult = results[0];
            const normalized = {
              original: skill,
              standard: topResult.title,
              escoUri: topResult.uri,
            };
            cache.set(skill, normalized);
            return normalized;
          }
        } catch (error) {
          console.error(`Failed to normalize skill: ${skill}`, error);
        }

        const failedResult = { original: skill, standard: null, escoUri: null };
        cache.set(skill, failedResult);
        return failedResult;
      });

      return Promise.all(promises);
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

1.  **[ ] Check File Structure:** Ensure all files and directories are created correctly.
2.  **[ ] Run Linter & Type Check:** Run `pnpm lint` and `pnpm tsc --noEmit -p services/skills/tsconfig.json`.
3.  **[ ] Start the Service:** Create a `.env` file, then run `pnpm --filter @resume-platform/skills-service dev`.
4.  **[ ] Test with `curl`:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"skills": ["javascript", "web development", "pyton"]}' \
    http://localhost:3004/api/skills/normalize
    ```
    *   **Expected Outcome:** A JSON response like:
        ```json
        {
          "normalized": [
            { "original": "javascript", "standard": "javascript", "escoUri": "..." },
            { "original": "web development", "standard": "web development", "escoUri": "..." },
            { "original": "pyton", "standard": "python", "escoUri": "..." }
          ]
        }
        ```
        *(Note: The ESCO API might correct typos like "pyton" to "python").*