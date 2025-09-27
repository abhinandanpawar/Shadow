import { readPdf } from "./read-pdf";
import { readDocx } from "./read-docx";
import { groupTextItemsIntoLines } from "./group-text-items-into-lines";
import { groupLinesIntoSections } from "./group-lines-into-sections";
import { extractResumeFromSections } from "./extract-resume-from-sections";
import { TextItem } from "./types";

/**
 * Resume parser util that parses a resume from a resume file (PDF or DOCX)
 *
 * Note: The parser algorithm only works for single column resume in English language
 */
export const parseResumeFromFile = async (file: {
  buffer: Buffer;
  mimetype: string;
}) => {
  let textItems: TextItem[];

  // Step 1. Read a resume file into text items to prepare for processing
  if (file.mimetype === "application/pdf") {
    textItems = await readPdf(file.buffer);
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    textItems = await readDocx(file.buffer);
  } else {
    throw new Error(`Unsupported file type: ${file.mimetype}. Please upload a PDF or DOCX file.`);
  }

  // Step 2. Group text items into lines
  const lines = groupTextItemsIntoLines(textItems);

  // Step 3. Group lines into sections
  const sections = groupLinesIntoSections(lines);

  // Step 4. Extract resume from sections
  const resume = extractResumeFromSections(sections);

  return resume;
};
