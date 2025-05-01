import { defineConfig } from 'astro/config';

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
  }
});
