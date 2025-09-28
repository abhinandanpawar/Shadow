import logging
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status, Body

from app.core import get_db_session
from app.services import ResumeService, JobService, ScoreImprovementService
from app.schemas.pydantic.job import JobUploadRequest

resume_router = APIRouter()
logger = logging.getLogger(__name__)

@resume_router.post(
    "/upload",
    summary="Uploads and processes a resume file (PDF or DOCX)",
    status_code=status.HTTP_201_CREATED,
)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db_session),
):
    """
    Accepts a resume file, converts it to text, stores it,
    and returns a unique ID for the processed resume.
    """
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type. Please upload a PDF or DOCX file.",
        )

    try:
        file_bytes = await file.read()
        resume_service = ResumeService(db)

        resume_id = await resume_service.convert_and_store_resume(
            file_bytes=file_bytes,
            file_type=file.content_type,
            filename=file.filename,
        )

        return {
            "message": "Resume uploaded successfully",
            "resume_id": resume_id,
            "filename": file.filename,
        }
    except Exception as e:
        logger.error(f"Error processing resume file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}",
        )

@resume_router.post(
    "/analyze",
    summary="Analyzes a resume against a job description",
    status_code=status.HTTP_200_OK,
)
async def analyze_resume(
    resume_id: str = Body(...),
    job_description: str = Body(...),
    db: AsyncSession = Depends(get_db_session),
):
    """
    Accepts a resume_id and a job_description, and returns a full analysis.
    """
    try:
        # First, create the job and get a job_id
        job_service = JobService(db)
        # The service expects a dict, so we create it here
        job_payload = {"content": job_description, "content_type": "text"}
        job_id = await job_service.create_and_store_job(job_payload)

        if not job_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create a job entry.",
            )

        # Now, run the analysis
        improvement_service = ScoreImprovementService(db)
        analysis_result = await improvement_service.run(resume_id=resume_id, job_id=job_id)

        return analysis_result

    except Exception as e:
        logger.error(f"Error during analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during analysis: {str(e)}",
        )