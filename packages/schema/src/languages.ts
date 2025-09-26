import { z } from 'zod';

export const languageSchema = z.object({
  language: z.string().optional(),
  fluency: z.string().optional(),
}).optional();

export type Language = z.infer<typeof languageSchema>;
