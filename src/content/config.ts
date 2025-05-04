import { defineCollection } from 'astro:content';
import { posts } from './posts/_schemas';
import { pages } from "./pages/_schemas";

const blogCollection = defineCollection({
  type: 'content',
  schema: posts,
});
const pageCollection = defineCollection({
    type: 'content',
    schema: pages,
});

export const collections = {
  'posts': blogCollection,
  'pages': pageCollection,
};