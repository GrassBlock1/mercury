import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
});
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

    const twtxt = posts.map(post => (
        `${new Date(post.data.date).toISOString()}\t${post.data.title} ${context.site}blog/${post.slug}`
    )).join('\n');

    return new Response(twtxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}