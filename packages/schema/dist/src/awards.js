import { z } from 'zod';
export const awardSchema = z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    awarder: z.string().optional(),
    summary: z.string().optional(),
}).optional();
