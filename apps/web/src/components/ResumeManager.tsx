"use client";

import { useResumeStore } from "@/store/resume";
import { Button } from "@resume-platform/ui/components/Button";

export const ResumeManager = () => {
  const { resumes, activeIndex, switchResume, addResume, removeResume } =
    useResumeStore();
  const activeResume = resumes[activeIndex];

  return (
    <div className="flex items-center gap-4">
      <select
        value={activeIndex}
        onChange={(e) => switchResume(parseInt(e.target.value, 10))}
        className="p-2 border rounded-md bg-white dark:bg-gray-800"
      >
        {resumes.map((resume, index) => (
          <option key={index} value={index}>
            {resume.basics.name || `Resume ${index + 1}`}
          </option>
        ))}
      </select>
      <Button variant="outline" size="sm" onClick={addResume}>
        Create New Resume
      </Button>
      {resumes.length > 1 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeResume(activeIndex)}
        >
          Delete Current
        </Button>
      )}
    </div>
  );
};