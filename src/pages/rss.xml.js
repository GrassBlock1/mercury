import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getEmDashCollection } from "emdash";
import { PortableText } from "emdash/ui";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { getSiteBaseUrl } from "@/utils/feeds";
import { siteConfig } from "../config.js";

// code from https://github.com/delucis/astro-blog-full-text-rss
export async function GET(context) {
	const baseUrl = getSiteBaseUrl(context);

	const container = await AstroContainer.create();

	// Load the content collection entries to add to our RSS feed, newest first.
	const { entries: posts, error } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
	});
	if (error) return new Response("Unable to load RSS", { status: 500 });

	// Loop over blog posts to create feed items for each, including full content.
	const feedItems = [];
	for (const post of posts) {
		const rawContent = await container.renderToString(PortableText, {
			props: { value: post.data.content ?? [] },
		});
		// Process and sanitize the raw content:
		// - Removes `<!DOCTYPE html>` preamble
		// - Makes link `href` and image `src` attributes absolute instead of relative
		// - Strips any `<script>` and `<style>` tags
		// Thanks @Princesseuh — https://github.com/Princesseuh/erika.florist/blob/1827288c14681490fa301400bfd815acb53463e9/src/middleware.ts
		const content = await transform(
			rawContent.replace(/^<!DOCTYPE html>/, ""),
			[
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
			],
		);

		// Make sure each feed item has required properties with proper formatting
		feedItems.push({
			title: post.data.title,
			description: post.data.excerpt || "",
			pubDate: new Date(
				post.data.original_date ?? post.data.publishedAt ?? post.data.createdAt,
			),
			author: siteConfig.defaultAuthor.name,
			link: `${baseUrl}/blog/${post.id}`,
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
