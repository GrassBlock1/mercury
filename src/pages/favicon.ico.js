import sharp from 'sharp'
import ico from 'ico-endec'
import path from 'node:path'

// relative to project root
const faviconSrc = path.resolve('src/assets/favicon.svg')

export const GET = async () => {
    // resize to 32px PNG
    const buffer = await sharp(faviconSrc).resize(32).toFormat('png').toBuffer()
    // generate ico
    const icoBuffer = ico.encode([buffer])

    return new Response(icoBuffer, {
        headers: { 'Content-Type': 'image/x-icon' }
    })
}
