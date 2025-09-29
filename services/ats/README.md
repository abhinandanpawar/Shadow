# ATS Service

This service provides an API for parsing resumes from PDF and DOCX formats and for performing ATS (Applicant Tracking System) analysis against job descriptions.

## API Endpoints

-   `POST /parse`: Upload a resume file (PDF or DOCX) to receive a JSON representation of its content.
-   `POST /score`: (Future) Submit a resume and a job description to get an ATS score and keyword analysis.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Service:**
    ```bash
    python -m app.main
    ```