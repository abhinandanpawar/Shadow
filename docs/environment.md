# Environment Setup

This document outlines the standardized development environment for the Resume Platform monorepo. Following these instructions will ensure a consistent and reproducible setup for all developers.

## Standardized Versions

To maintain consistency and prevent version-related issues, this project has standardized on the following primary versions:

-   **Node.js:** `v20.x` (LTS)
-   **Next.js:** `v14.x`
-   **pnpm:** `v9.x` or higher

The specific Node.js version is enforced via the `.nvmrc` file in the root of the repository.

## Manual Setup Instructions

If you are not using the automated setup script, follow these steps to configure your environment manually:

1.  **Install Node.js:**
    -   It is highly recommended to use [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to manage your Node.js versions.
    -   Navigate to the root of the repository and run the following command to install and use the correct Node.js version:
        ```bash
        nvm install && nvm use
        ```

2.  **Install pnpm:**
    -   If you do not have `pnpm` installed, you can install it globally using `npm`:
        ```bash
        npm install -g pnpm
        ```

3.  **Install Dependencies:**
    -   From the root of the monorepo, install all project dependencies using `pnpm`:
        ```bash
        pnpm install
        ```

## Verification

To verify that your environment is set up correctly, run the following command from the root of the repository:

```bash
pnpm test
```

All tests should pass, indicating that your environment is ready for development.