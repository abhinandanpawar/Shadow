# Runbook: Search Service

**Service Name:** `@resume-platform/search-service`
**Contact:** Engineering Team <eng@example.com>
**Description:** This service provides a hybrid search API by interfacing with an OpenSearch cluster.

---

## 1. Deployment

### **Prerequisites:**
-   A running Node.js environment.
-   A running and accessible OpenSearch cluster.
-   The `resumes` index must be created with the correct mapping before the service starts.
-   Environment variables configured, including `OPENSEARCH_NODE_URL` and `AI_SERVICE_URL`.

### **Deployment Steps:**
1.  **Pull the Docker Image:**
    ```bash
    docker pull our-registry/search-service:latest
    ```
2.  **Run the Docker Container:**
    ```bash
    docker run -d \
      -p 3005:3005 \
      -e OPENSEARCH_NODE_URL="http://opensearch-node:9200" \
      -e AI_SERVICE_URL="http://ats-ai-service:3002" \
      --name search-service \
      --restart always \
      our-registry/search-service:latest
    ```

---

## 2. Monitoring

### **Key Metrics to Watch:**

-   **OpenSearch Cluster Health:** The most critical metric. The cluster status should be `green`.
    -   **Tool:** OpenSearch Dashboards, Prometheus with OpenSearch exporter.
    -   **Alert Threshold:** Cluster status is `yellow` or `red`.
-   **API Error Rate (5xx):** A spike indicates a problem with the service or its connection to OpenSearch.
    -   **Alert Threshold:** > 2% error rate over a 5-minute window.
-   **Search Query Latency:** Monitor the time it takes to complete a search request.
    -   **Alert Threshold:** p95 latency > 1000ms.
-   **Indexing Failures:** Track the rate of failed indexing operations.

### **Health Check Endpoint:**
-   A `GET /health` endpoint should check the connection to the OpenSearch cluster (`client.ping()`).

---

## 3. Troubleshooting & Common Issues

### **Issue: Service Cannot Connect to OpenSearch**

-   **Symptom:** The service fails to start, or all requests fail with a connection error in the logs.
-   **Possible Causes:**
    1.  The OpenSearch cluster is down.
    2.  The `OPENSEARCH_NODE_URL` is incorrect.
    3.  There are network connectivity issues between the service and the OpenSearch cluster.
-   **Troubleshooting Steps:**
    1.  **Verify OpenSearch Health:** Check the status of the OpenSearch cluster directly.
        ```bash
        curl http://opensearch-node:9200/_cluster/health?pretty
        ```
    2.  **Check Environment Variable:** Ensure the `OPENSEARCH_NODE_URL` is correctly configured in the service's environment.
    3.  **Verify Network:** From inside the `search-service` container, try to `curl` the OpenSearch host.

### **Issue: Search Queries Are Failing or Returning No Results**

-   **Symptom:** The `/api/search` endpoint returns 500 errors or an empty array of results, even for queries that should match.
-   **Possible Causes:**
    1.  **Index Does Not Exist or is Corrupt:** The `resumes` index may not have been created, or it may be in a bad state.
    2.  **Incorrect Index Mapping:** The mapping for the `vector_embedding` or `full_text` fields is incorrect, preventing hybrid search from working.
    3.  **Indexing is Failing:** New resumes are not being successfully indexed, so they cannot be found.
-   **Troubleshooting Steps:**
    1.  **Check Index Existence and Health:**
        ```bash
        curl http://opensearch-node:9200/_cat/indices/resumes?v
        ```
    2.  **Inspect Index Mapping:**
        ```bash
        curl http://opensearch-node:9200/resumes/_mapping?pretty
        ```
        Verify that the fields have the correct types (`text`, `knn_vector`).
    3.  **Check Indexing Logs:** Check the logs of the `search-service` for errors during calls to `/api/search/index`.

### **Issue: Re-indexing is Required**

-   **Symptom:** The index mapping needs to be updated, or the existing data has become corrupted.
-   **Procedure (High-Level):**
    1.  **Create a New Index:** Create a new index with the updated mapping (e.g., `resumes_v2`).
    2.  **Trigger Re-indexing:** Run a script that reads all resume data from the primary database and uses the `/api/search/index` endpoint to index it into the new `resumes_v2` index.
    3.  **Update Alias:** Once the re-indexing is complete, update the `resumes` alias to point to the new `resumes_v2` index. This allows for zero-downtime re-indexing.
    4.  **Delete Old Index:** Once traffic is successfully flowing to the new index, the old index can be safely deleted.