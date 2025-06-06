import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';
import remarkToc from 'remark-toc';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://terminal-blog.example.com',
  base: '/',
  trailingSlash: 'ignore',

  build: {
    format: 'directory'
  },

  markdown: {
    shikiConfig: {
      theme: 'nord',
      wrap: true
    },
    remarkPlugins: [
        [remarkToc, { heading: 'Contents', maxDepth: 3 }]
    ]
  },

  integrations: [sitemap(), mdx()],

  adapter: cloudflare()
});