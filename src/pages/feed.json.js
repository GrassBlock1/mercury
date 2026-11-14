import { getEmDashCollection } from "emdash";
import { portableTextToMarkdown } from "emdash/client";
import { getSiteBaseUrl } from "@/utils/feeds";
import { siteConfig } from "../config.js";

// code from https://github.com/delucis/astro-blog-full-text-rss
export async function GET(context) {
	const baseUrl = getSiteBaseUrl(context);

	// Load the content collection entries to add to our RSS feed, newest first.
	const { entries: posts, error } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
	});
	if (error) return new Response("Unable to load feed", { status: 500 });

	// Loop over blog posts to create feed items for each, including full content.
	const feedItems = [];
	for (const post of posts) {
		// Make sure each feed item has required properties with proper formatting
		feedItems.push({
			id: post.id,
			url: `${baseUrl}/blog/${post.id}`,
			title: post.data.title,
			content_text: portableTextToMarkdown(post.data.content ?? []),
			image: post.data.featured_image?.url,
			summary: post.data.summary,
			description: post.data.excerpt,
			date_published: new Date(
				post.data.original_date ?? post.data.publishedAt ?? post.data.createdAt,
			).toISOString(),
			// TODO: actual authors from front matter
			authors: [siteConfig.defaultAuthor.name],
		});
	}

	// Return our RSS feed XML response.
	return new Response(
		JSON.stringify({
			version: "https://jsonfeed.org/version/1.1",
			title: siteConfig.title,
			user_comment: siteConfig.description,
			home_page_url: context.site,
			feed_url: `${context.site}feed.json`,
			items: feedItems,
		}),
		{
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
}
