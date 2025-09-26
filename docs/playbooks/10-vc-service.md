# Playbook 10: Verifiable Credentials (VC) Service

**Objective:** To create the `@resume-platform/vc-service`. This service will be responsible for issuing and verifying W3C Verifiable Credentials, allowing achievements like degrees, certifications, and employment to be cryptographically verified.

---

## 1. Research & Rationale

-   **Framework (`Express.js`):** Continuing with Express.js for its simplicity and reliability.
-   **VC Format (`JWT`):** Verifiable Credentials can be represented in various formats. The JWT (JSON Web Token) format is chosen for this implementation because it is compact, web-friendly, and widely supported. The VC data model will be the payload of the JWT.
-   **Cryptographic Primitives (`did-jwt` & `did-jwt-vc`):** Instead of implementing the complex cryptographic signing and verification logic from scratch, we will use established libraries. `did-jwt` and `did-jwt-vc` are excellent choices as they handle the intricacies of signing and verifying credentials tied to Decentralized Identifiers (DIDs).
-   **DID Management:** A core concept of VCs is that they are issued by and to DIDs. For this service, we will not implement a full DID resolver. Instead, we will:
    -   Represent the **Issuer** (our platform) with a static DID and manage its signing key via environment variables.
    -   Accept the **Subject's** DID as an input parameter from the client.
-   **API Design:** The service will expose two primary endpoints:
    -   `/api/vc/issue`: To create and sign a new VC.
    -   `/api/vc/verify`: To verify the signature and claims of an existing VC.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Package Directory**

1.  **Action:** Create the directory for the new service.
2.  **Command:**
    ```bash
    mkdir -p services/vc/src
    ```

### **Step 2.2: Create `package.json`**

1.  **Action:** Create the `package.json` file.
2.  **File Content (`services/vc/package.json`):**
    ```json
    {
      "name": "@resume-platform/vc-service",
      "version": "1.0.0",
      "private": true,
      "main": "dist/index.js",
      "scripts": {
        "dev": "ts-node-dev src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "lint": "eslint . --ext .ts"
      },
      "dependencies": {
        "express": "^4.19.2",
        "cors": "^2.8.5",
        "dotenv": "^16.4.5",
        "did-jwt": "^8.0.2",
    "did-jwt-vc": "^4.0.16",
        "dids": "^4.0.1",
        "key-did-provider-ed25519": "^4.0.0",
    "key-did-resolver": "^4.0.0"
      },
      "devDependencies": {
        "typescript": "^5.4.5",
        "ts-node-dev": "^2.0.0",
        "@types/express": "^4.17.21",
        "@types/cors": "^2.8.17",
        "eslint": "^8.57.0"
      }
    }
    ```

### **Step 2.3: Create `tsconfig.json` and Environment File**

1.  **Action:** Create the `tsconfig.json` file.
2.  **File Content (`services/vc/tsconfig.json`):**
    ```json
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": { "outDir": "./dist", "module": "commonjs" },
      "include": ["src"]
    }
    ```
3.  **Action:** Create a `.env.example` file.
4.  **File Content (`services/vc/.env.example`):**
    ```
    PORT=3006
    # A 32-byte seed, hex-encoded, for the issuer's private key
    ISSUER_PRIVATE_KEY_SEED="your-secret-32-byte-hex-encoded-seed-here"
    ```

### **Step 2.4: Implement the Express Server**

1.  **Action:** Create the main server file `services/vc/src/index.ts`.
2.  **File Content:**
    ```typescript
    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import { issueCredential, verifyCredential } from './vc-handler';

    dotenv.config();
    const app = express();
    const port = process.env.PORT || 3006;

    app.use(cors({ origin: 'http://localhost:3000' }));
    app.use(express.json());

    app.post('/api/vc/issue', async (req, res) => {
      const { subjectDid, credentialPayload } = req.body;
      try {
        const vcJwt = await issueCredential(subjectDid, credentialPayload);
        res.status(200).json({ vcJwt });
      } catch (error) {
        res.status(500).json({ error: 'Failed to issue credential.' });
      }
    });

    app.post('/api/vc/verify', async (req, res) => {
      const { vcJwt } = req.body;
      try {
        const result = await verifyCredential(vcJwt);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ verified: false, error: error.message });
      }
    });

    app.listen(port, () => {
      console.log(`VC service listening on http://localhost:${port}`);
    });
    ```

### **Step 2.5: Implement VC Handler Logic**

1.  **Action:** Create `services/vc/src/vc-handler.ts`.
2.  **File Content:**
    ```typescript
    import { createVerifiableCredentialJwt, verifyCredentialJwt } from 'did-jwt-vc';
    import { Ed25519Provider } from 'key-did-provider-ed25519';
    import { DID } from 'dids';
    import KeyResolver from 'key-did-resolver';

    async function getIssuer() {
      const seed = Buffer.from(process.env.ISSUER_PRIVATE_KEY_SEED, 'hex');
      const provider = new Ed25519Provider(seed);
      const did = new DID({ provider, resolver: KeyResolver.getResolver() });
      await did.authenticate();
      return did;
    }

    export async function issueCredential(subjectDid: string, credentialPayload: any) {
      const issuer = await getIssuer();
      const vcPayload = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: credentialPayload,
      };
      return createVerifiableCredentialJwt(vcPayload, issuer);
    }

    export async function verifyCredential(vcJwt: string) {
      const resolver = KeyResolver.getResolver();
      return verifyCredentialJwt(vcJwt, resolver);
    }
    ```

### **Step 2.6: Install Dependencies**

1.  **Action:** Run `pnpm install` from the monorepo root.
2.  **Command:**
    ```bash
    pnpm install
    ```

---

## 3. Verification Steps

1.  **[ ] Start the Service:** Create a `.env` file with a valid seed, then run `pnpm --filter @resume-platform/vc-service dev`.
2.  **[ ] Test Issuing with `curl`:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"subjectDid": "did:key:z6Mkt...test-subject-did", "credentialPayload": {"degree": "B.S. in Computer Science"}}' \
    http://localhost:3006/api/vc/issue
    ```
    *   **Expected Outcome:** A `200 OK` response with a `vcJwt` field containing a long JWT string.
3.  **[ ] Test Verification with `curl`:**
    *   Copy the `vcJwt` string from the previous step.
    *   Execute the following command:
        ```bash
        curl -X POST -H "Content-Type: application/json" \
        -d '{"vcJwt": "eyJhbGciOiJFZERTQSIs..."}' \
        http://localhost:3006/api/vc/verify
        ```
    *   **Expected Outcome:** A `200 OK` response containing the decoded credential and a `verified: true` field.