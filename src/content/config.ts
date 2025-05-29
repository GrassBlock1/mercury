import {defineCollection} from 'astro:content';
import {posts} from './posts/_schemas';
import {pages} from "./pages/_schemas";
import {file} from 'astro/loaders';
import { z } from 'astro:content';
import {authors} from '../data/authors._schema.ts';

const blogCollection = defineCollection({
    type: 'content',
    schema: posts,
});
const pageCollection = defineCollection({
    type: 'content',
    schema: pages,
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