import { z, reference } from 'astro:content';

// @ts-ignore
export const posts = ({ image }) => z.object({
  title: z.string(),
  description: z.string().optional(),
  summary: z.string().optional(),
  date: z.coerce.date(),
  categories: z.union([z.array(z.string()), z.string()]).transform(val => Array.isArray(val) ? val : [val]).default(['uncategorized']),
  tags: z.array(z.string()).optional(),
  cover: image().optional(),
  author: z.union([z.array(reference('authors')), reference('authors')]).optional(),
});