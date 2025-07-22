import { z, reference } from 'astro:content';

// @ts-ignore
export const posts = ({ image }) => z.object({
  title: z.string(),
  description: z.string(),
  summary: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  categories: z.array(z.string()).default(['uncategorized']),
  tags: z.array(z.string()).optional(),
  cover: image().optional(),
  author: reference('authors').optional(),
});