import {defineConfig} from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';


//import remarkMath from "remark-math";
//import rehypeKatex from "rehype-katex";

import partytown from '@astrojs/partytown';

import node from '@astrojs/node';
import {satteri} from "@astrojs/markdown-satteri";

import {mdastReadingTimePlugin} from './src/plugins/remark/wordcount.js';
import {mdastModifiedTimePlugin} from "@/plugins/remark/modified-time.mjs";

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
        processor: satteri({
            mdastPlugins: [mdastReadingTimePlugin,mdastModifiedTimePlugin],
        }),
    },

    image: {
        responsiveStyles: true,
        layout: 'constrained',
    },

    i18n: {
        locales: [
            "en",
            {
                path: "zh-cn",
                codes: ["zh-CN"]
            }
        ],
        defaultLocale: "en",
        routing: {
            prefixDefaultLocale: false
        }
    },

    integrations: [sitemap(), mdx(), partytown()],

    adapter: node({
      mode: 'standalone'
    })
});