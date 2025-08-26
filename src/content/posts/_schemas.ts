import {z, reference} from 'astro:content';

// @ts-ignore
export const posts = ({image}) => z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().optional().default(false),
    summary: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    categories: z.union([z.array(z.string()), z.string()]).transform(val => Array.isArray(val) ? val : [val]).default(['uncategorized']),
    tags: z.union([z.array(z.string()), z.string()]).transform(val => Array.isArray(val) ? val : [val]).optional(),
    cover: image().optional(),
    author: z.union([z.array(reference('authors')), reference('authors')]).optional(),
});