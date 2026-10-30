import { getEntryLangPath, getPostSlug } from "@/i18n/utils";
import { getPublishedPosts } from "@/utils/posts";

export async function GET() {
	const posts = await getPublishedPosts();
	const searchIndex = posts.map((post) => ({
		title: post.data.title,
		description: post.data.description || "",
		content: post.body,
		date: post.data.date,
		lang: getEntryLangPath(post.id),
		slug: getPostSlug(post.id, true),
	}));

	return new Response(JSON.stringify(searchIndex), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
