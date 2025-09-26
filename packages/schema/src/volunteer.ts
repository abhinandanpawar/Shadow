import { z } from 'zod';

export const volunteerSchema = z.object({
  organization: z.string().optional(),
  position: z.string().optional(),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
}).optional();

export type Volunteer = z.infer<typeof volunteerSchema>;
