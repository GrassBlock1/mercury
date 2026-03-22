import {defineCollection} from 'astro:content';
import {posts} from './content/posts/_schemas.ts';
import {pages} from "./content/pages/_schemas.ts";
import {file,glob} from 'astro/loaders';
import { z } from 'astro/zod';
import {authors} from './data/authors._schema.ts';

const blogCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/posts" }),
    schema: posts,
});
const pageCollection = defineCollection({
    schema: pages,
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/pages" }),
});
const blogRollData = defineCollection({
    loader: file("src/data/links.yaml"),
    schema: z.object({
        link: z.string(),
        avatar: z.string().optional(),
        description: z.string().optional(),
    })
});

const authorsData = defineCollection({
    loader: file("src/data/authors.yaml"),
    schema: authors,
});

export const collections = {
    'posts': blogCollection,
    'pages': pageCollection,
    'links': blogRollData,
    'authors': authorsData,
};