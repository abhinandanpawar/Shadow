# Playbook 01: Project Foundation & Monorepo Setup

**Objective:** To establish the foundational structure of the project, including the `pnpm` monorepo, root configurations, and essential development tooling. This playbook ensures a consistent and reproducible setup for all subsequent development.

---

## 1. Research & Rationale

-   **Monorepo Manager (`pnpm`):** After researching `npm`, `yarn`, and `pnpm`, `pnpm` was chosen for its superior performance, disk space efficiency (via a content-addressable store), and strictness, which helps prevent phantom dependency issues. This is ideal for a large, multi-package project.
-   **TypeScript Configuration (`tsconfig.json`):** A root `tsconfig.base.json` will be created to enforce strict, modern TypeScript settings across all packages. Each package can then extend this base configuration. This ensures consistency and high code quality.
-   **Code Quality (`ESLint` & `Prettier`):** ESLint will be used for static code analysis to catch common errors, and Prettier will be used for opinionated code formatting. A key decision is to integrate them seamlessly so they don't conflict. `eslint-config-prettier` will be used to disable ESLint rules that are handled by Prettier. This setup is standard for modern TypeScript projects.
-   **Editor Configuration (`.editorconfig`):** A `.editorconfig` file will be included to maintain consistent coding styles (indentation, line endings) across different editors and IDEs.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Initialize pnpm Workspace**

1.  **Action:** Create the `pnpm-workspace.yaml` file in the project root.
2.  **Command:**
    ```bash
    touch pnpm-workspace.yaml
    ```
3.  **File Content (`pnpm-workspace.yaml`):**
    ```yaml
    packages:
      - 'apps/*'
      - 'packages/*'
      - 'services/*'
    ```

### **Step 2.2: Create Root `package.json`**

1.  **Action:** Create the main `package.json` file.
2.  **Command:**
    ```bash
    touch package.json
    ```
3.  **File Content (`package.json`):** This file defines the workspace name and shared development dependencies.
    ```json
    {
      "name": "resume-platform-monorepo",
      "version": "1.0.0",
      "private": true,
      "description": "The foundational monorepo for the next-gen resume platform.",
      "scripts": {
        "lint": "eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
        "format": "prettier --write ."
      },
      "devDependencies": {
        "@typescript-eslint/eslint-plugin": "^7.8.0",
        "@typescript-eslint/parser": "^7.8.0",
        "eslint": "^8.57.0",
        "eslint-config-prettier": "^9.1.0",
        "prettier": "^3.2.5",
        "typescript": "^5.4.5"
      },
      "engines": {
        "node": ">=20.11.1",
        "pnpm": ">=9.1.0"
      }
    }
    ```

### **Step 2.3: Create `.gitignore`**

1.  **Action:** Create a comprehensive `.gitignore` file.
2.  **Command:**
    ```bash
    touch .gitignore
    ```
3.  **File Content (`.gitignore`):**
    ```gitignore
    # Dependencies
    /node_modules
    /.pnpm-store

    # Build artifacts
    /dist
    /build
    /.next

    # Logs
    logs
    *.log

    # OS-generated files
    .DS_Store
    Thumbs.db

    # Environment variables
    .env
    .env*.local

    # IDE configuration
    .vscode/
    .idea/
    ```

### **Step 2.4: Create Base TypeScript Configuration**

1.  **Action:** Create the root `tsconfig.base.json` file.
2.  **Command:**
    ```bash
    touch tsconfig.base.json
    ```
3.  **File Content (`tsconfig.base.json`):**
    ```json
    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "forceConsistentCasingInFileNames": true,
        "skipLibCheck": true
      }
    }
    ```

### **Step 2.5: Create Prettier Configuration**

1.  **Action:** Create the `.prettierrc` file.
2.  **Command:**
    ```bash
    touch .prettierrc
    ```
3.  **File Content (`.prettierrc`):**
    ```json
    {
      "semi": true,
      "tabWidth": 2,
      "singleQuote": false,
      "trailingComma": "es5"
    }
    ```

### **Step 2.6: Create ESLint Configuration**

1.  **Action:** Create the `.eslintrc.json` file.
2.  **Command:**
    ```bash
    touch .eslintrc.json
    ```
3.  **File Content (`.eslintrc.json`):**
    ```json
    {
      "root": true,
      "env": { "es2020": true, "node": true },
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
      ],
      "ignorePatterns": ["dist", "node_modules"],
      "parser": "@typescript-eslint/parser"
    }
    ```

### **Step 2.7: Create Editor Configuration**

1.  **Action:** Create the `.editorconfig` file.
2.  **Command:**
    ```bash
    touch .editorconfig
    ```
3.  **File Content (`.editorconfig`):**
    ```editorconfig
    root = true

    [*]
    indent_style = space
    indent_size = 2
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
    ```

### **Step 2.8: Install Dependencies**

1.  **Action:** Run `pnpm install` to install all the dev dependencies defined in the root `package.json`.
2.  **Command:**
    ```bash
    pnpm install
    ```

---

## 3. Verification Steps

To verify that this playbook was executed successfully, perform the following checks:

1.  **[ ] Check for `pnpm-lock.yaml`:** Ensure that a `pnpm-lock.yaml` file was created in the root directory.
2.  **[ ] Check for `node_modules`:** Ensure that a `node_modules` directory was created and contains the specified dev dependencies.
3.  **[ ] Run Linting:** Execute `pnpm lint`. The command should run without errors.
4.  **[ ] Check File Existence:** Confirm that all created files (`pnpm-workspace.yaml`, `package.json`, `.gitignore`, `tsconfig.base.json`, `.prettierrc`, `.eslintrc.json`, `.editorconfig`) exist in the root directory with the correct content.