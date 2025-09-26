# Playbook 15: CI Pipeline Setup

**Objective:** To create a Continuous Integration (CI) pipeline using GitHub Actions. This pipeline will automatically run on every code change pushed to the repository, acting as a quality gate to ensure that all code adheres to our standards before it can be merged.

---

## 1. Research & Rationale

-   **Problem:** Without an automated CI pipeline, it's possible for a developer to accidentally commit code that breaks tests or violates linting rules. This can disrupt the work of the entire team.
-   **Solution (`GitHub Actions`):** GitHub Actions is the best choice for our CI provider because it is deeply integrated into our source control platform (GitHub). It is easy to set up, has excellent support for Node.js and `pnpm`, and provides clear feedback directly on pull requests.
-   **Strategy:**
    1.  We will create a single workflow file, `main.yml`.
    2.  This workflow will be triggered on every `push` to any branch.
    3.  It will define a single job, `build_and_test`, that runs on a standard `ubuntu-latest` runner.
    4.  The job will perform the following critical steps in order:
        -   Check out the code.
        -   Set up the correct Node.js version (v20) and `pnpm`.
        -   Install all dependencies using `pnpm install`.
        -   Run the linter across the entire monorepo (`pnpm lint`).
        -   Run all tests across the entire monorepo (`pnpm test`).
    5.  If any of these steps fail, the entire workflow will fail, and GitHub will display a red "X" on the commit and any associated pull request, effectively blocking a merge until the issues are fixed.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Workflow Directory**

1.  **Action:** Create the necessary directory structure for GitHub Actions workflows. This must be at the root of the project.
2.  **Command:**
    ```bash
    mkdir -p .github/workflows
    ```

### **Step 2.2: Create the Workflow File**

1.  **Action:** Create the `main.yml` workflow file.
2.  **File Content (`.github/workflows/main.yml`):**
    ```yaml
    name: CI

    on:
      push:
        branches: [ "**" ] # Run on all branches

    jobs:
      build_and_test:
        name: Build and Test
        runs-on: ubuntu-latest

        steps:
          - name: Check out code
            uses: actions/checkout@v4

          - name: Set up pnpm
            uses: pnpm/action-setup@v3
            with:
              version: 9

          - name: Set up Node.js
            uses: actions/setup-node@v4
            with:
              node-version: '20'
              cache: 'pnpm'

          - name: Install dependencies
            run: pnpm install

          - name: Run linter
            run: pnpm lint

          - name: Run tests
            run: pnpm test
    ```

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure the `.github/workflows/main.yml` file has been created with the correct content.
2.  **[ ] Verify on GitHub:** The primary verification for this playbook happens after the code is pushed to a GitHub repository.
    *   **Action:** Push the commit that adds this workflow file to any branch on GitHub.
    *   **Expected Outcome:**
        1.  Navigate to the "Actions" tab of the GitHub repository.
        2.  You should see a new workflow run titled "CI" that has been triggered by your push.
        3.  The workflow should execute all the steps defined in the `main.yml` file (checkout, setup, install, lint, test).
        4.  Since our skeleton is clean and the example test is designed to pass, the workflow should complete successfully with a green checkmark. This confirms the CI pipeline is correctly configured and operational.