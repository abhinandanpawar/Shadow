"use client";

import { useResumeStore } from "@/store/resume";
import { Button } from "@resume-platform/ui/components/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@resume-platform/ui/components/Card";
import { Input } from "@resume-platform/ui/components/Input";
import { Label } from "@resume-platform/ui/components/Label";
import { Textarea } from "@resume-platform/ui/components/Textarea";

export const ProjectsForm = () => {
  const { resume, updateProject, addProject, removeProject } = useResumeStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.projects.map((project, index) => (
          <div key={index} className="space-y-2 rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                <Input
                  id={`project-name-${index}`}
                  value={project.name}
                  onChange={(e) =>
                    updateProject(index, { name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`project-url-${index}`}>URL</Label>
                <Input
                  id={`project-url-${index}`}
                  value={project.url}
                  onChange={(e) =>
                    updateProject(index, { url: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) =>
                  updateProject(index, { description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Highlights</Label>
              {project.highlights.map((highlight, hIndex) => (
                <div key={hIndex} className="flex items-center gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...project.highlights];
                      newHighlights[hIndex] = e.target.value;
                      updateProject(index, { highlights: newHighlights });
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newHighlights = project.highlights.filter(
                        (_, i) => i !== hIndex
                      );
                      updateProject(index, { highlights: newHighlights });
                    }}
                  >
                    X
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newHighlights = [...project.highlights, ""];
                  updateProject(index, { highlights: newHighlights });
                }}
              >
                Add Highlight
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeProject(index)}
            >
              Remove Project
            </Button>
          </div>
        ))}
        <Button onClick={addProject}>Add Project</Button>
      </CardContent>
    </Card>
  );
};