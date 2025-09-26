# Playbook 02: Core Schema Package

**Objective:** To create the `@resume-platform/schema` package. This package will contain the Zod validation schemas for the entire JSON Resume data model, providing a single source of truth for data structures and ensuring type safety across the entire monorepo.

---

## 1. Research & Rationale

-   **Schema Library (`Zod`):** Zod is chosen for its TypeScript-first approach. It allows us to define a schema once and infer the static TypeScript type automatically, eliminating the need to maintain separate schema definitions and type declarations. Its validation is robust and provides clear error messages, which is essential for handling data from imports and user input.
-   **JSON Resume Standard:** The schemas defined in this playbook are based on the official `v1.0.0` JSON Resume specification. This adherence ensures compatibility with the wider ecosystem of JSON Resume themes and tools. The schema is broken down into logical, composable pieces for maintainability.
-   **Package-based Architecture:** Creating a dedicated `@resume-platform/schema` package is a core architectural decision. It ensures that any service or application within the monorepo that needs to interact with resume data can import the schemas and types from a single, reliable source, preventing data inconsistency.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new package.
2.  **Command:**
    ```bash
    mkdir -p packages/schema/src
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file for this package.
2.  **File Content (`packages/schema/package.json`):**
    ```json
    {
      "name": "@resume-platform/schema",
      "version": "1.0.0",
      "private": true,
      "main": "./src/index.ts",
      "types": "./src/index.ts",
      "scripts": {
        "lint": "eslint . --ext .ts"
      },
      "dependencies": {
        "zod": "^3.23.8"
      },
      "devDependencies": {
        "typescript": "^5.4.5",
        "eslint": "^8.57.0",
        "@typescript-eslint/eslint-plugin": "^7.8.0",
        "@typescript-eslint/parser": "^7.8.0"
      }
    }
    ```

### **Step 2.3: Create `tsconfig.json`**

1.  **Action:** Create a `tsconfig.json` file that extends the base configuration.
2.  **File Content (`packages/schema/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": {
        "outDir": "./dist"
      },
      "include": ["src"],
      "exclude": ["node_modules", "dist"]
    }
    ```

### **Step 2.4: Define Zod Schemas**

The schema will be broken into multiple files within `packages/schema/src/` for clarity.

1.  **Action:** Create `packages/schema/src/basics.ts`.
2.  **File Content:**
    ```typescript
    import { z } from 'zod';

    const locationSchema = z.object({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      countryCode: z.string().optional(),
      region: z.string().optional(),
    }).optional();

    const profileSchema = z.object({
      network: z.string().optional(),
      username: z.string().optional(),
      url: z.string().url().optional(),
    }).optional();

    export const basicsSchema = z.object({
      name: z.string().optional(),
      label: z.string().optional(),
      image: z.string().url().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      url: z.string().url().optional(),
      summary: z.string().optional(),
      location: locationSchema,
      profiles: z.array(profileSchema).optional(),
    }).optional();

    export type Basics = z.infer<typeof basicsSchema>;
    ```

3.  **Action:** Create `packages/schema/src/work.ts`.
4.  **File Content:**
    ```typescript
    import { z } from 'zod';

    export const workSchema = z.object({
      name: z.string().optional(),
      position: z.string().optional(),
      url: z.string().url().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      summary: z.string().optional(),
      highlights: z.array(z.string()).optional(),
    }).optional();

    export type Work = z.infer<typeof workSchema>;
    ```

5.  **Action:** Create `packages/schema/src/education.ts`.
6.  **File Content:**
    ```typescript
    import { z } from 'zod';

    export const educationSchema = z.object({
      institution: z.string().optional(),
      url: z.string().url().optional(),
      area: z.string().optional(),
      studyType: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      score: z.string().optional(),
      courses: z.array(z.string()).optional(),
    }).optional();

    export type Education = z.infer<typeof educationSchema>;
    ```

7.  **Action:** Create `packages/schema/src/skills.ts`.
8.  **File Content:**
    ```typescript
    import { z } from 'zod';

    export const skillSchema = z.object({
      name: z.string().optional(),
      level: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional();

    export type Skill = z.infer<typeof skillSchema>;
    ```

*(Note: Additional files for `volunteer`, `awards`, `publications`, `languages`, `interests`, `references`, and `projects` would follow the same pattern, defining their respective schemas based on the JSON Resume standard.)*

### **Step 2.5: Create Main `index.ts`**

1.  **Action:** Create the main entry point `index.ts` to export all schemas.
2.  **File Content (`packages/schema/src/index.ts`):**
    ```typescript
    import { z } from 'zod';
    import { basicsSchema } from './basics';
    import { workSchema } from './work';
    import { educationSchema } from './education';
    import { skillSchema } from './skills';
    // ... imports for other schemas

    export const resumeSchema = z.object({
      basics: basicsSchema,
      work: z.array(workSchema).optional(),
      education: z.array(educationSchema).optional(),
      skills: z.array(skillSchema).optional(),
      // ... other sections
    });

    export type Resume = z.infer<typeof resumeSchema>;

    // Re-export all individual schemas and types
    export * from './basics';
    export * from './work';
    export * from './education';
    export * from './skills';
    ```

### **Step 2.6: Install Dependencies for this Package**

1.  **Action:** Run `pnpm install` from the monorepo root to install the dependencies for the new package.
2.  **Command:**
    ```bash
    pnpm install --filter @resume-platform/schema
    ```

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure the `packages/schema` directory and all specified `.ts` and `.json` files have been created with the correct content.
2.  **[ ] Check `node_modules`:** Verify that a `node_modules` directory exists inside `packages/schema` and contains a `zod` directory.
3.  **[ ] Run Type Check:** From the root of the monorepo, run `pnpm tsc --noEmit -p packages/schema/tsconfig.json`. The command should complete without any errors, confirming that the TypeScript types are valid.
4.  **[ ] Run Linter:** From the root of the monorepo, run `pnpm eslint packages/schema/`. The command should complete without any errors.