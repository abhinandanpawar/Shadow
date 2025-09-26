# Resume Platform

This repository contains the source code for a next-generation, open-source resume building platform. It is designed as a modular, service-oriented monorepo to support a rich feature set including AI-powered suggestions, ATS scoring, and verifiable credentials.

## Current Status

**Project Status:** Active Development

-   **Phase 0: Foundational Tooling & DX:** [COMPLETED]
-   **Phase 1: Foundational Packages:** [COMPLETED]

The project's foundational layers are now complete. This includes the core data schema, the shared UI component library, and the development/testing infrastructure (mocking, testing, CI). The project is now ready for parallel development of its core features and services.

## Getting Started

This project uses `pnpm` as its package manager. 

1.  **Install Dependencies:** To get started, install all dependencies from the root of the monorepo:
    ```bash
    pnpm install
    ```

2.  **Run Tests:** To verify the installation and the current state of the codebase, run the test suite:
    ```bash
    pnpm test
    ```

## Monorepo Structure

The repository is organized as follows:

-   `apps/web`: The main Next.js frontend application. It serves the UI and acts as an API gateway to the backend services.
-   `packages/schema`: The single source of truth for all data structures, containing the Zod schemas for the JSON Resume standard.
-   `packages/ui`: A shared library of reusable React components that form the project's design system.
-   `services/*`: A collection of independent microservices, each handling a specific domain of business logic (e.g., parsing, exporting, AI features).
-   `docs/`: Contains all project documentation, including architectural diagrams, feature specifications, and development playbooks.
