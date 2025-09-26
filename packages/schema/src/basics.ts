import { z } from 'zod';

const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
}).optional();

const profileSchema = z.object({
  network: z.string().optional(),
  username: z.string().optional(),
  url: z.string().url().optional(),
}).optional();

export const basicsSchema = z.object({
  name: z.string().optional(),
  label: z.string().optional(),
  image: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  location: locationSchema,
  profiles: z.array(profileSchema).optional(),
}).optional();

export type Basics = z.infer<typeof basicsSchema>;