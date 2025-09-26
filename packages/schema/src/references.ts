import { z } from 'zod';

export const referenceSchema = z.object({
  name: z.string().optional(),
  reference: z.string().optional(),
}).optional();

export type Reference = z.infer<typeof referenceSchema>;
