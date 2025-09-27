"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume";
import { BasicsForm } from "@/components/forms/BasicsForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { SkillsForm } from "@/components/forms/SkillsForm";
import { WorkForm } from "@/components/forms/WorkForm";
import { Preview } from "@/components/preview/Preview";
import {
  PreviewThemeSwitcher,
  themes,
} from "@/components/preview/PreviewThemeSwitcher";
import { ResumeManager } from "@/components/ResumeManager";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@resume-platform/ui/components/Button";

export default function EditorPage() {
  const [previewTheme, setPreviewTheme] = useState(themes[0]);
  const { resumes, activeIndex } = useResumeStore();

  const handleExportHtml = async () => {
    const resume = resumes[activeIndex];
    try {
      const response = await fetch("http://localhost:3003/api/export/html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, theme: previewTheme }),
      });

      if (!response.ok) {
        throw new Error("Failed to export HTML.");
      }

      const htmlBlob = await response.blob();
      const url = window.URL.createObjectURL(htmlBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.basics.name.replace(" ", "_")}_Resume.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed.");
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/public/${activeIndex}`;
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        alert("Public link copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        alert("Failed to copy link.");
      }
    );
  };

  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <ResumeManager />
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleShare}>
              Share
            </Button>
            <Button onClick={handleExportHtml}>Export as HTML</Button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main className="container mx-auto grid grid-cols-12 gap-8 py-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="space-y-6">
            <BasicsForm />
            <WorkForm />
            <EducationForm />
            <SkillsForm />
            <ProjectsForm />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-8 space-y-4">
            <PreviewThemeSwitcher
              currentTheme={previewTheme}
              onThemeChange={setPreviewTheme}
            />
            <Preview theme={previewTheme} />
          </div>
        </div>
      </main>
    </div>
  );
}