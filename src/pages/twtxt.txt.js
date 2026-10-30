import { getPostSlug } from "@/i18n/utils";
import { getSiteBaseUrl } from "@/utils/feeds";
import { getPublishedPosts, sortByDateDesc } from "@/utils/posts";

export async function GET(context) {
	const baseUrl = getSiteBaseUrl(context);
	// Sort posts by date (newest first)
	const posts = sortByDateDesc(await getPublishedPosts());

	const twtxt = posts
		.map(
			(post) =>
				`${new Date(post.data.date).toISOString()}\t${post.data.title} ${baseUrl}${getPostSlug(post.id)}`,
		)
		.join("\n");

	return new Response(twtxt, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
