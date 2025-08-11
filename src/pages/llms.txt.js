import { getCollection } from "astro:content";
import { siteConfig } from "../config";

// Modified version that outputs markdown content
export async function GET(context) {
  let baseUrl = context.site?.href || "https://terminal-blog.example.com";
  if (baseUrl.at(-1) === "/") baseUrl = baseUrl.slice(0, -1);
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
    const { title, description, slug } = getMetaData(item);
    markdown += `\n- [${title}](${baseUrl}/blog/${slug}): ${description}`;
  }

  return markdown;
}

function getMetaData(collection) {
  const { title, description } = collection.data;
  const { slug } = collection;
  return { title, description, slug };
}
