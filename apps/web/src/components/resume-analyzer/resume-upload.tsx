'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@resume-platform/ui';
import { useResumeStore } from '@/store/resume';

interface ResumeUploadProps {
  onUploadSuccess: (resumeId: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload resume.');
      }

      const result = await response.json();
      onUploadSuccess(result.resume_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setFileName(null);
    } finally {
      setIsUploading(false);
      // Reset file input so the same file can be selected again
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4">1. Upload Your Resume</h2>
      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx"
          disabled={isUploading}
        />
        <Button onClick={handleButtonClick} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Select Resume File'}
        </Button>
        {fileName && !error && <p className="mt-2 text-sm text-muted-foreground">Selected: {fileName}</p>}
        {isUploading && <p className="mt-2 text-sm animate-pulse">Processing file...</p>}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
       <p className="mt-2 text-xs text-muted-foreground">Supported formats: PDF, DOCX</p>
    </div>
  );
};

export default ResumeUpload;