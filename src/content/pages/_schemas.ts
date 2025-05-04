import { z } from 'astro:content';

export const pages = z.object({
  title: z.string(),
  description: z.string(),
  heroImage: z.string().optional()
});