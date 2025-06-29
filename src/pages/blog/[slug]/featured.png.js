import { getCollection } from 'astro:content';
import sharp from 'sharp';
import {getImage} from "astro:assets";
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Ensure cache directory exists
const CACHE_DIR = 'node_modules/.astro/og-cache';

// Cache for external images to avoid repeated processing
const externalImageCache = new Map();
// Cache for generated OG images (memory cache)
const ogImageCache = new Map();

// Initialize cache directory
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
}

// Create hash for consistent filenames
function createHash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// File-based cache operations
const fileCache = {
  async get(key) {
    try {
      const filePath = path.join(CACHE_DIR, `${createHash(key)}.webp`);
      const stats = await fs.stat(filePath);

      // Check if file exists and is not too old (30 days)
      const now = new Date();
      const fileAge = (now - stats.mtime) / (1000 * 60 * 60 * 24);

      if (fileAge > 30) {
        return null; // File is too old
      }

      return await fs.readFile(filePath);
    } catch (error) {
      return null; // File doesn't exist or can't be read
    }
  },

  async set(key, data) {
    try {
      await ensureCacheDir();
      const filePath = path.join(CACHE_DIR, `${createHash(key)}.webp`);
      await fs.writeFile(filePath, data);
      return true;
    } catch (error) {
      console.error('Error writing to file cache:', error);
      return false;
    }
  }
};

export async function getStaticPaths() {
  const blogEntries = await getCollection('posts');
  return blogEntries.map(post => ({
    params: { slug: post.slug }, props: { post },
  }));
}

// get the post has a external featured.* image files
async function getExternalImage(post) {
  // Check cache first
  if (externalImageCache.has(post.slug)) {
    return externalImageCache.get(post.slug);
  }

  const featuredImages = import.meta.glob(`/src/content/posts/*/featured.{avif,png,jpg,jpeg,webp}`, {import: 'default', eager: true});
  const matchedImage = Object.keys(featuredImages).find(path => path.includes(post.slug));
  let matchedImage_;
  if (matchedImage) {
    matchedImage_ = await getImage({src: featuredImages[matchedImage], format: 'webp'}) || null;
  }

  // Store in cache
  const result = matchedImage_?.src;
  externalImageCache.set(post.slug, result);
  return result;
}

// Function to check for images in markdown without rendering
function checkForImages(markdownContent) {
  // Match markdown image syntax ![alt](url) or HTML <img> tags
  const imageRegex = /!\[.*?]\(.*?\)|<img.*?src=["'].*?["'].*?>/g;
  return imageRegex.test(markdownContent);
}

// This function dynamically generates og:images for posts that don't have a featured image
export async function GET({ props }) {
  const {post} = props;

  // Generate consistent cache key
  const cacheKey = `${post.slug}-${post.id}`;

  // Check in-memory cache first (fastest)
  if (ogImageCache.has(cacheKey)) {
    return new Response(ogImageCache.get(cacheKey), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${cacheKey}"`
      }
    });
  }

  // Then check file cache (persists between server restarts)
  const cachedFile = await fileCache.get(cacheKey);
  if (cachedFile) {
    // Store in memory cache for faster subsequent access
    ogImageCache.set(cacheKey, cachedFile);

    return new Response(cachedFile, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${cacheKey}"`,
        'X-Cache': 'HIT-FILE'
      }
    });
  }

  try {
    // Short-circuit early if we know we won't generate an image
    if (post.data.cover) {
      return new Response(null);
    }

    // Only fetch external image if needed
    const ExternalImageURL = await getExternalImage(post);
    if (ExternalImageURL) {
      return new Response(null);
    }

    // Only check for images if needed
    const hasImage = checkForImages(post.body);
    if (hasImage) {
      return new Response(null);
    }

    // Generate an image with post title and description
    const width = 1280;
    const height = 720;

    // Sanitize text for SVG
    const sanitizeText = (text) => {
      return text
        ? text.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
        : '';
    };

    const title = sanitizeText(post.data.title);
    const description = sanitizeText(post.data.description);

    // Create a simple image with text - optimized SVG
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#2e3440"/><text x="50%" y="40%" font-family="JetBrains Mono, monospace" font-size="50" text-anchor="middle" fill="#eceff4">${title}</text><text x="50%" y="60%" font-family="JetBrains Mono, monospace" font-size="30" text-anchor="middle" fill="#81a1c1">${description}</text></svg>`;

    // Convert SVG to WebP with optimized settings
    const buffer = await sharp(Buffer.from(svg))
      .webp({ quality: 80, lossless: false })
      .toBuffer();

    // Store in both memory and file caches
    ogImageCache.set(cacheKey, buffer);
    await fileCache.set(cacheKey, buffer);

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

