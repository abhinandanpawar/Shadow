# Runbook: Exporter Service

**Service Name:** `@resume-platform/exporter-service`
**Contact:** Engineering Team <eng@example.com>
**Description:** This service generates PDF and LaTeX files from JSON Resume data.

---

## 1. Deployment

### **Prerequisites:**
-   A running Node.js environment.
-   Access to the built Docker image. The Dockerfile for this service must correctly install all system-level dependencies required by Puppeteer (e.g., `libnss3`, `libgconf-2-4`, etc.).

### **Deployment Steps:**
1.  **Pull the Docker Image:**
    ```bash
    docker pull our-registry/exporter-service:latest
    ```
2.  **Run the Docker Container:**
    ```bash
    docker run -d \
      -p 3003:3003 \
      --name exporter-service \
      --restart always \
      our-registry/exporter-service:latest
    ```

---

## 2. Monitoring

### **Key Metrics to Watch:**

-   **API Error Rate (5xx):** A spike usually indicates a problem with Puppeteer or the templating engine.
    -   **Alert Threshold:** > 3% error rate over a 5-minute window.
-   **PDF Generation Time:** Monitor the time it takes to generate a PDF.
    -   **Alert Threshold:** p99 latency > 5000ms.
-   **CPU & Memory Usage:** Puppeteer can be resource-intensive. Monitor closely for spikes during PDF generation.
    -   **Alert Threshold:** CPU usage > 90% for sustained periods.

### **Health Check Endpoint:**
-   A `GET /health` endpoint should return `200 OK`.

---

## 3. Troubleshooting & Common Issues

### **Issue: PDF Generation Fails (5xx Error)**

-   **Symptom:** The `/api/export/pdf` endpoint returns a 500 error.
-   **Possible Causes:**
    1.  **Puppeteer Crash:** The headless Chromium instance has crashed. This can be due to memory constraints or missing system dependencies in the Docker container.
    2.  **Invalid Template Data:** The JSON Resume data being passed to the EJS template is malformed, causing the template engine to throw an error.
    3.  **File System Issues:** The service is unable to read the template files.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** The first step is always to check the service logs for stack traces. `docker logs exporter-service`.
    2.  **Verify System Dependencies:** Ensure the Docker image was built with all necessary dependencies for Puppeteer. If there are errors like `error while loading shared libraries`, the Dockerfile needs to be fixed.
    3.  **Check Resource Limits:** Use `docker stats` to see if the container is hitting its memory or CPU limits during the request.
    4.  **Reproduce with Payload:** If possible, get the exact JSON payload that caused the error and use it to reproduce the issue in a staging environment.

### **Issue: Generated PDF is Corrupt or Empty**

-   **Symptom:** The service returns a 200 OK, but the downloaded PDF file is 0 bytes or cannot be opened.
-   **Possible Causes:**
    1.  An error occurred after the response headers were sent but before the PDF buffer was fully written to the stream.
    2.  `page.pdf()` in Puppeteer is resolving with an empty buffer for some reason.
-   **Troubleshooting Steps:**
    1.  **Check Logs for Errors:** Even if a 200 was returned, there might be non-fatal errors in the logs.
    2.  **Inspect HTML:** Modify the `pdf-generator.ts` file in a debug environment to save the intermediate HTML (`const html = ejs.render(...)`) to a file. Inspecting this HTML can reveal if the template is rendering correctly before being passed to Puppeteer.

### **Issue: LaTeX Generation Fails**

-   **Symptom:** The `/api/export/latex` endpoint returns a 500 error.
-   **Possible Causes:**
    1.  **Template Not Found:** The requested template name (e.g., "awesome-cv") does not match a file in the `templates` directory.
    2.  **Template Rendering Error:** The JSON Resume data is missing a key that the LaTeX template requires, causing a rendering error.
-   **Troubleshooting Steps:**
    1.  **Check Logs:** Look for errors related to file reading or template rendering.
    2.  **Verify Template Name:** Ensure the client is sending a valid template name.
    3.  **Validate Input Data:** Check the request payload to ensure the `resume` object is complete.