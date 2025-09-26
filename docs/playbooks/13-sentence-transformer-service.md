# Playbook 13: Sentence-Transformer Service

**Objective:** To create the `@resume-platform/sentence-transformer-service`. This is a Python-based microservice responsible for one critical task: generating vector embeddings from text. It formalizes a key dependency for the `ats-ai-service` and `search-service`.

---

## 1. Research & Rationale

-   **Problem:** The best libraries for generating high-quality sentence embeddings (like `sentence-transformers`) are Python-based. Our main backend services are in Node.js. The most robust and scalable way to bridge this gap is to create a small, dedicated Python service that the Node.js services can call.
-   **Framework (`Flask`):** For a simple, single-endpoint microservice, Flask is an excellent choice. It is lightweight, easy to set up, and has a minimal learning curve.
-   **Model (`all-MiniLM-L6-v2`):** The `sentence-transformers/all-MiniLM-L6-v2` model is chosen for its excellent balance of performance and speed. It produces high-quality 384-dimensional embeddings and is small enough to run efficiently on a standard CPU.
-   **Dependency Management (`pip` and `requirements.txt`):** We will use standard Python tooling. A `requirements.txt` file will define all necessary Python dependencies.
-   **Containerization (`Dockerfile`):** This service will be containerized using Docker to ensure its environment is consistent and to simplify deployment alongside our Node.js services.

---

## 2. Step-by-Step Implementation Guide

### **Step 2.1: Create Service Directory**

1.  **Action:** Create the directory for the new Python service. Note that this service lives inside the `services` directory alongside our Node.js services.
2.  **Command:**
    ```bash
    mkdir -p services/sentence-transformer/src
    ```

### **Step 2.2: Create Python Dependency File**

1.  **Action:** Create a `requirements.txt` file.
2.  **File Content (`services/sentence-transformer/requirements.txt`):**
    ```
    Flask==3.0.3
    sentence-transformers==2.7.0
    torch==2.3.0
    ```

### **Step 2.3: Implement the Flask Application**

1.  **Action:** Create the main application file `app.py`.
2.  **File Content (`services/sentence-transformer/src/app.py`):**
    ```python
    from flask import Flask, request, jsonify
    from sentence_transformers import SentenceTransformer

    app = Flask(__name__)

    # Load the model on startup. This can take a few seconds.
    print("Loading sentence-transformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Model loaded successfully.")

    @app.route('/api/ai/embed', methods=['POST'])
    def embed():
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Text field is required.'}), 400

        try:
            text = data['text']
            embedding = model.encode(text).tolist()
            return jsonify({'embedding': embedding})
        except Exception as e:
            print(f"Error encoding text: {e}")
            return jsonify({'error': 'Failed to generate embedding.'}), 500

    @app.route('/health', methods=['GET'])
    def health_check():
        return "OK", 200

    if __name__ == '__main__':
        app.run(host='0.0.0.0', port=5000)
    ```

### **Step 2.4: Create the Dockerfile**

1.  **Action:** Create a `Dockerfile` to containerize the Python service.
2.  **File Content (`services/sentence-transformer/Dockerfile`):**
    ```dockerfile
    # Use a specific Python version for reproducibility
    FROM python:3.11-slim

    # Set the working directory
    WORKDIR /app

    # Copy the requirements file
    COPY requirements.txt .

    # Install dependencies
    # Using --no-cache-dir reduces image size
    RUN pip install --no-cache-dir -r requirements.txt

    # Copy the application code
    COPY ./src .

    # Expose the port the app runs on
    EXPOSE 5000

    # Define the command to run the application
    CMD ["python", "app.py"]
    ```

---

## 3. Verification Steps

1.  **[ ] Build the Docker Image:**
    *   Navigate to the `services/sentence-transformer` directory.
    *   Run `docker build -t sentence-transformer-service .`. The image should build successfully.
2.  **[ ] Run the Docker Container:**
    *   Run `docker run -p 5000:5000 sentence-transformer-service`.
    *   You should see logs indicating the model is loading and the Flask server is running.
3.  **[ ] Test with `curl`:**
    *   Execute the following command in your terminal:
        ```bash
        curl -X POST -H "Content-Type: application/json" \
        -d '{"text": "This is a test sentence."}' \
        http://localhost:5000/api/ai/embed
        ```
    *   **Expected Outcome:** A `200 OK` response with a JSON object containing an `embedding` key. The value should be an array of 384 numbers.
4.  **[ ] Test Health Check:**
    *   Run `curl http://localhost:5000/health`.
    *   **Expected Outcome:** A `200 OK` response with the text "OK".