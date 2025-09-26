"use client";

import { useResumeStore } from "@/store/resume";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@resume-platform/ui/components/Card";
import { Button } from "@resume-platform/ui/components/Button";
import { Input } from "@resume-platform/ui/components/Input";
import { Label } from "@resume-platform/ui/components/Label";
import { Textarea } from "@resume-platform/ui/components/Textarea";
import { Work } from "@resume-platform/schema";

export function WorkForm() {
  const { work, addWork, updateWork, removeWork } = useResumeStore(
    (state) => ({
      work: state.resume.work,
      addWork: state.addWork,
      updateWork: state.updateWork,
      removeWork: state.removeWork,
    })
  );

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateWork(index, { [name]: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Work Experience</CardTitle>
        <Button variant="outline" size="sm" onClick={addWork}>
          Add Entry
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {work.map((workItem, index) => (
          <div key={index} className="space-y-4 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {workItem.name || `Work Entry ${index + 1}`}
              </h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeWork(index)}
              >
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`work-name-${index}`}>Company</Label>
                <Input
                  id={`work-name-${index}`}
                  name="name"
                  value={workItem.name}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`work-position-${index}`}>Position</Label>
                <Input
                  id={`work-position-${index}`}
                  name="position"
                  value={workItem.position}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Lead Developer"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`work-startDate-${index}`}>Start Date</Label>
                <Input
                  id={`work-startDate-${index}`}
                  name="startDate"
                  value={workItem.startDate}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="2022-01-01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`work-endDate-${index}`}>End Date</Label>
                <Input
                  id={`work-endDate-${index}`}
                  name="endDate"
                  value={workItem.endDate}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="2023-12-31"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`work-summary-${index}`}>Summary</Label>
              <Textarea
                id={`work-summary-${index}`}
                name="summary"
                value={workItem.summary}
                onChange={(e) => handleChange(index, e)}
                placeholder="Briefly describe your role and achievements."
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}