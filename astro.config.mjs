import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

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
    }
  },

  integrations: [sitemap(), mdx()],

  adapter: cloudflare()
});