import { z } from 'astro:content';

export const posts = ({ image }:{image: ()=> z.ZodAny}) => z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  cover: image().optional(),
});