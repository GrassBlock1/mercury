import { getEntryLangPath, getPostSlug } from "@/i18n/utils";
import { renderOgImage } from "@/plugins/og-image";
import { getNonDefaultLocalePosts } from "@/utils/posts";

export async function getStaticPaths() {
	const posts = await getNonDefaultLocalePosts();
	return posts.flatMap((post) => {
		const lang = getEntryLangPath(post.id);
		if (!lang) return [];
		return [
			{ params: { lang, slug: getPostSlug(post.id, true) }, props: { post } },
		];
	});
}

export async function GET({ props }) {
	return renderOgImage(props.post);
}
