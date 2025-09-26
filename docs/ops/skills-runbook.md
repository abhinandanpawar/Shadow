# Runbook: Skills Service

**Service Name:** `@resume-platform/skills-service`
**Contact:** Engineering Team <eng@example.com>
**Description:** This service normalizes user-inputted skills against the external ESCO API.

---

## 1. Deployment

### **Prerequisites:**
-   A running Node.js environment.
-   Access to the built Docker image.
-   Environment variables configured, specifically `ESCO_API_URL`.

### **Deployment Steps:**
1.  **Pull the Docker Image:**
    ```bash
    docker pull our-registry/skills-service:latest
    ```
2.  **Run the Docker Container:**
    ```bash
    docker run -d \
      -p 3004:3004 \
      -e ESCO_API_URL="https://ec.europa.eu/esco/api" \
      --name skills-service \
      --restart always \
      our-registry/skills-service:latest
    ```

---

## 2. Monitoring

### **Key Metrics to Watch:**

-   **API Error Rate (5xx):** A spike likely indicates an issue with the external ESCO API.
    -   **Alert Threshold:** > 5% error rate over a 15-minute window (allowing for some external network blips).
-   **External API Latency (ESCO):** Monitor the response times from the ESCO API.
    -   **Alert Threshold:** p95 latency > 2500ms.
-   **Cache Hit Ratio:** Monitor the effectiveness of the in-memory cache. A low hit ratio might indicate that the cache size is too small or the TTL is too short.

### **Health Check Endpoint:**
-   A `GET /health` endpoint should return `200 OK`. It could optionally make a test call to the ESCO API to verify end-to-end connectivity.

---

## 3. Troubleshooting & Common Issues

### **Issue: High 5xx Error Rate**

-   **Symptom:** The `/api/skills/normalize` endpoint is frequently failing.
-   **Possible Causes:**
    1.  **ESCO API Outage:** The external ESCO API is down or unresponsive.
    2.  **Network Issues:** There are network connectivity problems between our service and the ESCO API servers.
    3.  **ESCO API Changes:** The ESCO API may have changed its endpoint structure or response format, causing our parsing to fail.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** Inspect the service logs for error messages from the `axios` client, such as connection timeouts or 4xx/5xx responses from the ESCO API.
    2.  **Check ESCO API Status:** While ESCO may not have a public status page, try making a manual request to the API from a different machine to see if it's a widespread issue.
        ```bash
        curl "https://ec.europa.eu/esco/api/search?language=en&type=skill&text=javascript"
        ```
    3.  **Restart the Service:** A restart can resolve transient network issues.

### **Issue: Incorrect or Empty Normalization Results**

-   **Symptom:** The service returns a 200 OK, but the normalized skills are incorrect, empty, or not what's expected.
-   **Possible Causes:**
    1.  **Caching Stale Data:** The in-memory cache might be returning old, incorrect data.
    2.  **Upstream API Changes:** The ESCO API has changed the structure of its response, and our `skill-normalizer.ts` logic is no longer parsing it correctly.
-   **Troubleshooting Steps:**
    1.  **Restart the Service:** This is the quickest way to clear the in-memory cache.
    2.  **Log the Raw API Response:** In a debug environment, log the full, raw response from the ESCO API to see if its structure has changed.
    3.  **Escalate to Engineering:** If the API contract with ESCO has changed, the code will need to be updated. Escalate this to the engineering team.