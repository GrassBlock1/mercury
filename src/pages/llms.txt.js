import { getEmDashCollection } from "emdash";
import { getSiteBaseUrl } from "@/utils/feeds";
import { siteConfig } from "../config";

// Modified version that outputs markdown content
export async function GET(context) {
	const baseUrl = getSiteBaseUrl(context);
	const [posts, pages] = await Promise.all([
		getEmDashCollection("posts"),
		getEmDashCollection("pages"),
	]);
	if (posts.error || pages.error)
		return new Response("Unable to load content", { status: 500 });
	const markdownText = `# ${siteConfig.title}

> ${siteConfig.description}

${generateMarkdownSection(posts.entries, "Post", `${baseUrl}/blog`)}

${generateMarkdownSection(
	pages.entries.filter((entry) => entry.id !== "home"),
	"Page",
	baseUrl,
)}`;

	return new Response(markdownText);
}

function generateMarkdownSection(items, sectionTitle, baseUrl) {
	let markdown = `## ${sectionTitle}\n`;

	for (const item of items) {
		markdown += `\n- [${item.data.title}](${baseUrl}/${item.id}): ${item.data.excerpt || ""}`;
	}

	return markdown;
}
