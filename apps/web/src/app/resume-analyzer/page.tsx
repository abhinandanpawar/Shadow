'use client';

import React, { useState } from 'react';
import ResumeUpload from '@/components/resume-analyzer/resume-upload';
import JobListings from '@/components/resume-analyzer/job-listings';
import ResumeAnalysis from '@/components/resume-analyzer/resume-analysis';
import Resume from '@/components/resume-analyzer/resume-component';

const ResumeAnalyzerPage = () => {
  const [resumeId, setResumeId] = useState<string | null>(null);

  const handleUploadSuccess = (id: string) => {
    setResumeId(id);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Resume Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload your resume and a job description to get an instant analysis and matching score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
          <JobListings resumeId={resumeId} />
          <ResumeAnalysis />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-background p-6 rounded-lg shadow-lg border h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Resume Preview</h2>
              <p className="text-muted-foreground text-sm">
                This is a preview of your resume as seen by the analyzer.
              </p>
            </div>
            <div className="flex-grow overflow-auto">
              <Resume />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;