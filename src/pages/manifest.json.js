import { getImage } from 'astro:assets'
import favicon from '../assets/favicon.png'
import { siteConfig } from "../config.js";
// thanks to https://kremalicious.com/favicon-generation-with-astro
const faviconPngSizes = [192, 512]

export const GET = async () => {
    if (!siteConfig.pwa) {
        return new Response(null, { status: 404 })
    }
    const icons = await Promise.all(
        faviconPngSizes.map(async (size) => {
            const image = await getImage({
                src: favicon,
                width: size,
                height: size,
                format: 'png'
            })
            return {
                src: image.src,
                type: `image/${image.options.format}`,
                sizes: `${image.options.width}x${image.options.height}`
            }
        })
    )

    const manifest = {
        name: siteConfig.title,
        description: siteConfig.description,
        start_url: '/',
        display: 'standalone',
        id: 'deadbeef-d7d8-4d48-8a7a-593be33d9f77',
        icons
    }

    return new Response(JSON.stringify(manifest))
}