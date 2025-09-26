import { z } from 'zod';
export const projectSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    url: z.string().url().optional(),
    roles: z.array(z.string()).optional(),
    entity: z.string().optional(),
    type: z.string().optional(),
}).optional();
