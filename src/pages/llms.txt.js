import { getCollection } from "astro:content";
import { siteConfig } from "../config";
import { getPageSlug, getPostSlug } from "@/i18n/utils";
import { getSiteBaseUrl } from "@/utils/feeds";

// Modified version that outputs markdown content
export async function GET(context) {
  const baseUrl = getSiteBaseUrl(context);
  const markdownText = `# ${siteConfig.title}

> ${siteConfig.description}

${await generateMarkdownSection("posts", "Post", baseUrl)}

${await generateMarkdownSection("pages", "Page", baseUrl)}`;

  return new Response(markdownText);
}

async function generateMarkdownSection(collectionName, sectionTitle, baseUrl) {
  const items = await getCollection(collectionName);

  // Sort posts by date if available
  const sortedItems =
    collectionName === "posts"
      ? items.sort((a, b) => (a.data.date > b.data.date ? -1 : 1))
      : items;

  let markdown = `## ${sectionTitle}\n`;

  for (const item of sortedItems) {
    const url =
      collectionName === "posts"
        ? `${baseUrl}${getPostSlug(item.id)}`
        : `${baseUrl}/${getPageSlug(item.id)}`;
    markdown += `\n- [${item.data.title}](${url}): ${item.data.description || ''}`;
  }

  return markdown;
}
