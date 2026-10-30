import type { PostEntry } from '@/utils/posts';

export function taxonomyValues(post: PostEntry, field: 'tags' | 'categories'): string[] {
    if (field === 'categories') return post.data.categories ?? ['uncategorized'];
    return post.data.tags ?? [];
}

export function collectTaxonomies(posts: PostEntry[], field: 'tags' | 'categories'): string[] {
    return [...new Set(posts.flatMap((post) => taxonomyValues(post, field)))];
}

export function buildTaxonomyPaths(posts: PostEntry[], field: 'tags' | 'categories') {
    return collectTaxonomies(posts, field).map((term) => ({
        params: { [field === 'tags' ? 'tag' : 'category']: term },
        props: { posts: posts.filter((post) => taxonomyValues(post, field).includes(term)) },
    }));
}
