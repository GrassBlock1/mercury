import { z } from 'astro:content';

export const pages = z.object({
  title: z.string(),
  description: z.string().optional(),
  heroImage: z.string().optional()
});