import { z } from 'zod';

export const interestSchema = z.object({
  name: z.string().optional(),
  keywords: z.array(z.string()).optional(),
}).optional();

export type Interest = z.infer<typeof interestSchema>;
