import { z, reference } from 'astro:content';

// @ts-ignore
export const posts = ({ image }) => z.object({
  title: z.string(),
  description: z.string(),
  summary: z.string().optional(),
  date: z.coerce.date(),
  categories: z.array(z.string()).default(['uncategorized']),
  tags: z.array(z.string()).optional(),
  cover: image().optional(),
  author: z.union([z.array(reference('authors')), reference('authors')]).optional(),
});