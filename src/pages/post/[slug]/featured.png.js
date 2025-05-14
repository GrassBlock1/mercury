import { getCollection } from 'astro:content';
import sharp from 'sharp';
import {getImage} from "astro:assets";

export async function getStaticPaths() {
  const blogEntries = await getCollection('posts');
  return blogEntries.map(post => ({
    params: { slug: post.slug }, props: { post },
  }));
}

// get the post has a external featured.* image files
async function getExternalImage(post) {
  const featuredImages = import.meta.glob(`/src/content/posts/*/featured.*`, {import: 'default', eager: true});
  const matchedImage = Object.keys(featuredImages).find(path => path.includes(post.slug));
  let matchedImage_src;
  if (matchedImage) {
    matchedImage_src = await getImage({src: featuredImages[matchedImage], format: 'webp'}) || null;
  }
  return matchedImage_src;
}

// This function dynamically generates og:images for posts that don't have a featured image
export async function GET({ props }) {
  const {post} = props;
  try {
    // Check if a custom cover image already exists
    if (post.data.cover && await getExternalImage(post)) {
      // Redirect to the existing image
      return new Response(null);
    }

    // Generate an image with post title and description
    const width = 1280;
    const height = 720;

    // Create a simple image with text
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#2e3440"/>
        <text x="50%" y="40%" font-family="JetBrains Mono, monospace" font-size="50" text-anchor="middle" fill="#eceff4">${post.data.title}</text>
        <text x="50%" y="60%" font-family="JetBrains Mono, monospace" font-size="30" text-anchor="middle" fill="#81a1c1">${post.data.description}</text>
      </svg>
    `;

    // Convert SVG to WebP
    const buffer = await sharp(Buffer.from(svg))
      .toFormat('webp')
      .toBuffer();

    // Return the image
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}