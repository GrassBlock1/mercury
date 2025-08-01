import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getCollection } from "astro:content";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { siteConfig } from "../config.js"

// code from https://github.com/delucis/astro-blog-full-text-rss
export async function GET(context) {
  // Get the URL to prepend to relative site links. Based on `site` in `astro.config.mjs`.
  let baseUrl = context.site?.href || "https://terminal-blog.example.com";
  if (baseUrl.at(-1) === "/") baseUrl = baseUrl.slice(0, -1);

  // Load MDX renderer. Other renderers for UI frameworks (e.g. React, Vue, etc.) would need adding here if you were using those.
  const renderers = await loadRenderers([getMDXRenderer()]);

  // Create a new Astro container that we can render components with.
  // See https://docs.astro.build/en/reference/container-reference/
  const container = await AstroContainer.create({ renderers });

  // Load the content collection entries to add to our RSS feed.
  const posts = (await getCollection("posts")).sort((a, b) =>
      // Sort by publication date descending.
      a.data.pubDate > b.data.pubDate ? -1 : 1
  );

  // Loop over blog posts to create feed items for each, including full content.
  const feedItems = [];
  for (const post of posts) {
    // Get the `<Content/>` component for the current post.
    const { Content } = await post.render();
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
      sanitize({ dropElements: ["script", "style"] }),
    ]);

    // Make sure each feed item has required properties with proper formatting
    feedItems.push({
      title: post.data.title,
      description: post.data.description || '',
      pubDate: post.data.pubDate,
      link: `${baseUrl}/blog/${post.slug}`,
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
