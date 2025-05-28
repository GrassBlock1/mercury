import { getCollection } from 'astro:content';

export async function getStaticPaths() {
    const authorsData = await getCollection('authors');
    return authorsData.map(author => ({
        params: { author: author.id },
        props: { author }
    }));
}

export async function GET({ props }) {
    const { author } = props;

    if (!author.data.mcplayerid) {
        return new Response(null, { status: 404 });
    }

    const username = author.data.mcplayerid;

    try {
        // get Minecraft profile by username
        const profileResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);

        if (!profileResponse.ok) {
            return new Response('Player not found', { status: 404 });
        }

        const profile = await profileResponse.json();
        const uuid = profile.id;

        // get skin data from session server
        const sessionResponse = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
        const sessionData = await sessionResponse.json();

        const texturesProperty = sessionData.properties.find((prop) => prop.name === 'textures');
        const texturesData = JSON.parse(atob(texturesProperty.value));
        const skinUrl = texturesData.textures.SKIN?.url;
        if (!skinUrl) {
            return new Response('Skin not found', { status: 404 });
        }

        // get skin image from the URL
        const skinResponse = await fetch(skinUrl);
        const skinBuffer = await skinResponse.arrayBuffer();

        // render the Minecraft head image
        const headImage = await renderMinecraftHead(new Uint8Array(skinBuffer));

        return new Response(headImage, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=3600', // 缓存1小时
            },
        });

    } catch (error) {
        console.error('Error fetching Minecraft head:', error);
        return new Response('Internal server error', { status: 500 });
    }
}

async function renderMinecraftHead(skinData) {
    // Use sharp library to process images
    const sharp = (await import('sharp')).default;

    // Load the skin image
    const skinImage = sharp(skinData);
    const metadata = await skinImage.metadata();
    const { width, height } = metadata;

    // Determine skin format (64x32 old format or 64x64 new format)
    const isNewFormat = height === 64;
    const headSize = 8; // Head is 8x8 pixels
    const scale = 8; // Scale factor, final output is 64x64

    // 3D-like effect: slightly offset hat layer
    // TODO: real 3D effect, which would require more complex rendering
    const offset = -1; // Negative value moves up/left (creates 3D effect)

    // Extract head base layer (8x8 pixels)
    const headBase = await skinImage
        .clone() // Clone to avoid modifying original
        .extract({ left: 8, top: 8, width: headSize, height: headSize })
        .png()
        .toBuffer();

    let finalHead = sharp(headBase).resize(headSize * scale, headSize * scale, {
        kernel: 'nearest' // Keep pixel art style
    });

    // If new format and has hat layer, composite hat layer
    if (isNewFormat) {
        try {
            // Check if we're in bounds before extracting hat layer
            if (width >= 48 && height >= 16) {
                // Extract hat layer (8x8 pixels)
                const hatLayer = await skinImage
                    .clone() // Clone to avoid modifying original
                    .extract({ left: 40, top: 8, width: headSize, height: headSize })
                    .png()
                    .toBuffer();

                // Resize hat layer
                const hatResized = await sharp(hatLayer)
                    .resize(headSize * scale, headSize * scale, { kernel: 'nearest' })
                    .png()
                    .toBuffer();

                // Composite base layer and hat layer with offset for 3D effect
                finalHead = finalHead.composite([{
                    input: hatResized,
                    left: offset * scale, // Apply scaled offset horizontally
                    top: offset * scale,  // Apply scaled offset vertically
                    blend: 'over'
                }]);
            }
        } catch (error) {
            // If hat layer processing fails, just use base layer
            console.warn('Failed to process hat layer:', error);
        }
    }

    const result = await finalHead.png().toBuffer();
    return new Uint8Array(result);
}