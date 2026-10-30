import sharp from 'sharp';
import { createFileCache } from '@/plugins/file-cache';
import { getFeaturedImageSrc } from '@/plugins/post-images';
import type { PostEntry } from '@/utils/posts';

// Generated OG images are cached in memory and on disk for 30 days
const ogImageCache = createFileCache({
  dir: 'node_modules/.astro/og-cache',
  extension: '.webp',
  ttlMs: 30 * 24 * 60 * 60 * 1000,
  memoryLimit: Infinity,
});

// Function to check for images in markdown without rendering
function checkForImages(markdownContent) {
  // Match markdown image syntax ![alt](url) or HTML <img> tags
  const imageRegex = /!\[.*?]\(.*?\)|<img.*?src=["'].*?["'].*?>/g;
  return imageRegex.test(markdownContent);
}

// Sanitize text for SVG
function sanitizeText(text) {
  return text
    ? text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    : '';
}

// This function dynamically generates og:images for posts that don't have a featured image
export async function renderOgImage(post: PostEntry): Promise<Response> {
  // Generate consistent cache key
  const cacheKey = post.id;

  // Memory cache first, then the file cache that persists between builds/restarts
  const cached = await ogImageCache.get(cacheKey);
  if (cached) {
    return new Response(cached.data, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${cacheKey}"`,
        ...(cached.source === 'file' ? { 'X-Cache': 'HIT-FILE' } : {}),
      }
    });
  }

  try {
    // Short-circuit early if we know we won't generate an image
    if (post.data.cover || (await getFeaturedImageSrc(post)) || checkForImages(post.body ?? '')) {
      return new Response(null);
    }

    // Generate an image with post title and description
    const width = 1280;
    const height = 720;

    const title = sanitizeText(post.data.title);
    const description = sanitizeText(post.data.description);

    // Create a simple image with text - optimized SVG
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#2e3440"/><text x="50%" y="40%" font-family="JetBrains Mono, monospace" font-size="50" text-anchor="middle" fill="#eceff4">${title}</text><text x="50%" y="60%" font-family="JetBrains Mono, monospace" font-size="30" text-anchor="middle" fill="#81a1c1">${description}</text></svg>`;

    // Convert SVG to WebP with optimized settings
    const buffer = await sharp(Buffer.from(svg))
      .webp({ quality: 80, lossless: false })
      .toBuffer();

    // Store in both memory and file caches
    await ogImageCache.set(cacheKey, buffer);

    // Return the image with proper caching headers
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${cacheKey}"`,
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
