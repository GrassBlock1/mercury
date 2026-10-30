import { getPostSlug } from "@/i18n/utils";
import { renderOgImage } from "@/plugins/og-image";
import { getDefaultLocalePosts } from "@/utils/posts";

export async function getStaticPaths() {
	const posts = await getDefaultLocalePosts();
	return posts.map((post) => ({
		params: { slug: getPostSlug(post.id, true) },
		props: { post },
	}));
}

export async function GET({ props }) {
	return renderOgImage(props.post);
}
