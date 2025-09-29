import os
import tempfile
import logging

from markdownify import markdownify as md
from pdfminer.high_level import extract_text
import docx

logger = logging.getLogger(__name__)

class ResumeService:
    def __init__(self):
        """
        Initializes the ResumeService.
        """
        pass

    async def parse_resume_file(self, file_bytes: bytes, file_type: str) -> str:
        """
        Converts a resume file (PDF or DOCX) into markdown text.

        Args:
            file_bytes: Raw bytes of the uploaded file.
            file_type: MIME type of the file.

        Returns:
            The extracted text content as a markdown string.
        """
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=self._get_file_extension(file_type)
        ) as temp_file:
            temp_file.write(file_bytes)
            temp_path = temp_file.name

        try:
            if file_type == "application/pdf":
                text_content = extract_text(temp_path)
            elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                doc = docx.Document(temp_path)
                text_content = "\n".join([p.text for p in doc.paragraphs])
            else:
                raise ValueError("Unsupported file type")

            # Convert the extracted text to Markdown for consistency.
            markdown_content = md(text_content)
            return markdown_content
        except Exception as e:
            logger.error(f"File conversion failed: {str(e)}")
            # Re-raise the exception to be handled by the API endpoint.
            raise
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def _get_file_extension(self, file_type: str) -> str:
        """
        Returns the appropriate file extension based on MIME type.
        """
        if file_type == "application/pdf":
            return ".pdf"
        elif (
            file_type
            == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ):
            return ".docx"
        return ""
