# Runbook: Verifiable Credentials (VC) Service

**Service Name:** `@resume-platform/vc-service`
**Contact:** Security & Engineering Teams <sec@example.com>
**Description:** This service issues and verifies W3C Verifiable Credentials. **This is a security-sensitive service.**

---

## 1. Deployment

### **Prerequisites:**
-   A running Node.js environment.
-   Access to the built Docker image.
-   **A securely generated `ISSUER_PRIVATE_KEY_SEED`**. This is a 32-byte, hex-encoded string that must be kept confidential.

### **Deployment Steps:**
1.  **Pull the Docker Image:**
    ```bash
    docker pull our-registry/vc-service:latest
    ```
2.  **Run the Docker Container (with secret management):**
    -   **CRITICAL:** The `ISSUER_PRIVATE_KEY_SEED` must be injected securely, not passed as a plain environment variable. Use Docker Secrets, HashiCorp Vault, or your cloud provider's secret manager.
    -   **Example with Docker Secrets:**
        ```bash
        # 1. Create the secret
        printf "your-secret-32-byte-hex-encoded-seed-here" | docker secret create issuer_seed -

        # 2. Run the service with the secret
        docker run -d \
          -p 3006:3006 \
          --secret issuer_seed \
          # The app code will need to read the secret from /run/secrets/issuer_seed
          --name vc-service \
          --restart always \
          our-registry/vc-service:latest
        ```

---

## 2. Monitoring

### **Key Metrics to Watch:**

-   **API Error Rate (5xx):** Any error from this service is considered a high-severity event and must be investigated immediately.
    -   **Alert Threshold:** Any 5xx error.
-   **Verification Failures:** A high rate of failed verifications could indicate a bad actor attempting to forge credentials.
    -   **Alert Threshold:** > 10 verification failures in 5 minutes.

### **Health Check Endpoint:**
-   A `GET /health` endpoint should return `200 OK`. It should also verify that the issuer key has been loaded correctly.

---

## 3. Troubleshooting & Common Issues

### **Issue: Service Fails to Start**

-   **Symptom:** The container exits immediately upon startup.
-   **Possible Causes:**
    1.  **Missing `ISSUER_PRIVATE_KEY_SEED`:** The secret was not mounted or provided correctly.
    2.  **Invalid Seed Format:** The provided seed is not a 32-byte hex-encoded string.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** The application is designed to log a fatal error and exit if the seed is missing or invalid. Check `docker logs vc-service`.
    2.  **Verify Secret Management:** Double-check the Docker Compose or Kubernetes deployment configuration to ensure the secret is being correctly mounted into the container.

### **Issue: Credential Issuance Fails (5xx Error)**

-   **Symptom:** The `/api/vc/issue` endpoint returns a 500 error.
-   **Possible Causes:**
    1.  A cryptographic error occurred in the `did-jwt-vc` library.
    2.  The input `subjectDid` is malformed.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** Look for specific errors from the crypto library.
    2.  **Inspect Request Body:** Check the logs for the request payload to see if the `subjectDid` is valid.

### **Security Incident: Issuer Key Compromise**

-   **Symptom:** The `ISSUER_PRIVATE_KEY_SEED` is known or suspected to have been exposed.
-   **IMMEDIATE ACTION REQUIRED:**
    1.  **Shut Down the Service:** Immediately stop the VC service to prevent any further credentials from being issued with the compromised key.
        ```bash
        docker stop vc-service
        ```
    2.  **Rotate the Key:**
        -   Generate a new, cryptographically secure 32-byte hex-encoded seed.
        -   Update the secret in your secret management system (e.g., `docker secret rm issuer_seed` and create a new one).
    3.  **Redeploy the Service:** Redeploy the `vc-service` with the new secret. It will now issue credentials with a new issuer DID and key.
    4.  **Implement Revocation:**
        -   This is the most critical step. The engineering team must have a mechanism to revoke all credentials signed with the old, compromised key.
        -   This typically involves publishing a "revocation list" that verifiers can check.
        -   **Escalate to the security and engineering teams immediately** to begin the revocation process. All previously issued credentials should be considered invalid.