# Playbook 09: Search Service

**Objective:** To create the `@resume-platform/search-service`. This service will provide a powerful search API by interfacing with an OpenSearch cluster. It will be responsible for indexing resume data and executing hybrid search queries that combine traditional text-based (lexical) search with modern vector-based (semantic) search.

---

## 1. Research & Rationale

-   **Framework (`Express.js`):** Continuing with Express.js for a lightweight API service.
-   **Search Engine (`OpenSearch`):** OpenSearch is chosen for its powerful open-source search capabilities, especially its robust support for hybrid search. It allows us to combine the strengths of BM25 (for keyword relevance) and k-NN (for semantic similarity) in a single query. This is critical for finding not just resumes with the right keywords, but also those with semantically similar concepts.
-   **OpenSearch Client (`@opensearch-project/opensearch`):** This is the official Node.js client for OpenSearch. It provides a convenient, high-level interface for all interactions with the cluster, from creating indices to running complex search queries.
-   **Indexing Strategy:**
    -   A dedicated index (e.g., `resumes`) will be created.
    -   The index mapping will be explicitly defined to tell OpenSearch how to treat each field (e.g., `text`, `keyword`, `dense_vector`). This is crucial for enabling hybrid search.
    -   Resume data will be "flattened" before indexing. For example, all text from work experience, skills, and summaries will be concatenated into a single `full_text` field for lexical search. A separate vector embedding will be generated for this text and stored in a `vector_embedding` field.
-   **Vector Embeddings:** To perform semantic search, text must be converted into vector embeddings. This task will be delegated to the `ats-ai-service` (which has the sentence-transformer model). The search service will call the AI service to get the vector for a given query before executing the search.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new service.
2.  **Command:**
    ```bash
    mkdir -p services/search/src
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file.
2.  **File Content (`services/search/package.json`):**
    ```json
    {
      "name": "@resume-platform/search-service",
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
        "@opensearch-project/opensearch": "^2.9.0",
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
2.  **File Content (`services/search/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": { "outDir": "./dist", "module": "commonjs" },
      "include": ["src"]
    }
    ```
3.  **Action:** Create a `.env.example` file.
4.  **File Content (`services/search/.env.example`):**
    ```
    PORT=3005
    OPENSEARCH_NODE_URL="http://localhost:9200"
    AI_SERVICE_URL="http://localhost:3002"
    ```

### **Step 2.4: Implement the Express Server**

1.  **Action:** Create the main server file `services/search/src/index.ts`.
2.  **File Content:**
    ```typescript
    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import { searchResumes, indexResume } from './opensearch-client';

    dotenv.config();
    const app = express();
    const port = process.env.PORT || 3005;

    app.use(cors({ origin: 'http://localhost:3000' }));
    app.use(express.json());

    // Endpoint to index a new or updated resume
    app.post('/api/search/index', async (req, res) => {
      const { resumeId, resumeData } = req.body;
      try {
        await indexResume(resumeId, resumeData);
        res.status(200).json({ message: 'Resume indexed successfully.' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to index resume.' });
      }
    });

    // Endpoint to perform a search
    app.get('/api/search', async (req, res) => {
      const query = req.query.query as string;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
      }
      try {
        const results = await searchResumes(query);
        res.status(200).json({ results });
      } catch (error) {
        res.status(500).json({ error: 'Search failed.' });
      }
    });

    app.listen(port, () => {
      console.log(`Search service listening on http://localhost:${port}`);
    });
    ```

### **Step 2.5: Implement OpenSearch Client Logic**

1.  **Action:** Create `services/search/src/opensearch-client.ts`.
2.  **File Content:**
    ```typescript
    import { Client } from '@opensearch-project/opensearch';
    import axios from 'axios';

    const client = new Client({ node: process.env.OPENSEARCH_NODE_URL });
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
    const INDEX_NAME = 'resumes';

    // (A function to create the index with the correct mapping should be run once on setup)

    export async function indexResume(resumeId: string, resumeData: any) {
      const fullText = JSON.stringify(resumeData); // Simplified text extraction
      const { data: { embedding } } = await axios.post(`${AI_SERVICE_URL}/api/ai/embed`, { text: fullText });

      await client.index({
        index: INDEX_NAME,
        id: resumeId,
        body: {
          full_text: fullText,
          vector_embedding: embedding,
          ...resumeData.basics,
        },
        refresh: true,
      });
    }

    export async function searchResumes(query: string) {
      const { data: { embedding } } = await axios.post(`${AI_SERVICE_URL}/api/ai/embed`, { text: query });

      const response = await client.search({
        index: INDEX_NAME,
        body: {
          query: {
            hybrid: {
              queries: [
                { match: { full_text: { query: query } } },
                { knn: { vector_embedding: { vector: embedding, k: 5 } } }
              ]
            }
          }
        }
      });
      return response.body.hits.hits;
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

1.  **[ ] Prerequisite:** An OpenSearch cluster must be running and accessible at the URL specified in `.env`.
2.  **[ ] Prerequisite:** The `ats-ai-service` must be running to provide vector embeddings.
3.  **[ ] Setup Index:** Manually or via a script, create the `resumes` index in OpenSearch with the correct mapping for `full_text` (type `text`) and `vector_embedding` (type `knn_vector`).
4.  **[ ] Start the Service:** Create a `.env` file, then run `pnpm --filter @resume-platform/search-service dev`.
5.  **[ ] Test Indexing with `curl`:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"resumeId": "123", "resumeData": {"basics": {"summary": "Experienced React developer"}}}' \
    http://localhost:3005/api/search/index
    ```
    *   **Expected Outcome:** A `200 OK` response with `{ "message": "Resume indexed successfully." }`.
6.  **[ ] Test Searching with `curl`:**
    ```bash
    curl -X GET "http://localhost:3005/api/search?query=React%20developer"
    ```
    *   **Expected Outcome:** A `200 OK` response with a `results` array containing the document indexed in the previous step.