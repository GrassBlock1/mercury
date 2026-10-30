import {getContainerRenderer as getMDXRenderer} from "@astrojs/mdx/container-renderer";
import rss from "@astrojs/rss";
import {experimental_AstroContainer as AstroContainer} from "astro/container";
import {loadRenderers} from "astro:container";
import {render} from "astro:content";
import {transform, walk} from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import {siteConfig} from "../config.js"
import {getPublishedPosts, resolveAuthors, sortByDateDesc} from "@/utils/posts";
import {getPostSlug} from "@/i18n/utils";
import {getSiteBaseUrl} from "@/utils/feeds";

// code from https://github.com/delucis/astro-blog-full-text-rss
export async function GET(context) {
    const baseUrl = getSiteBaseUrl(context);

    // Load MDX renderer. Other renderers for UI frameworks (e.g. React, Vue, etc.) would need adding here if you were using those.
    const renderers = await loadRenderers([getMDXRenderer()]);

    // Create a new Astro container that we can render components with.
    // See https://docs.astro.build/en/reference/container-reference/
    const container = await AstroContainer.create({renderers});

    // Load the content collection entries to add to our RSS feed, newest first.
    const posts = sortByDateDesc(await getPublishedPosts());

    // Loop over blog posts to create feed items for each, including full content.
    const feedItems = [];
    for (const post of posts) {
        // Get the `<Content/>` component for the current post.
        const {Content} = await render(post);
        // Use the Astro container to render the content to a string.
        const rawContent = await container.renderToString(Content);
        // Process and sanitize the raw content:
        // - Removes `<!DOCTYPE html>` preamble
        // - Makes link `href` and image `src` attributes absolute instead of relative
        // - Strips any `<script>` and `<style>` tags
        // Thanks @Princesseuh — https://github.com/Princesseuh/erika.florist/blob/1827288c14681490fa301400bfd815acb53463e9/src/middleware.ts
        const content = await transform(rawContent.replace(/^<!DOCTYPE html>/, ''), [
            async (node) => {
                await walk(node, (node) => {
                    if (node.name === "a" && node.attributes.href?.startsWith("/")) {
                        node.attributes.href = baseUrl + node.attributes.href;
                    }
                    if (node.name === "img" && node.attributes.src?.startsWith("/")) {
                        node.attributes.src = baseUrl + node.attributes.src;
                    }
                });
                return node;
            },
            sanitize({dropElements: ["script", "style"]}),
        ]);

        const authors = await resolveAuthors(post);

        // Make sure each feed item has required properties with proper formatting
        feedItems.push({
            title: post.data.title,
            description: post.data.description || '',
            pubDate: post.data.date,
            categories: post.data.categories,
            author: authors.map((author) => author.name).join(', ') || siteConfig.defaultAuthor.name,
            link: `${baseUrl}${getPostSlug(post.id)}`,
            content,
        });

    }

    // Return our RSS feed XML response.
    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        items: feedItems,
    });
}
