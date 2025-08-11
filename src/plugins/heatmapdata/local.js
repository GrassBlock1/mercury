import { getCollection, render } from 'astro:content';

async function fetchPostsData() {
    const posts = await getCollection('posts');
    const entriesData = {};

    for (const post of posts) {
        const { remarkPluginFrontmatter } = await post.render();
        const dateKey = post.data.date.toISOString().split('T')[0]; // "2025-07-25"
        entriesData[dateKey] = {
            wordCount: remarkPluginFrontmatter.wordcount.words / 1000 || 0,
            link: `/blog/${post.slug}`,
            title: post.data.title
        };
    }

    return entriesData;
}

export async function generateLocalData() {
    const postsData = await fetchPostsData();
    const data = []
    Object.entries(postsData).forEach(([dateKey, entry]) => {
        data.push([
            new Date(dateKey).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
            entry.wordCount || 0,
        ])
    })
    return data;
}