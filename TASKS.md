# Master Task List

**Objective:** This document outlines the granular, actionable tasks required to build the Resume Platform. It is designed to be used by a team of "Jules" agents, enabling parallel development. Each task references the relevant playbook in the `docs/playbooks/` directory.

**Prerequisite:** Before starting any task, a developer must run `pnpm install` once at the root of the monorepo to install all dependencies and link the workspaces.

---

## Phase 1: Foundational Packages

### **Task 1.1: Complete the Core Schema Package**
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

### **Task 2.1: Implement Parser Service Logic**
-   **Objective:** Integrate the OpenResume parsing logic into the parser service.
-   **Package:** `@resume-platform/parser-service`
-   **Playbook Reference:** `docs/playbooks/05-parser-service.md`
-   **Files to Modify:** `services/parser/src/index.ts` and new handler files.
-   **Definition of Done:**
    1.  Manually integrate the core parsing engine from the OpenResume GitHub repository.
    2.  Implement the `/api/import` endpoint logic to take a file buffer, run it through the parser, validate the output against the `@resume-platform/schema`, and return the validated JSON.
    3.  The service passes all verification steps outlined in the playbook, including the `curl` test.

### **Task 2.2: Implement PDF Exporter Logic**
-   **Objective:** Implement the PDF generation logic in the exporter service.
-   **Package:** `@resume-platform/exporter-service`
-   **Playbook Reference:** `docs/playbooks/07-exporter-service.md`
-   **Files to Modify:** `services/exporter/src/index.ts` and `services/exporter/src/pdf-generator.ts`.
-   **Definition of Done:**
    1.  Complete the EJS template in `templates/basic.ejs` to render a full resume.
    2.  Implement the `generatePdf` function to correctly render the template with resume data and generate a tagged, accessible PDF using Puppeteer.
    3.  The `/api/export/pdf` endpoint returns a valid PDF file.

### **Task 2.3: Implement LaTeX Exporter Logic**
-   **Objective:** Implement the LaTeX file generation logic.
-   **Package:** `@resume-platform/exporter-service`
-   **Playbook Reference:** `docs/playbooks/07-exporter-service.md`
-   **Files to Modify:** `services/exporter/src/index.ts` and a new `latex-generator.ts`.
-   **Definition of Done:**
    1.  Complete the LaTeX template in `templates/awesome-cv.tex.template`.
    2.  Implement the `generateLatex` function to replace placeholders in the template with resume data.
    3.  The `/api/export/latex` endpoint returns a valid `.tex` file string.

---

## Phase 3: AI & Advanced Services Implementation (Parallelizable)

### **Task 3.1: Implement ATS Scoring Logic**
-   **Objective:** Implement the ATS scoring and keyword analysis logic.
-   **Package:** `@resume-platform/ats-ai-service`
-   **Playbook Reference:** `docs/playbooks/06-ats-ai-service.md`
-   **Files to Modify:** `services/ats-ai/src/index.ts` and a new `ats-logic.ts`.
-   **Definition of Done:**
    1.  Implement a robust keyword extraction algorithm.
    2.  Implement the logic in the `/api/ats/score` endpoint to compare resume text against a job description and return a score and keyword gap analysis.

### **Task 3.2: Implement AI Suggestion Logic**
-   **Objective:** Implement the AI-powered content suggestion logic.
-   **Package:** `@resume-platform/ats-ai-service`
-   **Playbook Reference:** `docs/playbooks/06-ats-ai-service.md`
-   **Files to Modify:** `services/ats-ai/src/index.ts` and a new `llm-provider.ts`.
-   **Definition of Done:**
    1.  Create an abstraction layer for communicating with an LLM provider (e.g., OpenAI).
    2.  Implement the logic in the `/api/ai/suggest` endpoint to construct a prompt, send it to the LLM, and return the suggestions.

### **Task 3.3: Implement Skills Normalization Logic**
-   **Objective:** Implement the skill normalization logic using the ESCO API.
-   **Package:** `@resume-platform/skills-service`
-   **Playbook Reference:** `docs/playbooks/08-skills-service.md`
-   **Files to Modify:** `services/skills/src/index.ts` and a new `skill-normalizer.ts`.
-   **Definition of Done:**
    1.  Implement the `normalizeSkills` function to call the ESCO API for a list of skills.
    2.  Add caching to prevent redundant API calls.
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
    1.  Create a form layout with sections for each part of the JSON Resume schema.
    2.  Use the components from `@resume-platform/ui` for all inputs, buttons, etc.
    3.  Implement a client-side state management solution (e.g., Zustand) to hold the resume data.
    4.  The form is fully functional and updates the central state.

*(Additional tasks for integrating each service's API with the frontend would follow this pattern.)*