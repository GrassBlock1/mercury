import { getCollection } from 'astro:content';
import {defaultLocale, locales} from "@/i18n/utils.ts";

export const prerender = true;
export async function getStaticPaths() {
    const blogEntries = await getCollection('posts', (post) => {
        const languages = locales.filter(item => item !== defaultLocale)
        return (import.meta.env.PROD ? post.data.draft !== true : true) && (post.filePath.split("/")[0] === defaultLocale || !languages.includes(post.filePath.split("/")[0]));
    });
    return blogEntries.map(entry => {
        const slug = entry.id.split("/")[0] === defaultLocale ? entry.id.split("/").slice(1).join("/") : entry.id;
        return {params: { slug }, props: { entry }}
    });
}
export async function GET({ props }) {
    const { entry } = props;
    // Format the content as plain text
    const title = entry.data.title;
    const date = entry.data.date.toISOString().split('T')[0];
    const content = entry.body;

    // Combine the post info and body into a single text file
    const textContent = `Title: ${title}\nPublished at: ${date}\n\n${content}`;

    return new Response(textContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}