import logging
from fastapi import APIRouter, HTTPException, UploadFile, File, status

from ats_service.services import ResumeService

parser_router = APIRouter()
logger = logging.getLogger(__name__)

@parser_router.post(
    "/parse",
    summary="Parses a resume file (PDF or DOCX) and returns its content.",
    status_code=status.HTTP_200_OK,
)
async def parse_resume(
    file: UploadFile = File(...),
):
    """
    Accepts a resume file and returns its parsed content as JSON.
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
        resume_service = ResumeService()

        parsed_content = await resume_service.parse_resume_file(
            file_bytes=file_bytes,
            file_type=file.content_type
        )

        return {
            "filename": file.filename,
            "content": parsed_content,
        }
    except Exception as e:
        logger.error(f"Error parsing resume file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}",
        )