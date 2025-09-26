# Playbook 12: Mock Server Setup

**Objective:** To set up a mock API server within the `apps/web` application using `msw` (Mock Service Worker). This is a critical piece of developer experience (DX) that will unblock parallel development by allowing the frontend team to build and test features against a predictable, fake API that adheres to our `openapi.yaml` contract.

---

## 1. Research & Rationale

-   **Problem:** The frontend application (`apps/web`) is dependent on the backend microservices. Without a mock server, frontend development is blocked until the backend APIs are deployed and functional.
-   **Solution (`msw`):** Mock Service Worker is the ideal tool to solve this. It uses the Service Worker API to intercept outgoing requests from the browser at the network level. This means the application code does not need to be changed at all; it continues to make `fetch` requests to `/api/import`, etc., but `msw` catches them and returns a mocked response.
-   **Strategy:**
    1.  We will install `msw` as a development dependency in the `apps/web` package.
    2.  We will create a set of "request handlers" that define the mocked responses for each of our API endpoints (e.g., a handler for `/api/import`, a handler for `/api/ats/score`).
    3.  These handlers will be initialized only in a development environment, ensuring they are not bundled in the production build.
    4.  The mock data returned by the handlers will be based on the schemas defined in our `openapi.yaml` file to ensure consistency.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Install Dependencies**

1.  **Action:** Install `msw` as a dev dependency in the `apps/web` package.
2.  **Command (from monorepo root):**
    ```bash
    pnpm --filter web add -D msw
    ```

### **Step 2.2: Create Mock Handlers**

1.  **Action:** Create a new directory to house the mock server logic.
2.  **Command:**
    ```bash
    mkdir -p apps/web/src/mocks
    ```
3.  **Action:** Create a `handlers.ts` file. This file will define the mocked responses for our API endpoints.
4.  **File Content (`apps/web/src/mocks/handlers.ts`):**
    ```typescript
    import { http, HttpResponse } from 'msw';

    // This is where we define the mock data, which should align with our OpenAPI spec.
    const mockResume = {
      basics: { name: 'Mocked John Doe', email: 'mock@example.com' },
      // ... other sections
    };

    export const handlers = [
      // Mock for the parser service
      http.post('/api/import', () => {
        return HttpResponse.json(mockResume);
      }),

      // Mock for the ATS/AI service
      http.post('/api/ats/score', () => {
        return HttpResponse.json({
          overallScore: 88,
          keywordCoverage: { found: ['React'], missing: ['Node.js'] },
        });
      }),

      // Add mocks for all other API endpoints here...
    ];
    ```

### **Step 2.3: Create the Browser-Side Setup**

1.  **Action:** Create the `browser.ts` file to set up the `msw` worker for the browser.
2.  **File Content (`apps/web/src/mocks/browser.ts`):**
    ```typescript
    import { setupWorker } from 'msw/browser';
    import { handlers } from './handlers';

    export const worker = setupWorker(...handlers);
    ```

### **Step 2.4: Create a Mocking Initializer Component**

1.  **Action:** Create a client component that will start the mock service worker only in development.
2.  **File Content (`apps/web/src/mocks/MSWComponent.tsx`):**
    ```typescript
    'use client';
    import { useEffect } from 'react';

    export function MSWComponent() {
      useEffect(() => {
        if (typeof window !== 'undefined') {
          if (process.env.NODE_ENV === 'development') {
            require('./browser');
            const { worker } = require('./browser');
            worker.start();
          }
        }
      }, []);

      return null;
    }
    ```

### **Step 2.5: Integrate into the Root Layout**

1.  **Action:** Modify the root layout of the web app to include the `MSWComponent`.
2.  **File Content (`apps/web/src/app/layout.tsx`):**
    ```typescript
    // ... other imports
    import { MSWComponent } from '../mocks/MSWComponent';

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body>
            {process.env.NODE_ENV === 'development' && <MSWComponent />}
            {children}
          </body>
        </html>
      );
    }
    ```

### **Step 2.6: Generate the Service Worker**

1.  **Action:** `msw` requires a service worker file to be present in the `public` directory. We can generate this using the `msw` CLI.
2.  **Command (from monorepo root):**
    ```bash
    pnpm --filter web msw init public/
    ```
    This will create a `public/mockServiceWorker.js` file.

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure all new files (`handlers.ts`, `browser.ts`, `MSWComponent.tsx`) and the `public/mockServiceWorker.js` file have been created correctly.
2.  **[ ] Start the Development Server:** Run `pnpm --filter web dev`.
3.  **[ ] Verify in Browser:**
    *   Open the browser's developer console.
    *   You should see a message like `[MSW] Mocking enabled.` This confirms the mock server is active.
4.  **[ ] Test API Interception:**
    *   Add a test `fetch` call inside a component in the web app (e.g., a button that calls `fetch('/api/ats/score', { method: 'POST' })`).
    *   Click the button and observe the "Network" tab in the developer console.
    *   The request should appear, and its response should be the mocked JSON data (`{ "overallScore": 88, ... }`). Crucially, the request should **not** actually hit a real network endpoint but should be intercepted by the service worker. This confirms the setup is working and the frontend is successfully decoupled.