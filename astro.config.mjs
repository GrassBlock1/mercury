import {defineConfig} from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import {remarkWordCount} from './src/plugins/remark/wordcount.js';

import cloudflare from '@astrojs/cloudflare';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import partytown from '@astrojs/partytown';
import {remarkModifiedTime} from "./src/plugins/remark/modified-time.mjs";

import node from '@astrojs/node';

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
        remarkPlugins: [remarkMath, remarkWordCount, remarkModifiedTime],
        rehypePlugins: [rehypeKatex]
    },

    image: {
        responsiveStyles: true,
        layout: 'constrained',
    },

    i18n: {
        locales: ["en", "zh_hans"],
        defaultLocale: "en",
    },

    integrations: [sitemap(), mdx(), partytown()],

    adapter: node({
      mode: 'standalone'
    })
});