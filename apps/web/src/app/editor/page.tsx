"use client";

import { useResumeStore } from "@/store/resume";
import { BasicsForm } from "@/components/forms/BasicsForm";
import { WorkForm } from "@/components/forms/WorkForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@resume-platform/ui/components/Card";

export default function EditorPage() {
  const resume = useResumeStore((state) => state.resume);

  return (
    <main className="container mx-auto grid grid-cols-12 gap-8 py-8">
      <div className="col-span-12 lg:col-span-8">
        <div className="space-y-6">
          <BasicsForm />
          <WorkForm />

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Education form will be implemented here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Skills form will be implemented here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Projects form will be implemented here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gray-100 p-4">
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                {JSON.stringify(resume, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}