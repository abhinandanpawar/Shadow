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

export const EducationForm = () => {
  const { resume, updateEducation, addEducation, removeEducation } = useResumeStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.education.map((edu, index) => (
          <div key={index} className="space-y-2 rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(index, { institution: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`area-${index}`}>Area of Study</Label>
                <Input
                  id={`area-${index}`}
                  value={edu.area}
                  onChange={(e) => updateEducation(index, { area: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`studyType-${index}`}>Degree</Label>
                <Input
                  id={`studyType-${index}`}
                  value={edu.studyType}
                  onChange={(e) =>
                    updateEducation(index, { studyType: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`gpa-${index}`}>GPA</Label>
                <Input
                  id={`gpa-${index}`}
                  value={edu.gpa}
                  onChange={(e) => updateEducation(index, { gpa: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  value={edu.startDate}
                  onChange={(e) =>
                    updateEducation(index, { startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  value={edu.endDate}
                  onChange={(e) =>
                    updateEducation(index, { endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeEducation(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addEducation}>Add Education</Button>
      </CardContent>
    </Card>
  );
};