# Playbook 14: Testing Setup

**Objective:** To configure a comprehensive testing framework for the entire monorepo using `Jest` and `React Testing Library`. This playbook establishes the foundation for unit and integration testing, enabling developers to verify their code and prevent regressions.

---

## 1. Research & Rationale

-   **Problem:** The project skeleton currently lacks any testing infrastructure. Without it, developers cannot write unit or integration tests, and we cannot enforce code quality in our CI pipeline.
-   **Solution:**
    -   **`Jest`:** Jest is the de-facto standard for testing JavaScript and TypeScript applications. It's a full-featured framework that includes a test runner, assertion library, and mocking capabilities out of the box.
    -   **`ts-jest`:** A Jest transformer that allows it to understand and execute tests written in TypeScript.
    -   **`React Testing Library`:** The recommended library for testing React components. It encourages best practices by testing components in a way that resembles how a user would interact with them, leading to more resilient tests.
-   **Strategy:**
    1.  Install all testing-related dependencies at the root of the monorepo to ensure consistent versions across all packages.
    2.  Create a base `jest.config.base.js` at the root to define shared configurations.
    3.  Each individual package (`apps/web`, `packages/ui`, etc.) will have its own `jest.config.js` file that extends the base configuration and specifies its own test environment (e.g., `jsdom` for frontend packages, `node` for backend services).
    4.  Add a root-level `test` script to `package.json` to make it easy to run all tests in the entire monorepo with a single command.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Install Root Dependencies**

1.  **Action:** Install all necessary testing libraries as dev dependencies at the monorepo root.
2.  **Command (from monorepo root):**
    ```bash
    pnpm add -D -w jest @types/jest ts-jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
    ```
    *(`-w` tells pnpm to add this to the root workspace)*

### **Step 2.2: Create Base Jest Configuration**

1.  **Action:** Create a base Jest configuration file at the project root.
2.  **File Content (`jest.config.base.js`):**
    ```javascript
    /** @type {import('ts-jest').JestConfigWithTsJest} */
    module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      verbose: true,
      roots: ['<rootDir>'],
      modulePaths: ['<rootDir>'],
      moduleNameMapper: {
        '^@resume-platform/(.*)$': '<rootDir>/packages/$1/src',
      },
    };
    ```

### **Step 2.3: Configure the Root `test` Script**

1.  **Action:** Add a `test` script to the root `package.json`.
2.  **File Content (`package.json`):** Add this script to the `scripts` section.
    ```json
    "scripts": {
      // ... other scripts
      "test": "jest"
    }
    ```

### **Step 2.4: Configure a Backend Package (e.g., `services/parser`)**

1.  **Action:** Create a `jest.config.js` file for a Node.js-based service.
2.  **File Content (`services/parser/jest.config.js`):**
    ```javascript
    const baseConfig = require('../../jest.config.base.js');

    module.exports = {
      ...baseConfig,
      roots: ['<rootDir>/src'],
      moduleNameMapper: {
        '^@resume-platform/(.*)$': '<rootDir>/../../packages/$1/src',
      },
    };
    ```

### **Step 2.5: Configure a Frontend Package (e.g., `apps/web`)**

1.  **Action:** Create a `jest.config.js` file for the Next.js application.
2.  **File Content (`apps/web/jest.config.js`):**
    ```javascript
    const baseConfig = require('../../jest.config.base.js');

    module.exports = {
      ...baseConfig,
      testEnvironment: 'jsdom', // Use jsdom for React components
      roots: ['<rootDir>/src'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@resume-platform/(.*)$': '<rootDir>/../../packages/$1/src',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional setup file
    };
    ```
3.  **Action:** Create the optional Jest setup file.
4.  **File Content (`apps/web/jest.setup.js`):**
    ```javascript
    // Optional: learn more at https://github.com/testing-library/jest-dom
    import '@testing-library/jest-dom';
    ```

### **Step 2.6: Create an Example Test**

1.  **Action:** To verify the setup, create a simple example test for the `Button` component.
2.  **File Content (`packages/ui/src/components/Button.test.tsx`):**
    ```tsx
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import { Button } from './Button';

    describe('Button', () => {
      it('renders the button with the correct text', () => {
        render(<Button>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
      });
    });
    ```
3.  **Action:** Add a `jest.config.js` to the `packages/ui` directory as well (similar to the `apps/web` config, using `jsdom`).

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure all new `jest.config.js` and `jest.setup.js` files have been created correctly.
2.  **[ ] Run All Tests:** From the monorepo root, run `pnpm test`.
3.  **[ ] Expected Outcome:** Jest should run, discover the `Button.test.tsx` test case, execute it, and report that 1 test has passed. This confirms that the entire testing framework is configured and working end-to-end.
4.  **[ ] Linter Pass:** Ensure `pnpm lint` still passes with the new test files.