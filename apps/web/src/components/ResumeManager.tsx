"use client";

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

export const ResumeManager = () => {
  const { resumes, activeIndex, switchResume, addResume, removeResume } =
    useResumeStore();
  const activeResume = resumes[activeIndex];

  return (
    <div className="flex items-center gap-4">
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