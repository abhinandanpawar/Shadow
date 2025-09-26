# Runbook: ATS & AI Service

**Service Name:** `@resume-platform/ats-ai-service`
**Contact:** Engineering Team <eng@example.com>
**Description:** This service provides AI-powered features, including ATS scoring, JD matching, and content suggestions.

---

## 1. Deployment

### **Prerequisites:**
-   A running Node.js environment (v20.11.1 or later).
-   Access to the built Docker image.
-   Environment variables configured, including `OPENAI_API_KEY` and the URL for the sentence-transformer service.

### **Deployment Steps:**
1.  **Pull the Docker Image:**
    ```bash
    docker pull our-registry/ats-ai-service:latest
    ```
2.  **Run the Docker Container (with environment variables):**
    ```bash
    docker run -d \
      -p 3002:3002 \
      -e OPENAI_API_KEY="your-production-key" \
      -e SENTENCE_TRANSFORMER_SERVICE_URL="http://internal-ip:5000/embed" \
      --name ats-ai-service \
      --restart always \
      our-registry/ats-ai-service:latest
    ```

---

## 2. Monitoring

### **Key Metrics to Watch:**

-   **API Error Rate (5xx):** A spike can indicate issues with the service itself or, more likely, with its downstream dependencies (LLM provider, sentence-transformer service).
    -   **Alert Threshold:** > 2% error rate over a 5-minute window.
-   **External API Latency:** Monitor the response times from the LLM provider and the sentence-transformer service.
    -   **Alert Threshold:** p95 latency > 3000ms.
-   **Token Usage (LLM):** If possible, monitor the number of tokens being consumed to track costs.
    -   **Tool:** LLM provider's dashboard.

### **Health Check Endpoint:**
-   A `GET /health` endpoint should check not only that the service is running but also that it can connect to its downstream dependencies.

---

## 3. Troubleshooting & Common Issues

### **Issue: High 5xx Error Rate on `/api/ai/suggest`**

-   **Symptom:** The AI suggestions endpoint is failing.
-   **Possible Causes:**
    1.  **Invalid LLM API Key:** The `OPENAI_API_KEY` is incorrect or has expired.
    2.  **LLM Provider Outage:** The external LLM provider (e.g., OpenAI) is experiencing an outage.
    3.  **Rate Limiting:** The service is exceeding the rate limits of the LLM provider.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** Inspect the service logs for specific error messages from the LLM client library.
    2.  **Verify API Key:** Ensure the API key is correct and has sufficient credits/quota.
    3.  **Check External Service Status:** Visit the status page of the LLM provider (e.g., status.openai.com) to check for ongoing incidents.

### **Issue: High 5xx Error Rate on `/api/ats/score`**

-   **Symptom:** The ATS scoring endpoint, which may rely on semantic matching, is failing.
-   **Possible Causes:**
    1.  **Sentence-Transformer Service Down:** The internal service responsible for generating vector embeddings is unavailable.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** Look for connection errors to the `SENTENCE_TRANSFORMER_SERVICE_URL`.
    2.  **Verify Connectivity:** From inside the `ats-ai-service` container, try to `curl` the health check endpoint of the sentence-transformer service.
    3.  **Check the Other Service:** If the sentence-transformer service is down, refer to its own runbook to troubleshoot it.

### **Issue: Poor Quality AI Suggestions**

-   **Symptom:** Users report that the AI-generated content is nonsensical or irrelevant.
-   **Possible Causes:**
    1.  **Prompt Engineering Issue:** The prompt being sent to the LLM is poorly constructed.
    2.  **Underlying Model Degradation:** The external LLM provider may be experiencing issues with a specific model version.
-   **Troubleshooting Steps:**
    1.  **Log the Prompts:** Temporarily enable logging of the exact prompts being sent to the LLM to inspect them for issues.
    2.  **Escalate to Engineering:** This is likely not an operational issue. Escalate to the engineering team to investigate the prompt engineering or consider switching to a different model.