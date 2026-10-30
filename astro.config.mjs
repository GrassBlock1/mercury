import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

//import remarkMath from "remark-math";
//import rehypeKatex from "rehype-katex";

import { satteri } from "@astrojs/markdown-satteri";

import node from "@astrojs/node";
import partytown from "@astrojs/partytown";
import satteriKatex from "satteri-katex";
import { mdastDetectMathPlugin } from "@/plugins/satteri/math-detector.ts";
import { mdastModifiedTimePlugin } from "@/plugins/satteri/modified-time.mjs";
import { mdastSpoilerPlugin } from "@/plugins/satteri/spoiler.ts";
import { mdastReadingTimePlugin } from "@/plugins/satteri/wordcount.js";

export default defineConfig({
	site: "https://terminal-blog.example.com",
	base: "/",
	trailingSlash: "ignore",
	redirects: {
		// for the old routes still can be accessed
		"/post/[...slug]": "/blog/[...slug]",
	},

	build: {
		format: "directory",
	},

	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: ["300 400 700"],
		},
	],

	markdown: {
		shikiConfig: {
			theme: "nord",
			wrap: true,
		},
		processor: satteri({
			features: { math: true, rawHtml: true },
			mdastPlugins: [
				mdastDetectMathPlugin,
				satteriKatex(),
				mdastReadingTimePlugin,
				mdastModifiedTimePlugin,
				mdastSpoilerPlugin,
			],
		}),
	},

	image: {
		responsiveStyles: true,
		layout: "constrained",
	},

	i18n: {
		locales: [
			"en",
			{
				path: "zh-cn",
				codes: ["zh-CN"],
			},
		],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: false,
		},
	},

	integrations: [sitemap(), mdx(), partytown()],

	adapter: node({
		mode: "standalone",
	}),
});
