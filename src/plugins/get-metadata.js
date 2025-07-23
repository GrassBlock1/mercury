import { parse } from "ultrahtml";
import "ultrahtml/selector";
import {querySelector} from "ultrahtml/selector";

// Simple in-memory cache
const metadataCache = new Map();

export async function getMetadata(url) {
    if (metadataCache.has(url)) {
        const cached = metadataCache.get(url);
        return cached.data;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkCard/1.1)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
            }
        });

        if (!response.ok) {
            throw new Error(`Request not succeed: HTTP ${response.status}`);
        }

        const html = await response.text();

        const document = parse(html);

        const metadata = {
            title: '',
            description: '',
            image: '',
            siteName: '',
            domain: new URL(url).hostname
        };

        // Extract title
        const titleElement = querySelector(document,'title');

        if (titleElement) {
            metadata.title = titleElement.children[0].value.trim();
        }
        // Extract other metadata
        const descriptionElement = querySelector(document, 'meta[name="description"]');
        if (descriptionElement) {
            metadata.description = descriptionElement.attributes.content || '';
        }
        const imageElement = querySelector(document,'meta[property="og:image"]') || querySelector(document,'meta[name="twitter:image"]');
        if (imageElement) {
            metadata.image = imageElement.attributes.content || '';
        }
        const siteNameElement = querySelector(document,'meta[property="og:site_name"]')
        if (siteNameElement) {
            metadata.siteName = siteNameElement.attributes.content || '';
        } else {
            metadata.siteName = metadata.domain; // Fallback to domain if no site name found
        }

        // Store in cache
        metadataCache.set(url, {
            data: metadata
        });

        return metadata;
    } catch (error) {
        console.warn(`Failed to fetch metadata for ${url}:`, error);
        const domain = new URL(url).hostname;
        return {
            title: domain,
            description: '',
            image: '',
            siteName: domain,
            domain
        };
    }
}

export async function getWaybackMetadata(url, timestamp){
    try {
        const archiveUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${timestamp}`;

        if (metadataCache.has(archiveUrl)) {
            const cached = metadataCache.get(archiveUrl);
            return cached.data;
        }

        const response = await fetch(archiveUrl);
        const data = await response.json();

        if (data.archived_snapshots?.closest?.available) {
            // Store in cache
            metadataCache.set(archiveUrl, {
                data: data.archived_snapshots.closest.url
            });

            return data.archived_snapshots.closest.url;
        }
    } catch (error) {
        console.warn(`Failed to check archive for ${url}:`, error);
    }
    return null;
}