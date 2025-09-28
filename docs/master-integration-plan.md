# Master Integration Plan

This document outlines the plan for integrating features from various open-source repositories into the "Shadow" resume platform.

## 1. Target Architecture

*   **Host Application:** Reactive-Resume (`apps/web`)
*   **Monorepo Structure:** pnpm + Nx
*   **Architecture Style:** Modular, Service-Oriented. The application will consist of a primary NestJS backend and a React frontend, with specialized features like resume parsing and scoring handled by a separate Python-based microservice.

## 2. Feature Integration Strategy

This section will detail the plan for integrating each feature, including the source repository, the target package/service, and the integration steps.

### 2.1. Resume Parser & ATS/AI Scoring

*   **Source Repository:** `Resume-Matcher`
*   **Target:**
    *   A new service `services/ats` for the FastAPI backend.
    *   The frontend components will be adapted and integrated into the `apps/web` application.
*   **Integration Rationale:** `Resume-Matcher` provides a robust solution for both parsing and scoring. It uses a modern Python backend (FastAPI) and a local AI model (Ollama), which aligns with the project's goal of creating a powerful, self-hostable platform. By isolating the Python backend into a separate service, we maintain a clean separation of concerns and avoid conflicts between the Node.js and Python ecosystems.
*   **Integration Steps:**
    *   [ ] **Deconstruct:** Analyze the interaction between the `Resume-Matcher` frontend and backend to understand the API contract.
    *   [ ] **Isolate:** Create a new `services/ats` directory and move the relevant FastAPI backend code into it.
    *   [ ] **Adapt:** Modify the `Resume-Matcher` frontend components to work within the `Reactive-Resume` host application, connecting them to the new `services/ats` API endpoints.
    *   [ ] **Integrate:** Add the necessary Nx configuration to manage the new `ats` service. Implement API calls from the main backend or frontend to the `ats` service.
    *   [ ] **Test:** Create integration tests to ensure the parser and scoring features are working correctly within the host application.

### 2.2. Resume Exporter

*   **Source Repository:** `react-pdf-resume-generator`
*   **Target Package:** `packages/exporter`
*   **Integration Rationale:** `react-pdf-resume-generator` uses Puppeteer to generate PDFs from React components, which is the same approach used by the host `Reactive-Resume` application. This will allow for a seamless integration of the exporting logic.
*   **Integration Steps:**
    *   [ ] **Deconstruct:** Understand how the `pdf.ts` API route in `react-pdf-resume-generator` uses Puppeteer to capture and convert the frontend page.
    *   [ ] **Isolate:** Extract the core PDF generation logic and the associated React components.
    *   [ ] **Adapt:** Create a new `packages/exporter` package. Adapt the isolated code to accept resume data from the `Reactive-Resume` application state and render it using the new exporter components.
    *   [ ] **Integrate:** Create an API endpoint in the main `Reactive-Resume` backend that utilizes the `exporter` package to generate and return a PDF.
    *   [ ] **Test:** Write tests to verify that resumes are exported correctly with the proper data and formatting.

## 3. Phased Rollout Plan

1.  **Phase 1: Parser Integration.** The first step is to integrate the core resume parsing functionality. This will allow the application to accept and understand resume files, which is a prerequisite for all other features.
2.  **Phase 2: Exporter Integration.** Once the application can parse and store resume data, the next logical step is to allow users to export their generated resumes as PDFs.
3.  **Phase 3: ATS/AI Scoring Integration.** With the parsing and exporting features in place, the final step is to integrate the AI-powered scoring mechanism to provide users with feedback on their resumes.

## 4. Dependency Analysis

### 4.1. Key Technologies
*   **Host (`Reactive-Resume`):** React, Next.js, NestJS, Prisma, Tailwind CSS, Zustand, Puppeteer
*   **Parser/Scorer (`Resume-Matcher`):** Python, FastAPI, Next.js, Tailwind CSS, Ollama
*   **Exporter (`react-pdf-resume-generator`):** Next.js, Tailwind CSS, Puppeteer

### 4.2. Conflict Resolution
*   **Backend:** The primary challenge is the differing backend technologies (NestJS vs. FastAPI). This will be resolved by implementing `Resume-Matcher`'s backend as a separate microservice (`services/ats`). The main application will communicate with this service via REST API calls.
*   **Frontend:** All projects use React, Next.js, and Tailwind CSS. While versions may vary, the core concepts are compatible. We will use the versions established in the `Reactive-Resume` host and adapt the incoming code as needed.
*   **PDF Generation:** Both the host and the exporter use Puppeteer, which simplifies the integration. The logic from `react-pdf-resume-generator` will be adapted into a new `exporter` package.

## 5. Configuration Files

This section will be populated during the implementation phase as configuration files are added or modified.