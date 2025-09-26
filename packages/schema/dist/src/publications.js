import { z } from 'zod';
export const publicationSchema = z.object({
    name: z.string().optional(),
    publisher: z.string().optional(),
    releaseDate: z.string().optional(),
    url: z.string().url().optional(),
    summary: z.string().optional(),
}).optional();
