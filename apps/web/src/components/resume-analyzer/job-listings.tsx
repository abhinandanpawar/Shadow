import React, { useState } from 'react';
import PasteJobDescription from './paste-job-description';
import { useResumeStore, ImprovedResult } from '@/store/resume';
import { Button } from '@resume-platform/ui';

interface JobListingsProps {
  resumeId: string | null;
}

const JobListings: React.FC<JobListingsProps> = ({ resumeId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setImprovedResult = useResumeStore((state) => state.setImprovedResult);
  const improvedResult = useResumeStore((state) => state.improvedResult);

  const handleOpenModal = () => {
    if (!resumeId) {
      setError('Please upload a resume before analyzing a job description.');
      return;
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePasteAndAnalyzeJob = async (text: string) => {
    if (!resumeId) {
      setError('Cannot analyze without a resume ID.');
      return;
    }

    setIsAnalyzing(true);
    setImprovedResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_id: resumeId,
          job_description: text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze job description');
      }

      const analysisResult = (await response.json()) as ImprovedResult;
      setImprovedResult(analysisResult);
    } catch (err) {
      console.error('Error analyzing job description:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setImprovedResult(null);
    } finally {
      setIsAnalyzing(false);
      handleCloseModal();
    }
  };

  const analyzedJob = improvedResult?.data.job_id ? {
      title: "Processed Job",
      company: "Processed Company",
      location: "Processed Location",
  } : null;

  return (
    <div className="bg-background p-6 rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4">2. Analyze Job</h2>
      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
        <Button onClick={handleOpenModal} disabled={!resumeId || isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Paste Job Description'}
        </Button>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {!resumeId && <p className="mt-2 text-xs text-muted-foreground">Upload a resume to enable analysis.</p>}
      </div>

      {isModalOpen && (
        <PasteJobDescription
          onClose={handleCloseModal}
          onPaste={handlePasteAndAnalyzeJob}
        />
      )}
    </div>
  );
};

export default JobListings;