# High-Level System Architecture

This document outlines the high-level architectural design for the resume platform, capable of supporting the comprehensive feature set specified in `features.md`.

---

## 1. Guiding Principles

-   **Modularity:** The system is broken down into independent, single-responsibility services to manage complexity.
-   **Scalability:** Each service can be scaled independently based on its specific load.
-   **Maintainability:** A clean separation of concerns and a shared data schema make the system easier to understand, debug, and extend.
-   **Data-Driven:** The entire platform is anchored to a canonical JSON Resume schema, ensuring data consistency and portability.

---

## 2. Core Architecture: Service-Oriented Monorepo

The platform is designed as a **monorepo** managed by `pnpm`. This structure contains a central web application and a suite of specialized microservices.

-   **`apps/web` (Next.js 14):** The primary user interface. It serves the resume editor, dashboards, and public profiles. It also acts as an **API Gateway**, securely routing client requests to the appropriate backend services.
-   **`services/*` (Node.js/TypeScript):** A collection of independent microservices, each handling a specific domain of business logic.
-   **`packages/*`:** Shared internal libraries for code, types, and UI components that are reused across the monorepo.

---

## 3. Component & Service Breakdown

### **Frontend & Gateway**
-   **`apps/web`:** The Next.js application serves as the single entry point for users and provides the complete UI for all features.

### **Backend Service Mesh**
A network of microservices that handle the core logic:

-   **`services/parser`:**
    -   **Responsibility:** Handles PDF/DOCX resume import and conversion to JSON Resume format.
    -   **Key Tech:** OpenResume engine.

-   **`services/exporter`:**
    -   **Responsibility:** Generates all file exports (PDF, PDF/UA, LaTeX, HTML).
    -   **Key Tech:** Puppeteer, EJS/LaTeX templating.

-   **`services/ats-ai`:**
    -   **Responsibility:** Powers all AI-driven features, including ATS scoring, JD gap analysis, content suggestions, and semantic similarity calculations.
    -   **Key Tech:** LLM abstractions, sentence-transformer models.

-   **`services/skills`:**
    -   **Responsibility:** Normalizes and enriches skill data against standard taxonomies.
    -   **Key Tech:** ESCO & O*NET API integration.

-   **`services/search`:**
    -   **Responsibility:** Provides powerful hybrid (lexical + vector) search across all resume data.
    -   **Key Tech:** OpenSearch.

-   **`services/vc`:**
    -   **Responsibility:** Issues and verifies W3C Verifiable Credentials.
    -   **Key Tech:** `did-jwt-vc` and related cryptographic libraries.

-   **`services/portfolio`:**
    -   **Responsibility:** Integrates with GitHub to fetch user portfolio data.
    -   **Key Tech:** Octokit.

### **Shared Libraries**
-   **`packages/schema`:** The single source of truth for all data structures, containing Zod schemas for the JSON Resume standard.
-   **`packages/ui`:** A library of shared, pre-styled React components (buttons, inputs, etc.) that ensure a consistent UI.

---

## 4. High-Level Data Flow Example (ATS Scoring)

1.  **User Action:** A user in the `apps/web` application pastes a job description to score their resume.
2.  **API Gateway:** The web app sends the resume data and the job description to its own backend at `/api/ats/score`.
3.  **Service Call:** The API gateway forwards this request to the `services/ats-ai` microservice.
4.  **Processing:** The `ats-ai` service performs keyword extraction and semantic analysis, generating a score and a list of suggestions.
5.  **Response:** The service returns the score and suggestions to the API gateway.
6.  **UI Update:** The gateway sends the data back to the user's browser, where the UI updates to display the results.

This modular, service-oriented architecture provides a robust and scalable foundation upon which to build the full suite of features defined for the platform.