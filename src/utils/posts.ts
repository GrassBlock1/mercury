import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { getPathByLocale } from 'astro:i18n';
import { defaultLocale, getEntryLocale } from '@/i18n/utils';
import { siteConfig } from '@/config';

export type PostEntry = CollectionEntry<'posts'>;

export interface AuthorData {
    name: string;
    email?: string;
    avatar?: unknown;
    mcplayerid?: string;
}

export function isPublished(entry: { data: { draft?: boolean } }): boolean {
    return import.meta.env.PROD ? entry.data.draft !== true : true;
}

export async function getPublishedPosts(): Promise<PostEntry[]> {
    return getCollection('posts', isPublished);
}

export async function getDefaultLocalePosts(): Promise<PostEntry[]> {
    return (await getPublishedPosts()).filter((post) => {
        const locale = getEntryLocale(post.id);
        return locale === undefined || locale === defaultLocale;
    });
}

export async function getNonDefaultLocalePosts(): Promise<PostEntry[]> {
    return (await getPublishedPosts()).filter((post) => {
        const locale = getEntryLocale(post.id);
        return locale !== undefined && locale !== defaultLocale;
    });
}

export async function getLocalizedPosts(langPath: string): Promise<PostEntry[]> {
    return (await getPublishedPosts()).filter((post) => {
        const locale = getEntryLocale(post.id);
        return locale !== undefined && locale !== defaultLocale && getPathByLocale(locale) === langPath;
    });
}

export function sortByDateDesc<T extends { data: { date: Date } }>(posts: T[]): T[] {
    return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function resolveAuthors(post: PostEntry): Promise<AuthorData[]> {
    const refs = Array.isArray(post.data.author) ? post.data.author : post.data.author ? [post.data.author] : [];
    if (refs.length === 0) return [siteConfig.defaultAuthor];
    const data = await Promise.all(refs.map((ref) => getEntry(ref).then((entry) => entry?.data)));
    return data.some((item) => item === undefined) ? [siteConfig.defaultAuthor] : (data as AuthorData[]);
}
