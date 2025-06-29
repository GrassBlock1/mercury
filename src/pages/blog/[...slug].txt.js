import { getCollection } from 'astro:content';

export const prerender = true;
export async function getStaticPaths() {
    const blogEntries = await getCollection('posts');
    return blogEntries.map(entry => ({
        params: { slug: entry.slug }, props: { entry },
    }));
}
export async function GET({ props }) {
    const { entry } = props;
    // Format the content as plain text
    const title = entry.data.title;
    const date = entry.data.pubDate.toISOString().split('T')[0];
    const content = entry.body;

    // Combine the post info and body into a single text file
    const textContent = `Title: ${title}\nPublished at: ${date}\n\n${content}`;

    return new Response(textContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}