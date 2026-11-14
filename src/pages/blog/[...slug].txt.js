import { decodeSlug, getEmDashEntry } from "emdash";
import { portableTextToMarkdown } from "emdash/client";

export async function GET({ params }) {
	const slug = decodeSlug(params.slug ?? "");
	if (!slug) return new Response("Not found", { status: 404 });
	const { entry, error } = await getEmDashEntry("posts", slug);
	if (error) return new Response("Unable to load post", { status: 500 });
	if (!entry) return new Response("Not found", { status: 404 });
	// Format the content as plain text
	const title = entry.data.title;
	const date = new Date(
		entry.data.original_date ?? entry.data.publishedAt ?? entry.data.createdAt,
	)
		.toISOString()
		.split("T")[0];
	const content = portableTextToMarkdown(entry.data.content ?? []);

	// Combine the post info and body into a single text file
	const textContent = `Title: ${title}\nPublished at: ${date}\n\n${content}`;

	return new Response(textContent, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
