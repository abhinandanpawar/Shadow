import { z } from 'zod';
import { basicsSchema } from './basics';
import { workSchema } from './work';
import { educationSchema } from './education';
import { skillSchema } from './skills';
// Note: In a full implementation, schemas for volunteer, awards, etc. would be imported here.

export const resumeSchema = z.object({
  basics: basicsSchema,
  work: z.array(workSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  // ... other sections would be added here
});

export type Resume = z.infer<typeof resumeSchema>;

// Re-export all individual schemas and types for granular use
export * from './basics';
export * from './work';
export * from './education';
export * from './skills';