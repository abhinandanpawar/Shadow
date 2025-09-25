# Runbook: Parser Service

**Service Name:** `@resume-platform/parser-service`
**Contact:** Engineering Team <eng@example.com>
**Description:** This service handles the parsing of uploaded PDF/DOCX resumes into the JSON Resume format.

---

## 1. Deployment

### **Prerequisites:**
-   A running Node.js environment (v20.11.1 or later).
-   Access to the built Docker image for this service.

### **Deployment Steps:**
1.  **Pull the Docker Image:**
    ```bash
    docker pull our-registry/parser-service:latest
    ```
2.  **Run the Docker Container:**
    ```bash
    docker run -d \
      -p 3001:3001 \
      --name parser-service \
      --restart always \
      our-registry/parser-service:latest
    ```
3.  **Verify Deployment:**
    -   Check that the container is running: `docker ps`.
    -   Check the container logs for the "Parser service listening" message: `docker logs parser-service`.

---

## 2. Monitoring

### **Key Metrics to Watch:**

-   **API Error Rate (5xx):** A sudden spike indicates a problem with the service itself or its dependencies.
    -   **Tool:** Prometheus/Grafana, Datadog
    -   **Alert Threshold:** > 2% error rate over a 5-minute window.
-   **API Latency (p95/p99):** High latency could indicate performance issues, especially with large files.
    -   **Tool:** Prometheus/Grafana, Datadog
    -   **Alert Threshold:** p95 latency > 2000ms.
-   **CPU & Memory Usage:** Monitor for memory leaks or unexpected CPU spikes.
    -   **Tool:** `docker stats`, Node exporter for Prometheus.
    -   **Alert Threshold:** Memory usage > 80% of allocated limit.

### **Health Check Endpoint:**
-   The service should expose a `GET /health` endpoint that returns a `200 OK` status if the service is running correctly. This can be used by load balancers and monitoring systems.

---

## 3. Troubleshooting & Common Issues

### **Issue: High 5xx Error Rate**

-   **Symptom:** The monitoring system alerts on a high percentage of 500-level errors from the `/api/import` endpoint.
-   **Possible Causes:**
    1.  The service cannot connect to a downstream dependency (if any).
    2.  An unhandled exception is occurring during parsing (e.g., a malformed file that the OpenResume library cannot handle).
    3.  The service has run out of memory.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** Immediately inspect the service logs for error messages or stack traces.
        ```bash
        docker logs parser-service --tail 100
        ```
    2.  **Inspect Problematic File:** If the logs indicate an issue with a specific file, try to obtain a sample of that file to reproduce the error in a staging environment.
    3.  **Restart the Service:** A simple restart can sometimes resolve transient issues.
        ```bash
        docker restart parser-service
        ```

### **Issue: High Latency**

-   **Symptom:** API response times are exceeding the defined threshold.
-   **Possible Causes:**
    1.  The service is processing unusually large or complex PDF/DOCX files.
    2.  The service is under-provisioned (not enough CPU or memory).
-   **Troubleshooting Steps:**
    1.  **Check Resource Usage:** Use `docker stats` to check the CPU and memory usage of the container.
    2.  **Scale the Service:** If the service is consistently hitting its resource limits, consider scaling it horizontally (running more containers) or vertically (allocating more resources).
    3.  **Analyze Logs for Slow Operations:** Check logs for any specific requests that are taking an unusually long time to process.

### **Issue: Service is Unresponsive**

-   **Symptom:** The health check endpoint is failing, or the service is not responding to requests.
-   **Possible Causes:**
    1.  The container has crashed.
    2.  The Node.js process has exited due to an unhandled error.
-   **Troubleshooting Steps:**
    1.  **Check Container Status:** Run `docker ps -a` to see if the container is still running or has exited.
    2.  **Inspect Logs:** If the container has exited, inspect its logs to find the cause of the crash.
    3.  **Restart the Container:** If the cause is not immediately clear, a restart is the first step to recovery. If it continues to crash, the issue needs to be escalated to the engineering team for debugging.