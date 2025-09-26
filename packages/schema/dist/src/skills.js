import { z } from 'zod';
export const skillSchema = z.object({
    name: z.string().optional(),
    level: z.string().optional(),
    keywords: z.array(z.string()).optional(),
}).optional();
