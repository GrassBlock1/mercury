import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = await getCollection('posts');
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());

    const twtxt = posts.map(post => (
        `${new Date(post.data.pubDate).toISOString()}\t${post.data.title} ${context.site}blog/${post.slug}`
    )).join('\n');

    return new Response(twtxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}