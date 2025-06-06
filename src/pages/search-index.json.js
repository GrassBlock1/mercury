import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  const searchIndex = posts.map(post => ({
    title: post.data.title,
    description: post.data.description,
    content: post.body,
    pubDate: post.data.pubDate,
    slug: post.slug
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}