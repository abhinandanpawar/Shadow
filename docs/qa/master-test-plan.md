# Master Test Plan

**Project:** Resume Platform
**Version:** 1.0
**Author:** Jules, Software Engineer

---

## 1. Introduction & Scope

This document outlines the comprehensive testing strategy for the Resume Platform. The goal is to ensure the delivery of a high-quality, robust, and reliable SaaS product. This plan covers all levels of testing, from individual code units to full end-to-end user scenarios, and applies to all applications and services within the monorepo.

---

## 2. Testing Levels & Strategy

Our testing strategy is based on the "Testing Pyramid" model, emphasizing a large base of fast, cheap unit tests, a smaller layer of integration tests, and a very focused set of end-to-end tests.

### **2.1. Level 1: Unit Testing**

-   **Objective:** To verify that individual functions, components, and modules work correctly in isolation.
-   **Scope:**
    -   **Backend Services:** All business logic functions (e.g., `scoreResume` in `ats-ai-service`, `normalizeSkills` in `skills-service`).
    -   **Frontend:** Individual React components (e.g., `Button`, `Input` from `@resume-platform/ui`), utility functions, and state management logic.
-   **Tools:**
    -   **Framework:** `Jest` will be the primary testing framework for all packages.
    -   **Frontend Components:** `React Testing Library` will be used to test React components from a user's perspective.
-   **Responsibility:** The developer writing the feature code is responsible for writing the corresponding unit tests.
-   **Requirement:** All new code must be accompanied by unit tests, with a target of >80% code coverage for critical business logic.

### **2.2. Level 2: Integration Testing**

-   **Objective:** To verify that different parts of the system work together correctly.
-   **Scope:**
    -   **Service-to-Service Communication:** Testing the interaction between the Next.js API gateway and the backend microservices. For example, does the gateway correctly forward a file to the `parser-service` and handle the response?
    -   **Service-to-Database/External API:** Testing the interaction between a service and its external dependencies (e.g., does the `search-service` correctly connect to and query OpenSearch? Does the `skills-service` correctly handle responses from the ESCO API?).
-   **Tools:**
    -   **Framework:** `Jest` will be used to write the tests.
    -   **HTTP Requests:** `supertest` can be used for testing our own API endpoints.
    -   **Mocking:** `nock` or Jest's built-in mocking will be used to mock external dependencies (like the GitHub API or ESCO API) to ensure tests are fast and reliable.
-   **Responsibility:** Developers will write integration tests for the services they build.

### **2.3. Level 3: End-to-End (E2E) Testing**

-   **Objective:** To simulate a full user journey from start to finish, verifying that the entire integrated system works as expected from the user's perspective.
-   **Scope (Key Scenarios):**
    1.  **The "Golden Path":** A user successfully imports a PDF resume, makes an edit in the editor, sees the live preview update, and exports the result as a new PDF.
    2.  **AI Tailoring Loop:** A user pastes a job description, receives an ATS score, uses an AI suggestion to improve a bullet point, and sees their score increase.
    3.  **GitHub Portfolio Sync:** A user successfully connects their GitHub account and sees their repositories appear in the projects section.
-   **Tools:**
    -   **Framework:** `Playwright` is chosen for its powerful cross-browser capabilities, auto-waits, and excellent debugging tools.
-   **Responsibility:** A dedicated QA effort or a rotating developer responsibility, as E2E tests are more complex to write and maintain.

---

## 3. Automation & CI/CD

-   **Continuous Integration:** All tests (Unit and Integration) will be run automatically on every single commit pushed to any branch in our GitHub repository, using **GitHub Actions**. A commit that breaks any test will be blocked from being merged into the main branch.
-   **E2E in Staging:** The full E2E test suite will be run automatically against a dedicated `staging` environment whenever new code is deployed there. This is the final quality gate before a release to production.

---

## 4. Performance & Security Testing

-   **Performance:** Load testing will be performed on critical endpoints (e.g., `/api/import`, `/api/export/pdf`) before major releases to ensure they can handle the expected user load. Tools like `k6` or `JMeter` will be considered.
-   **Security:**
    -   Static Application Security Testing (SAST) tools will be integrated into the CI pipeline to scan for common vulnerabilities.
    -   Dependency scanning (e.g., `pnpm audit`, GitHub Dependabot) will be enabled to alert on known vulnerabilities in our third-party packages.
    -   Penetration testing will be conducted by a third party before the initial public launch.

This Master Test Plan provides the framework for ensuring a high-quality product. Specific test cases for each feature will be documented in the corresponding user stories or tasks during the development sprints.