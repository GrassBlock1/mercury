import { getCollection } from 'astro:content';
import { getImage } from "astro:assets";
import { createFileCache } from '@/plugins/file-cache';

const MC_CACHE_TIME = 7 * 24 * 60 * 60; // 7 days in seconds for HTTP caching
const AVATAR_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const avatarCache = createFileCache({
    dir: 'node_modules/.astro/avatar-cache',
    extension: '.png',
    ttlMs: AVATAR_CACHE_TTL,
    memoryLimit: 50,
    memoryTtlMs: AVATAR_CACHE_TTL,
});

function imageResponse(data) {
    return new Response(data, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': `public, max-age=${MC_CACHE_TIME}`
        }
    });
}

export async function getStaticPaths() {
    const authorsData = await getCollection('authors');
    return authorsData
        .filter(author => author.data.mcplayerid) // Only include authors with mcplayerid
        .map(author => ({
            params: { author: author.data.mcplayerid },
            props: { author }
        }));
}

export async function GET({ props }) {
    const { author } = props;
    const authorId = author.id;

    if (author.data.avatar) {
        // Try to retrieve from cache first
        const cacheKey = `avatar-${authorId}`;
        const cachedAvatar = await avatarCache.get(cacheKey);

        if (cachedAvatar) {
            return imageResponse(cachedAvatar.data);
        }

        try {
            const optimizedImage = await getImage({
                src: author.data.avatar,
                width: 64,
                height: 64,
                format: 'png'
            });

            // Fetch the optimized image
            const optimizedResponse = await fetch(optimizedImage.src);
            if (!optimizedResponse.ok) {
                throw new Error('Failed to fetch optimized image');
            }

            const imageBuffer = await optimizedResponse.arrayBuffer();
            const bufferData = new Uint8Array(imageBuffer);

            // Cache the avatar for future requests
            await avatarCache.set(cacheKey, bufferData);

            return imageResponse(bufferData);
        } catch (error) {
            console.error('Error processing avatar image:', error);
            // Fall through to the mcplayerid check if avatar processing fails
        }
    }

    if (!author.data.mcplayerid) {
        return new Response(null, { status: 404 });
    }

    const username = author.data.mcplayerid;
    const cacheKey = `mc-${username}`;

    // Check cache for Minecraft avatar
    const cachedMcAvatar = await avatarCache.get(cacheKey);
    if (cachedMcAvatar) {
        return imageResponse(cachedMcAvatar.data);
    }

    try {
        // Get Minecraft profile by username
        const profileResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        if (!profileResponse.ok) {
            return new Response('Player not found', { status: 404 });
        }

        const profile = await profileResponse.json();
        const uuid = profile.id;

        // Get skin data from session server
        const sessionResponse = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);

        if (!sessionResponse.ok) {
            return new Response('Session data not found', { status: 404 });
        }

        const sessionData = await sessionResponse.json();
        const texturesProperty = sessionData.properties.find((prop) => prop.name === 'textures');

        if (!texturesProperty) {
            return new Response('Textures not found', { status: 404 });
        }

        const texturesData = JSON.parse(atob(texturesProperty.value));
        const skinUrl = texturesData.textures.SKIN?.url;

        if (!skinUrl) {
            return new Response('Skin not found', { status: 404 });
        }

        // Get skin image from the URL
        const skinResponse = await fetch(skinUrl);
        const skinBuffer = await skinResponse.arrayBuffer();

        // Render the Minecraft head image
        const headImage = await renderMinecraftHead(new Uint8Array(skinBuffer));

        // Cache the rendered head
        await avatarCache.set(cacheKey, headImage);

        return imageResponse(headImage);
    } catch (error) {
        console.error('Error fetching Minecraft head:', error);
        return new Response('Internal server error', { status: 500 });
    }
}

async function renderMinecraftHead(skinData) {
    // Use sharp library to process images
    const sharp = (await import('sharp')).default;

    // Load the skin image once and get metadata
    const skinImage = sharp(skinData);
    const metadata = await skinImage.metadata();
    const { width, height } = metadata;

    // Determine skin format (64x32 old format or 64x64 new format)
    const isNewFormat = height === 64;
    const headSize = 8; // Head is 8x8 pixels
    const scale = 8; // Scale factor, final output is 64x64
    const offset = -1; // 3D-like effect offset

    // Extract head base layer and prepare for compositing if needed
    let extractionPromises = [
        // Head base layer extraction promise
        await skinImage
            .clone()
            .extract({left: 8, top: 8, width: headSize, height: headSize})
            .png()
            .toBuffer()
    ];

    // If new format, also extract hat layer in parallel
    if (isNewFormat && width >= 48 && height >= 16) {
        extractionPromises.push(
            skinImage
                .clone()
                .extract({ left: 40, top: 8, width: headSize, height: headSize })
                .png()
                .toBuffer()
        );
    }

    // Wait for all extractions to complete in parallel
    const [headBase, hatLayer] = await Promise.all(extractionPromises);

    // Start with base layer
    let finalHead = sharp(headBase).resize(headSize * scale, headSize * scale, {
        kernel: 'nearest', // Keep pixel art style
        fastShrinkOnLoad: true // Performance optimization
    });

    // If we have a hat layer, composite it
    if (hatLayer) {
        try {
            const hatResized = await sharp(hatLayer)
                .resize(headSize * scale, headSize * scale, {
                    kernel: 'nearest',
                    fastShrinkOnLoad: true
                })
                .png({ compressionLevel: 9, adaptiveFiltering: true })
                .toBuffer();

            finalHead = finalHead.composite([{
                input: hatResized,
                left: offset * scale,
                top: offset * scale,
                blend: 'over'
            }]);
        } catch (error) {
            console.warn('Failed to process hat layer:', error);
        }
    }

    // Optimize PNG compression
    const result = await finalHead.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        force: true
    }).toBuffer();

    return new Uint8Array(result);
}
