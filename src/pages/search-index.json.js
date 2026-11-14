import { getEmDashCollection } from "emdash";
import { portableTextToMarkdown } from "emdash/client";

export async function GET() {
	const { entries: posts, error } = await getEmDashCollection("posts");
	if (error)
		return new Response("Unable to load search index", { status: 500 });
	const searchIndex = posts.map((post) => ({
		title: post.data.title,
		description: post.data.excerpt || "",
		content: portableTextToMarkdown(post.data.content ?? []),
		date: post.data.original_date ?? post.data.publishedAt,
		lang: post.data.locale,
		slug: post.id,
	}));

	return new Response(JSON.stringify(searchIndex), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
