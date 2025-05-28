import { z } from 'astro:content';

export const posts = ({ image }) => z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  categories: z.array(z.string()).optional().default(['uncategorized']),
  tags: z.array(z.string()).optional().default([]),
  cover: image().optional(),
  author: z.string().optional(),
});