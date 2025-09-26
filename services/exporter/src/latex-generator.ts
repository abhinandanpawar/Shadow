import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { Resume } from '@resume-platform/schema';

/**
 * Generates a LaTeX string from a resume data object and a specified template.
 *
 * @param resume The resume data object, conforming to the Resume schema.
 * @param templateName The name of the LaTeX template to use (e.g., 'awesome-cv').
 * @returns A promise that resolves to the generated LaTeX string.
 * @throws An error if the template file cannot be found or if rendering fails.
 */
export async function generateLatex(resume: Resume, templateName: string): Promise<string> {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.tex.template`);

  try {
    const template = await fs.readFile(templatePath, 'utf-8');

    // Use default EJS render function
    const latexString = ejs.render(template, { resume });

    return latexString;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`LaTeX template not found at ${templatePath}`);
    }
    throw new Error('Failed to render LaTeX template.');
  }
}