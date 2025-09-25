# Playbook 03: Shared UI Package

**Objective:** To create the `@resume-platform/ui` package. This package will serve as a shared component library, providing consistent, reusable UI elements (like buttons, inputs, and cards) across the entire web application. This is a critical step in building a maintainable and visually consistent design system.

---

## 1. Research & Rationale

-   **Component-Based Architecture:** Building a dedicated UI library is a best practice for any large frontend application. It promotes reusability, ensures visual consistency, and simplifies maintenance. When a button's style needs to be updated, it only needs to be changed in one place.
-   **Styling (`Tailwind CSS`):** We will use Tailwind CSS for styling. However, instead of using it directly in the `apps/web` application for every single element, we will use it within this UI package to build and style our core components. The web app will then consume these pre-styled components. This encapsulates the styling logic and makes the application code cleaner.
-   **Composition:** Components will be designed to be composable. For example, a `Card` component will provide a styled container, but its children will be determined by where it's used.
-   **Headless UI (Future Consideration):** While not in the initial implementation, this architecture is compatible with headless UI libraries like Radix or Headless UI. These could be integrated later to provide accessibility and behavior primitives, while Tailwind continues to handle the styling.
-   **`clsx` Utility:** This small utility will be used to conditionally apply CSS classes, which is a very common need when building components with different states (e.g., primary vs. secondary buttons, disabled state).

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new package.
2.  **Command:**
    ```bash
    mkdir -p packages/ui/src/components
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file for this package.
2.  **File Content (`packages/ui/package.json`):**
    ```json
    {
      "name": "@resume-platform/ui",
      "version": "1.0.0",
      "private": true,
      "main": "./src/index.tsx",
      "types": "./src/index.tsx",
      "scripts": {
        "lint": "eslint . --ext .ts,.tsx"
      },
      "dependencies": {
        "clsx": "^2.1.1",
        "react": "^18.3.1"
      },
      "devDependencies": {
        "typescript": "^5.4.5",
        "@types/react": "^18.3.1",
        "tailwindcss": "^3.4.3",
        "eslint": "^8.57.0"
      }
    }
    ```

### **Step 2.3: Create `tsconfig.json`**

1.  **Action:** Create a `tsconfig.json` file that extends the base configuration.
2.  **File Content (`packages/ui/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": {
        "outDir": "./dist",
        "jsx": "react-jsx"
      },
      "include": ["src"],
      "exclude": ["node_modules", "dist"]
    }
    ```

### **Step 2.4: Create Tailwind CSS Configuration**

1.  **Action:** Create a `tailwind.config.js` file for the UI package.
2.  **File Content (`packages/ui/tailwind.config.js`):**
    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: ["./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: "#2563EB", // Primary Blue
              hover: "#1D4ED8",
            },
            // Define other colors from our design spec
          },
        },
      },
      plugins: [],
    };
    ```

### **Step 2.5: Implement Core Components**

#### **Button Component**
1.  **Action:** Create `packages/ui/src/components/Button.tsx`.
2.  **File Content:**
    ```tsx
    import React from 'react';
    import { clsx } from 'clsx';

    interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'primary' | 'secondary';
    }

    export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant = 'primary', ...props }, ref) => {
        const baseStyles = 'px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
        const variantStyles = {
          primary: 'bg-primary text-white hover:bg-primary-hover',
          secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        };

        return (
          <button
            ref={ref}
            className={clsx(baseStyles, variantStyles[variant], className)}
            {...props}
          />
        );
      }
    );

    Button.displayName = 'Button';
    ```

#### **Input Component**
1.  **Action:** Create `packages/ui/src/components/Input.tsx`.
2.  **File Content:**
    ```tsx
    import React from 'react';
    import { clsx } from 'clsx';

    export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

    export const Input = React.forwardRef<HTMLInputElement, InputProps>(
      ({ className, ...props }, ref) => {
        return (
          <input
            ref={ref}
            className={clsx(
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
              className
            )}
            {...props}
          />
        );
      }
    );

    Input.displayName = 'Input';
    ```

### **Step 2.6: Create Main `index.tsx`**

1.  **Action:** Create the main entry point `index.tsx` to export all components.
2.  **File Content (`packages/ui/src/index.tsx`):**
    ```tsx
    import './globals.css'; // We will create this file next

    export * from './components/Button';
    export * from './components/Input';
    // ... export other components as they are created
    ```

### **Step 2.7: Create Global CSS File**

1.  **Action:** Create `packages/ui/src/globals.css` to include Tailwind's base styles.
2.  **File Content:**
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

### **Step 2.8: Install Dependencies**

1.  **Action:** Run `pnpm install` from the monorepo root.
2.  **Command:**
    ```bash
    pnpm install --filter @resume-platform/ui
    ```

---

## 3. Verification Steps

1.  **[ ] Check File Structure:** Ensure the `packages/ui` directory and all specified files have been created correctly.
2.  **[ ] Check `node_modules`:** Verify that a `node_modules` directory exists inside `packages/ui` and contains `react` and `clsx`.
3.  **[ ] Run Type Check:** From the root, run `pnpm tsc --noEmit -p packages/ui/tsconfig.json`. It should complete without errors.
4.  **[ ] Run Linter:** From the root, run `pnpm eslint packages/ui/`. It should complete without errors.
5.  **[ ] Storybook (Future):** While not in this playbook, a future verification step would be to run Storybook for this package to visually inspect and test the components in isolation.