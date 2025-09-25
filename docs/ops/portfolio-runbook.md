# Runbook: Portfolio Service

**Service Name:** `@resume-platform/portfolio-service`
**Contact:** Engineering Team <eng@example.com>
**Description:** This service fetches user repository and profile data from the GitHub API.

---

## 1. Deployment

### **Prerequisites:**
-   A running Node.js environment.
-   Access to the built Docker image.

### **Deployment Steps:**
1.  **Pull the Docker Image:**
    ```bash
    docker pull our-registry/portfolio-service:latest
    ```
2.  **Run the Docker Container:**
    ```bash
    docker run -d \
      -p 3007:3007 \
      --name portfolio-service \
      --restart always \
      our-registry/portfolio-service:latest
    ```
    *(Note: This service is stateless and requires no special environment variables to run, as the user's GitHub PAT is passed in the request header.)*

---

## 2. Monitoring

### **Key Metrics to Watch:**

-   **API Error Rate (5xx):** A spike almost always indicates a problem with the downstream GitHub API.
    -   **Alert Threshold:** > 2% error rate over a 15-minute window.
-   **GitHub API Latency:** Monitor the response times from `api.github.com`.
    -   **Alert Threshold:** p95 latency > 3000ms.
-   **GitHub API Rate Limit Errors (403):** The service should handle 403 errors gracefully, but a high volume of them should be alerted on, as it could indicate abuse or a misbehaving client.
    -   **Alert Threshold:** > 10 rate limit errors in 5 minutes.

### **Health Check Endpoint:**
-   A `GET /health` endpoint should return `200 OK`. It could optionally make a test call to `api.github.com` without authentication to verify basic connectivity.

---

## 3. Troubleshooting & Common Issues

### **Issue: High 5xx Error Rate**

-   **Symptom:** The `/api/portfolio/github/sync` endpoint is frequently failing.
-   **Possible Causes:**
    1.  **GitHub API Outage:** The GitHub REST API is down or experiencing performance degradation.
    2.  **Network Issues:** There are network problems between our service and `api.github.com`.
-   **Troubleshooting Steps:**
    1.  **Check GitHub Status:** The first and most important step is to check the official GitHub status page: [https://www.githubstatus.com/](https://www.githubstatus.com/).
    2.  **Check Logs:** Inspect the service logs for specific error messages from the `octokit` client, such as connection timeouts.
    3.  **Verify Network:** From inside the `portfolio-service` container, try to `curl https://api.github.com`.

### **Issue: Specific User Sync Fails (4xx Errors)**

-   **Symptom:** A specific user reports that they cannot sync their portfolio, and the logs show a 4xx error (e.g., 401, 403, 404).
-   **Possible Causes:**
    1.  **Invalid Personal Access Token (401 Unauthorized):** The user's PAT is incorrect or has been revoked.
    2.  **Insufficient Token Scopes (403 Forbidden):** The user's PAT does not have the required scopes (`public_repo`, `read:user`).
    3.  **User Not Found (404 Not Found):** The provided username is incorrect.
-   **Troubleshooting Steps:**
    1.  **Inform the User:** These errors are client-side issues. The frontend application should be designed to catch these specific status codes and provide a clear error message to the user, instructing them to check their username and PAT.
    2.  **Do Not Log Tokens:** **CRITICAL:** Ensure that the service logs **never** record the user's PAT. The logs should only show that a 401 or 403 error occurred for a given username.

### **Issue: Stale Data is Being Returned**

-   **Symptom:** A user has updated their GitHub profile or repositories, but the service is still returning old data.
-   **Possible Causes:**
    1.  **Caching:** The in-memory cache has not yet expired.
-   **Troubleshooting Steps:**
    1.  **Inform the User:** Let the user know that data is cached for up to one hour and will refresh automatically.
    2.  **Manual Cache Bust (if necessary):** For urgent cases, the quickest way to clear the in-memory cache is to restart the service.
        ```bash
        docker restart portfolio-service
        ```
    3.  **Future Improvement:** A future version could include a `force-refresh=true` parameter on the API call to allow a user to bypass the cache, but this should be used sparingly to avoid hitting rate limits.