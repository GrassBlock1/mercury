import {experimental_AstroContainer as AstroContainer} from "astro/container";
import {loadRenderers} from "astro:container";
import {transform, walk} from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import {siteConfig} from "../config.js"
import {getPublishedPosts, sortByDateDesc} from "@/utils/posts";
import {getPostSlug} from "@/i18n/utils";
import {getSiteBaseUrl} from "@/utils/feeds";

// code from https://github.com/delucis/astro-blog-full-text-rss
export async function GET(context) {
    const baseUrl = getSiteBaseUrl(context);

    // Load the content collection entries to add to our RSS feed, newest first.
    const posts = sortByDateDesc(await getPublishedPosts());

    // Loop over blog posts to create feed items for each, including full content.
    const feedItems = [];
    for (const post of posts) {
        // Make sure each feed item has required properties with proper formatting
        feedItems.push({
            id: post.id,
            url: `${baseUrl}${getPostSlug(post.id)}`,
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
