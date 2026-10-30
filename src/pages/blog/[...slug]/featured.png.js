import { getDefaultLocalePosts } from '@/utils/posts';
import { getPostSlug } from '@/i18n/utils';
import { renderOgImage } from '@/plugins/og-image';

export async function getStaticPaths() {
  const posts = await getDefaultLocalePosts();
  return posts.map((post) => ({ params: { slug: getPostSlug(post.id, true) }, props: { post } }));
}

export async function GET({ props }) {
  return renderOgImage(props.post);
}
