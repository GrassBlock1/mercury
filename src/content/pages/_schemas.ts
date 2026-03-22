import { z } from 'astro/zod';

export const pages = z.object({
  title: z.string(),
  description: z.string().optional(),
  heroImage: z.string().optional()
});