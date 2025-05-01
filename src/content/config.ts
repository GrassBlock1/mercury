import { defineCollection } from 'astro:content';
import { blogs } from './blog/_schemas';

const blogCollection = defineCollection({
  type: 'content',
  schema: blogs,
});

export const collections = {
  'blog': blogCollection,
};