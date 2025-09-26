import { Button } from "@resume-platform/ui/components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Resume Platform</h1>
      <p className="mb-4">The web application is running.</p>
      <Button variant="primary" onClick={() => alert("UI Package Works!")}>
        Test Shared Button
      </Button>
    </main>
  );
}