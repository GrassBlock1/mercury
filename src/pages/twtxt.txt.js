import { getEmDashCollection } from "emdash";
import { getSiteBaseUrl } from "@/utils/feeds";

export async function GET(context) {
	const baseUrl = getSiteBaseUrl(context);
	// Sort posts by date (newest first)
	const { entries: posts, error } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
	});
	if (error) return new Response("Unable to load twtxt", { status: 500 });

	const twtxt = posts
		.map(
			(post) =>
				`${new Date(post.data.original_date ?? post.data.publishedAt ?? post.data.createdAt).toISOString()}\t${post.data.title} ${baseUrl}/blog/${post.id}`,
		)
		.join("\n");

	return new Response(twtxt, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
