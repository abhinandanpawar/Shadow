"use client";

import { useResumeStore } from "@/store/resume";
import { ClassicTheme } from "./themes/Classic";
import { ModernTheme } from "./themes/Modern";

interface PreviewProps {
  theme: string;
}

export const Preview = ({ theme }: PreviewProps) => {
  const { resumes, activeIndex } = useResumeStore();
  const resume = resumes[activeIndex];

  if (!resume) {
    return (
      <div className="bg-white text-black shadow-lg rounded-lg p-8 A4 flex items-center justify-center">
        <p className="text-lg text-gray-500">
          No resume selected. Create or select a resume to get started.
        </p>
      </div>
    );
  }

  const renderTheme = () => {
    switch (theme) {
      case "Modern":
        return <ModernTheme resume={resume} />;
      case "Classic":
      default:
        return <ClassicTheme resume={resume} />;
    }
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden">{renderTheme()}</div>
  );
};