'use client';

import { useState } from "react";
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

export default function EditorPage() {
  const [previewTheme, setPreviewTheme] = useState(themes[0]);

  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <ResumeManager />
          <ThemeSwitcher />
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