# Playbook 04: Next.js Web Application Setup

**Objective:** To create the `apps/web` Next.js application and fully integrate it into the `pnpm` monorepo. This application will be the primary user-facing interface, and this playbook ensures it can correctly consume our shared packages (`@resume-platform/schema` and `@resume-platform/ui`).

---

## 1. Research & Rationale

-   **Framework (`Next.js 14`):** Next.js is the definitive choice for this project. Its App Router provides a powerful foundation for building complex applications with a mix of server-rendered pages (for public profiles/SEO) and client-side interactivity (for the resume editor). Its built-in API routes are perfect for creating the gateway to our backend microservices.
-   **Monorepo Integration:** The most critical part of this playbook is configuring Next.js to work within a monorepo. This involves two key steps:
    1.  **TypeScript Path Aliases:** We will configure `tsconfig.json` to understand imports like `@resume-platform/ui`. This allows for clean, direct imports from our local packages.
    2.  **Tailwind CSS Content Path:** The `tailwind.config.js` in the web app must be configured to scan the `packages/ui` directory for CSS classes. Without this, styles from our shared components would not be included in the final CSS build. `next-transpile-modules` is no longer needed with modern Next.js, simplifying this process.
-   **Tooling:** We will use the `--ts`, `--tailwind`, and `--eslint` flags with `create-next-app` to ensure the project is set up with our standard tooling from the start.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create the Next.js Application**

1.  **Action:** Use `pnpm create next-app` to scaffold the application. The `printf 'n\\n'` command pipes "No" to the interactive prompt asking about Turbopack.
2.  **Command:**
    ```bash
    printf 'n\n' | pnpm create next-app apps/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
    ```

### **Step 2.2: Configure `package.json` for Workspace Dependencies**

1.  **Action:** Modify the generated `apps/web/package.json` to include our shared workspace packages.
2.  **File Content (`apps/web/package.json`):** Add the following to the `dependencies` section. The `workspace:*` protocol tells `pnpm` to link the local packages from the workspace.
    ```json
    {
      // ... existing next, react, etc. dependencies
      "@resume-platform/schema": "workspace:*",
      "@resume-platform/ui": "workspace:*"
    }
    ```
    *(Note: An agent executing this would need to merge this into the existing file, not overwrite it.)*

### **Step 2.3: Configure TypeScript Path Aliases**

1.  **Action:** Modify the generated `apps/web/tsconfig.json` to recognize the workspace packages.
2.  **File Content (`apps/web/tsconfig.json`):** Add the `paths` property within `compilerOptions`.
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": {
        "plugins": [{ "name": "next" }],
        "paths": {
          "@/*": ["./src/*"],
          "@resume-platform/ui/*": ["../../packages/ui/src/*"],
          "@resume-platform/schema/*": ["../../packages/schema/src/*"]
        }
        // ... other existing compilerOptions
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      "exclude": ["node_modules"]
    }
    ```
    *(Note: This extends the base config and adds path mapping.)*

### **Step 2.4: Configure Tailwind CSS Content Path**

1.  **Action:** Modify the `apps/web/tailwind.config.ts` file to scan the `packages/ui` directory.
2.  **File Content (`apps/web/tailwind.config.ts`):**
    ```typescript
    import type { Config } from "tailwindcss";

    const config: Config = {
      content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        // Add the path to our shared UI package
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    export default config;
    ```

### **Step 2.5: Test the Integration**

1.  **Action:** Modify the main page to import and use a component from `@resume-platform/ui` to confirm the setup is working.
2.  **File Content (`apps/web/src/app/page.tsx`):** Overwrite the default content.
    ```tsx
    import { Button } from "@resume-platform/ui/components/Button";

    export default function Home() {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold mb-8">Resume Platform</h1>
          <p className="mb-4">The web application is running.</p>
          <Button variant="primary" onClick={() => alert("UI Package Works!")}>
            Test Shared Button
          </Button>
        </main>
      );
    }
    ```

### **Step 2.6: Install and Link Dependencies**

1.  **Action:** Run `pnpm install` from the monorepo root. This will install the dependencies for `apps/web` and create the symbolic links to our shared packages.
2.  **Command:**
    ```bash
    pnpm install
    ```

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure the `apps/web` directory and all its subdirectories (`src`, `app`, etc.) have been created correctly.
2.  **[ ] Check `node_modules`:** Verify that the `node_modules` directory inside `apps/web` contains `@resume-platform/schema` and `@resume-platform/ui` as symbolic links.
3.  **[ ] Run Linter:** From the root, run `pnpm lint`. It should complete with no errors.
4.  **[ ] Run Type Check:** From the root, run `pnpm tsc --noEmit -p apps/web/tsconfig.json`. It should complete with no errors.
5.  **[ ] Run Development Server:** From the root, run `pnpm --filter web dev`. The Next.js development server should start without errors.
6.  **[ ] Visual Verification:** Open a web browser to `http://localhost:3000`. You should see the "Resume Platform" heading and a blue "Test Shared Button". Clicking the button should trigger an alert. This confirms that both the component logic and its styling are being correctly imported from the shared UI package.