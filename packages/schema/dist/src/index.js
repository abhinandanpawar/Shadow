import { z } from 'zod';
import { basicsSchema } from './basics';
import { workSchema } from './work';
import { volunteerSchema } from './volunteer';
import { educationSchema } from './education';
import { awardSchema } from './awards';
import { certificateSchema } from './certificates';
import { publicationSchema } from './publications';
import { skillSchema } from './skills';
import { languageSchema } from './languages';
import { interestSchema } from './interests';
import { referenceSchema } from './references';
import { projectSchema } from './projects';
export const resumeSchema = z.object({
    basics: basicsSchema,
    work: z.array(workSchema).optional(),
    volunteer: z.array(volunteerSchema).optional(),
    education: z.array(educationSchema).optional(),
    awards: z.array(awardSchema).optional(),
    certificates: z.array(certificateSchema).optional(),
    publications: z.array(publicationSchema).optional(),
    skills: z.array(skillSchema).optional(),
    languages: z.array(languageSchema).optional(),
    interests: z.array(interestSchema).optional(),
    references: z.array(referenceSchema).optional(),
    projects: z.array(projectSchema).optional(),
});
// Re-export all individual schemas and types for granular use
export * from './basics';
export * from './work';
export * from './volunteer';
export * from './education';
export * from './awards';
export * from './certificates';
export * from './publications';
export * from './skills';
export * from './languages';
export * from './interests';
export * from './references';
export * from './projects';
