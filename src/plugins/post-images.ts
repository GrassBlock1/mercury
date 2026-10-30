import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { getPostSlug } from '@/i18n/utils';
import type { PostEntry } from '@/utils/posts';
import { ExtractFirstImage } from './extract-images';

const featuredImages = import.meta.glob<ImageMetadata>(
    '/src/content/posts/**/featured.{avif,png,jpg,jpeg,webp}',
    { import: 'default', eager: true },
);

export async function getFeaturedImageSrc(entry: PostEntry): Promise<string | undefined> {
    const matchedPath = Object.keys(featuredImages).find((path) => path.includes(`/${entry.id}/`));
    if (!matchedPath) return undefined;
    const optimized = await getImage({ src: featuredImages[matchedPath], format: 'webp' });
    return optimized.src;
}

// the cover of a post: the front matter image, else the featured.* file next to it, else the
// first image of the body, else the generated OG image endpoint
export async function resolvePostCover(entry: PostEntry, Content?: unknown) {
    const customCover = entry.data.cover;
    const optimizedCover = !customCover
        ? null
        : typeof customCover === 'string'
            ? customCover
            : 'src' in customCover && customCover.src.startsWith('http')
                ? customCover
                : await getImage({ src: customCover, width: 1080, format: 'webp' });

    const featuredImageSrc = customCover ? undefined : await getFeaturedImageSrc(entry);
    const firstImage = Content ? await ExtractFirstImage(Content) : undefined;

    return {
        headerImage: customCover || featuredImageSrc || '',
        cover: optimizedCover || featuredImageSrc || firstImage || `${getPostSlug(entry.id)}/featured.png`,
    };
}
