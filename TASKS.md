# Master Task List

**Objective:** This document outlines the granular, actionable tasks required to build the Resume Platform. It is designed to be used by a team of "Jules" agents, enabling parallel development. Each task references the relevant playbook in the `docs/playbooks/` directory.

**Prerequisite:** Before starting any task, a developer must run `pnpm install` once at the root of the monorepo to install all dependencies and link the workspaces.

---

## Phase 0: Foundational Tooling & DX (Do First)

### **Task 0.1: Set Up and Configure the Mock API Server**
-   **Status:** [COMPLETED]
-   **Objective:** Enable parallel frontend development by creating a mock API server.
-   **Package:** `apps/web`
-   **Playbook Reference:** `docs/playbooks/12-mock-server-setup.md`
-   **Definition of Done:**
    1.  `msw` is installed and configured in the `apps/web` package.
    2.  The `public/mockServiceWorker.js` file is generated.
    3.  Mock handlers are created in `apps/web/src/mocks/handlers.ts` for all API endpoints defined in `openapi.yaml`.
    4.  When running the dev server (`pnpm --filter web dev`), the `[MSW] Mocking enabled.` message appears in the browser console.
    5.  Frontend requests to API endpoints are intercepted and receive the correct mock responses.

### **Task 0.2: Build and Deploy the Sentence-Transformer Service**
-   **Status:** [COMPLETED]
-   **Objective:** Create the Python-based microservice for generating vector embeddings.
-   **Package:** `@resume-platform/sentence-transformer-service`
-   **Playbook Reference:** `docs/playbooks/13-sentence-transformer-service.md`
-   **Definition of Done:**
    1.  The Flask application is created in `services/sentence-transformer`.
    2.  The `Dockerfile` is created.
    3.  The Docker image for the service can be built successfully.
    4.  When the container is run, the `/api/ai/embed` endpoint correctly accepts text and returns a 384-dimensional vector embedding.

### **Task 0.3: Set Up and Configure the Testing Framework**
-   **Status:** [COMPLETED]
-   **Objective:** Integrate Jest and React Testing Library into the monorepo.
-   **Package:** Root-level and all sub-packages.
-   **Playbook Reference:** `docs/playbooks/14-testing-setup.md`
-   **Definition of Done:**
    1.  All testing dependencies are installed at the root.
    2.  The `jest.config.base.js` is created at the root.
    3.  Each package has its own `jest.config.js` extending the base config.
    4.  The example test for the `Button` component in `@resume-platform/ui` passes when `pnpm test` is run from the root.

### **Task 0.4: Set Up and Configure the CI Pipeline**
-   **Status:** [COMPLETED]
-   **Objective:** Create the GitHub Actions workflow for continuous integration.
-   **Package:** Root-level (`.github/workflows`)
-   **Playbook Reference:** `docs/playbooks/15-ci-pipeline-setup.md`
-   **Definition of Done:**
    1.  The `.github/workflows/main.yml` file is created.
    2.  Upon pushing a commit to GitHub, the "CI" action is triggered.
    3.  The action successfully runs `pnpm install`, `pnpm lint`, and `pnpm test` and passes.

---

## Phase 1: Foundational Packages

### **Task 1.1: Complete the Core Schema Package**
-   **Status:** [COMPLETED]
-   **Objective:** Fully implement all remaining Zod schemas for the JSON Resume standard.
-   **Package:** `@resume-platform/schema`
-   **Playbook Reference:** `docs/playbooks/02-core-schema-package.md`
-   **Files to Modify:** `packages/schema/src/`
-   **Definition of Done:**
    1.  Create separate `.ts` files for `volunteer`, `awards`, `publications`, `languages`, `interests`, `references`, and `projects`.
    2.  Implement the Zod schema for each section according to the official JSON Resume v1.0.0 spec.
    3.  Import and integrate all new schemas into the main `resumeSchema` in `packages/schema/src/index.ts`.
    4.  All type checks and linter commands pass for the package.

### **Task 1.2: Build Out the Shared UI Library**
-   **Status:** [COMPLETED]
-   **Objective:** Create a comprehensive set of reusable React components for the application.
-   **Package:** `@resume-platform/ui`
-   **Playbook Reference:** `docs/playbooks/03-shared-ui-package.md`
-   **Files to Modify:** `packages/ui/src/components/` and `packages/ui/src/index.tsx`
-   **Definition of Done:**
    1.  Implement the following components with appropriate styling and props: `Card`, `Modal`, `Select`, `Textarea`, `Label`.
    2.  Export all new components from `index.tsx`.
    3.  All type checks and linter commands pass for the package.

---

## Phase 2: Core Services Implementation

### **Task 2.1: Implement Parser Service Logic (Manual Integration)**
-   **Objective:** Integrate the OpenResume parsing logic into the parser service.
-   **Package:** `@resume-platform/parser-service`
-   **Playbook Reference:** `docs/playbooks/05-parser-service.md` (Specifically, follow the "Manual Integration Guide" in Step 2.0)
-   **Files to Modify:** `services/parser/src/`
-   **Definition of Done:**
    1.  The relevant parsing engine files from the OpenResume GitHub repository are copied into `services/parser/src/lib`.
    2.  The code is refactored to run in a standard Node.js environment.
    3.  The `/api/import` endpoint logic is implemented to use the integrated parser, validate the output against `@resume-platform/schema`, and return the validated JSON.
    4.  The service passes all verification steps outlined in the playbook.

### **Task 2.2: Implement PDF Exporter Logic**
-   **Objective:** Implement the PDF generation logic in the exporter service.
-   **Package:** `@resume-platform/exporter-service`
-   **Playbook Reference:** `docs/playbooks/07-exporter-service.md`
-   **Files to Modify:** `services/exporter/src/index.ts` and `services/exporter/src/pdf-generator.ts`.
-   **Definition of Done:**
    1.  The EJS template in `templates/basic.ejs` is completed to render a full resume.
    2.  The `generatePdf` function correctly renders the template and generates a tagged, accessible PDF using Puppeteer.
    3.  The `/api/export/pdf` endpoint returns a valid PDF file.

### **Task 2.3: Implement LaTeX Exporter Logic**
-   **Objective:** Implement the LaTeX file generation logic.
-   **Package:** `@resume-platform/exporter-service`
-   **Playbook Reference:** `docs/playbooks/07-exporter-service.md`
-   **Files to Modify:** `services/exporter/src/index.ts` and a new `latex-generator.ts`.
-   **Definition of Done:**
    1.  The LaTeX template in `templates/awesome-cv.tex.template` is completed.
    2.  The `generateLatex` function replaces placeholders in the template with resume data.
    3.  The `/api/export/latex` endpoint returns a valid `.tex` file string.

---

## Phase 3: AI & Advanced Services Implementation (Parallelizable)

### **Task 3.1: Implement ATS Scoring Logic**
-   **Objective:** Implement the ATS scoring and keyword analysis logic.
-   **Package:** `@resume-platform/ats-ai-service`
-   **Playbook Reference:** `docs/playbooks/06-ats-ai-service.md`
-   **Files to Modify:** `services/ats-ai/src/index.ts` and a new `ats-logic.ts`.
-   **Definition of Done:**
    1.  A robust keyword extraction algorithm is implemented.
    2.  The logic in the `/api/ats/score` endpoint is implemented to compare resume text against a job description and return a score and keyword gap analysis.

### **Task 3.2: Implement AI Suggestion Logic**
-   **Objective:** Implement the AI-powered content suggestion logic.
-   **Package:** `@resume-platform/ats-ai-service`
-   **Playbook Reference:** `docs/playbooks/06-ats-ai-service.md`
-   **Files to Modify:** `services/ats-ai/src/index.ts` and a new `llm-provider.ts`.
-   **Definition of Done:**
    1.  An abstraction layer for communicating with an LLM provider is created.
    2.  The logic in the `/api/ai/suggest` endpoint is implemented to construct a prompt, send it to the LLM, and return the suggestions.

### **Task 3.3: Implement Skills Normalization Logic**
-   **Objective:** Implement the skill normalization logic using the ESCO API.
-   **Package:** `@resume-platform/skills-service`
-   **Playbook Reference:** `docs/playbooks/08-skills-service.md`
-   **Files to Modify:** `services/skills/src/index.ts` and a new `skill-normalizer.ts`.
-   **Definition of Done:**
    1.  The `normalizeSkills` function is implemented to call the ESCO API.
    2.  Caching is added to prevent redundant API calls.
    3.  The `/api/skills/normalize` endpoint returns correctly structured data.

*(Additional tasks for Search, VC, and Portfolio services would follow this same pattern, referencing their respective playbooks.)*

---

## Phase 4: Frontend Integration

### **Task 4.1: Build the Resume Editor UI**
-   **Objective:** Build the main resume editor interface.
-   **Package:** `apps/web`
-   **Playbook Reference:** `docs/playbooks/04-nextjs-web-app-setup.md`
-   **Files to Modify:** `apps/web/src/app/editor/page.tsx` (new file) and related components.
-   **Definition of Done:**
    1.  A form layout with sections for each part of the JSON Resume schema is created.
    2.  The components from `@resume-platform/ui` are used for all inputs, buttons, etc.
    3.  A client-side state management solution (e.g., Zustand) is implemented to hold the resume data.
    4.  The form is fully functional and updates the central state.

*(Additional tasks for integrating each service's API with the frontend would follow this pattern.)*