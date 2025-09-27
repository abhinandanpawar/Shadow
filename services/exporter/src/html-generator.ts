import ReactDOMServer from "react-dom/server";
import { Resume } from "@resume-platform/schema";
import { ClassicTheme } from "../../../apps/web/src/components/preview/themes/Classic";
import { ModernTheme } from "../../../apps/web/src/components/preview/themes/Modern";

const renderTheme = (theme: string, resume: Resume) => {
  switch (theme) {
    case "Modern":
      return ModernTheme({ resume });
    case "Classic":
    default:
      return ClassicTheme({ resume });
  }
};

export const generateHtml = async (
  resume: Resume,
  theme: string
): Promise<string> => {
  const component = renderTheme(theme, resume);
  const content = ReactDOMServer.renderToStaticMarkup(component);

  // We can wrap the content in a basic HTML shell with Tailwind CSS.
  // For simplicity, we'll use a CDN link for Tailwind.
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resume.basics.name} - Resume</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="A4">${content}</div>
    </body>
    </html>
  `;
};