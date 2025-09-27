import mammoth from "mammoth";
import { TextItem } from "./types";

export const readDocx = async (fileBuffer: Buffer): Promise<TextItem[]> => {
  const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
  // Mammoth extracts text with paragraphs separated by newlines.
  // We can simulate the TextItem structure by splitting the text into lines.
  const lines = value.split("\n");
  const textItems: TextItem[] = lines.map((line, i) => ({
    text: line,
    x: 0,
    y: i * 10, // Approximate y-coordinate
    width: 0,
    height: 0,
    fontName: "unknown",
  }));

  return textItems;
};