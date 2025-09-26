import { z } from 'zod';
export const educationSchema = z.object({
    institution: z.string().optional(),
    url: z.string().url().optional(),
    area: z.string().optional(),
    studyType: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    score: z.string().optional(),
    courses: z.array(z.string()).optional(),
}).optional();
