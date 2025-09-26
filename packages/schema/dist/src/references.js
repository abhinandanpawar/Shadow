import { z } from 'zod';
export const referenceSchema = z.object({
    name: z.string().optional(),
    reference: z.string().optional(),
}).optional();
