import {experimental_AstroContainer as AstroContainer} from "astro/container";
import {loadRenderers} from "astro:container";
import {getCollection} from "astro:content";
import {transform, walk} from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import {siteConfig} from "../config.js"

// code from https://github.com/delucis/astro-blog-full-text-rss
export async function GET(context) {
    // Get the URL to prepend to relative site links. Based on `site` in `astro.config.mjs`.
    let baseUrl = context.site?.href || "https://terminal-blog.example.com";
    if (baseUrl.at(-1) === "/") baseUrl = baseUrl.slice(0, -1);

    // Load the content collection entries to add to our RSS feed.
    const posts =  (await getCollection('posts', ({ data }) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    })).sort((a, b) =>
        // Sort by publication date descending.
        a.data.date > b.data.date ? -1 : 1
    );

    // Loop over blog posts to create feed items for each, including full content.
    const feedItems = [];
    for (const post of posts) {
        // Make sure each feed item has required properties with proper formatting
        feedItems.push({
            id: post.slug || post.id,
            url: `${baseUrl}/blog/${post.slug}`,
            title: post.data.title,
            content_text: post.body,
            image: post.data.cover,
            summary: post.summary,
            description: post.data.description,
            date_published: post.data.date.toISOString(),
            // TODO: actual authors from front matter
            authors: [siteConfig.defaultAuthor.name],
        });

    }

    // Return our RSS feed XML response.
    return new Response(JSON.stringify({
        version: "https://jsonfeed.org/version/1.1",
        title: siteConfig.title,user_comment: siteConfig.description,
        home_page_url: context.site,
        feed_url: `${context.site}feed.json`,
        items: feedItems,
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
