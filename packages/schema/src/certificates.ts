import { z } from 'zod';

export const certificateSchema = z.object({
  name: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional(),
  issuer: z.string().optional(),
}).optional();

export type Certificate = z.infer<typeof certificateSchema>;
