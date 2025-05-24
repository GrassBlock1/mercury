import {loadRenderers} from "astro:container";
import {getContainerRenderer as getMDXRenderer} from "@astrojs/mdx";
import {experimental_AstroContainer as AstroContainer} from "astro/container";
import {transform, walk} from "ultrahtml";

export async function ExtractFirstImage(Content, baseUrl = '') {
    // Load MDX renderer. Other renderers for UI frameworks (e.g. React, Vue, etc.) would need adding here if you were using those.
    const renderers = await loadRenderers([getMDXRenderer()]);

    // Create a new Astro container that we can render components with.
    // See https://docs.astro.build/en/reference/container-reference/
    const container = await AstroContainer.create({renderers});

    // Use the Astro container to render the content to a string.
    const rawContent = await container.renderToString(Content);

    let firstImageUrl = null;

    // The transform function returns a promise, so we need to await it
    await transform(rawContent.replace(/^<!DOCTYPE html>/, ''), [
        async (node) => {
            await walk(node, (node) => {
                if (node.name === "img" && node.attributes.src) {
                    // Store the first image URL we find
                    if (!firstImageUrl) {
                        firstImageUrl = node.attributes.src.startsWith("/")
                            ? baseUrl + node.attributes.src
                            : node.attributes.src;
                    }
                    // Still update the src attribute if needed
                    if (node.attributes.src.startsWith("/")) {
                        node.attributes.src = baseUrl + node.attributes.src;
                    }
                }
            });
            return node;
        }
    ]);

    // Return the URL value, not a Promise
    return firstImageUrl;
}