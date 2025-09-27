"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/resume";
import { Preview } from "@/components/preview/Preview";
import { Resume } from "@resume-platform/schema";

export default function PublicResumePage({
  params,
}: {
  params: { resumeId: string };
}) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [theme, setTheme] = useState<string>("Classic"); // Default theme

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedState = JSON.parse(
        window.localStorage.getItem("resume-store") || "{}"
      );
      const allResumes = storedState.resumes || [];
      // The resumeId in this context will be the index from the array
      const resumeIndex = parseInt(params.resumeId, 10);
      const foundResume = allResumes[resumeIndex];

      if (foundResume) {
        setResume(foundResume);
        // For simplicity, we'll just use the default theme for public pages
        // A more advanced implementation could store the theme with the resume
      }
    }
  }, [params.resumeId]);

  if (!resume) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Resume not found or loading...</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-100 py-8">
      <div className="container mx-auto">
        <Preview theme={theme} />
      </div>
    </main>
  );
}