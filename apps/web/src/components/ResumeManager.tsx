"use client";

import { useRef } from "react";
import { useResumeStore } from "@/store/resume";
import { Button } from "@resume-platform/ui/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@resume-platform/ui/components/DropdownMenu";
import { Resume } from "@resume-platform/schema";

export const ResumeManager = () => {
  const {
    resumes,
    activeIndex,
    switchResume,
    addResume,
    addExistingResume,
    removeResume,
  } = useResumeStore();
  const activeResume = resumes[activeIndex];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/api/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to import file.");
      }

      const importedResume = (await response.json()) as Resume;
      addExistingResume(importedResume);
    } catch (error) {
      console.error("Import failed:", error);
      alert(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        className="hidden"
        accept=".pdf,.docx"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {activeResume?.basics.name || "Select Resume"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Your Resumes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {resumes.map((resume, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => switchResume(index)}
              className={index === activeIndex ? "font-bold" : ""}
            >
              {resume.basics.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={addResume}>
            Create New Resume
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            Import from File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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