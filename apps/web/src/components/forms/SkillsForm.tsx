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

export const SkillsForm = () => {
  const { resume, updateSkill, addSkill, removeSkill } = useResumeStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.skills.map((skill, index) => (
          <div key={index} className="space-y-2 rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`skill-name-${index}`}>Skill</Label>
                <Input
                  id={`skill-name-${index}`}
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(index, { name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`skill-level-${index}`}>Level</Label>
                <Input
                  id={`skill-level-${index}`}
                  value={skill.level}
                  onChange={(e) =>
                    updateSkill(index, { level: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeSkill(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addSkill}>Add Skill</Button>
      </CardContent>
    </Card>
  );
};