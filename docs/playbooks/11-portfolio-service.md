# Playbook 11: Portfolio Service

**Objective:** To create the `@resume-platform/portfolio-service`. This service will be responsible for integrating with the GitHub API to fetch a user's public repositories and contribution data, allowing users to easily showcase their work on their resume.

---

## 1. Research & Rationale

-   **Framework (`Express.js`):** Continuing with Express.js for a lightweight and reliable API service.
-   **GitHub API Client (`Octokit`):** Octokit is the official, full-featured GitHub API client for Node.js. Using it is preferable to making raw `fetch` requests because it handles authentication, pagination, and rate limiting much more gracefully. This simplifies our code and makes it more robust.
-   **Authentication:** To access the GitHub API, especially for user-specific data, we will need an access token. The most secure approach is to have the user provide their own Personal Access Token (PAT) with the `public_repo` and `read:user` scopes. This service will accept the PAT in the request header and use it to authenticate with Octokit. This avoids storing user tokens.
-   **API Endpoints:** The service will expose a primary endpoint to fetch all relevant data in one call:
    -   `/api/portfolio/github/sync`: This endpoint will take a GitHub username and an auth token, then fetch both the user's profile information and their public repositories.
-   **Data Caching:** GitHub API has rate limits. To prevent hitting these limits and to speed up responses, a simple in-memory cache will be used to store the results for a short period (e.g., 1-2 hours). For a production system, this could be upgraded to a Redis cache.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new service.
2.  **Command:**
    ```bash
    mkdir -p services/portfolio/src
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file.
2.  **File Content (`services/portfolio/package.json`):**
    ```json
    {
      "name": "@resume-platform/portfolio-service",
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
        "octokit": "^4.0.2"
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
2.  **File Content (`services/portfolio/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": { "outDir": "./dist", "module": "commonjs" },
      "include": ["src"]
    }
    ```
3.  **Action:** Create a `.env.example` file.
4.  **File Content (`services/portfolio/.env.example`):**
    ```
    PORT=3007
    ```

### **Step 2.4: Implement the Express Server**

1.  **Action:** Create the main server file `services/portfolio/src/index.ts`.
2.  **File Content:**
    ```typescript
    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import { getGitHubData } from './github-handler';

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

      try {
        const data = await getGitHubData(username, token);
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GitHub data.' });
      }
    });

    app.listen(port, () => {
      console.log(`Portfolio service listening on http://localhost:${port}`);
    });
    ```

### **Step 2.5: Implement GitHub Handler Logic**

1.  **Action:** Create `services/portfolio/src/github-handler.ts`.
2.  **File Content:**
    ```typescript
    import { Octokit } from 'octokit';

    // A simple in-memory cache
    const cache = new Map<string, { data: any; timestamp: number }>();
    const CACHE_TTL = 1000 * 60 * 60; // 1 hour

    export async function getGitHubData(username: string, token: string) {
      const cached = cache.get(username);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const octokit = new Octokit({ auth: token });

      const [userResponse, reposResponse] = await Promise.all([
        octokit.rest.users.getByUsername({ username }),
        octokit.rest.repos.listForUser({ username, type: 'owner', sort: 'updated' }),
      ]);

      const filteredRepos = reposResponse.data.map(repo => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
      }));

      const result = {
        user: {
          name: userResponse.data.name,
          avatarUrl: userResponse.data.avatar_url,
          bio: userResponse.data.bio,
        },
        repos: filteredRepos,
      };

      cache.set(username, { data: result, timestamp: Date.now() });
      return result;
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

1.  **[ ] Prerequisite:** A GitHub Personal Access Token (PAT) with `public_repo` and `read:user` scopes.
2.  **[ ] Start the Service:** Create a `.env` file, then run `pnpm --filter @resume-platform/portfolio-service dev`.
3.  **[ ] Test with `curl`:**
    *   Replace `YOUR_USERNAME` with a valid GitHub username and `YOUR_PAT` with your token.
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_PAT" \
    -d '{"username": "YOUR_USERNAME"}' \
    http://localhost:3007/api/portfolio/github/sync
    ```
    *   **Expected Outcome:** A `200 OK` response with a JSON object containing `user` and `repos` keys, populated with data from the GitHub API.