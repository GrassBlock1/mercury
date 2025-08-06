import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import { remarkWordCount } from './src/plugins/wordcount.js';

import cloudflare from '@astrojs/cloudflare';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://terminal-blog.example.com',
  base: '/',
  trailingSlash: 'ignore',
  redirects: {
    // for the old routes still can be accessed
    "/post/[...slug]": "/blog/[...slug]"
  },

  build: {
    format: 'directory'
  },

  markdown: {
    shikiConfig: {
      theme: 'nord',
      wrap: true
    },
    remarkPlugins: [ remarkMath, remarkWordCount ],
    rehypePlugins: [ rehypeKatex ]
  },

  integrations: [sitemap(), mdx(), partytown()],

  adapter: cloudflare()
});