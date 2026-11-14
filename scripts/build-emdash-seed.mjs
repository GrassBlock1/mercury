import {
	copyFile,
	mkdir,
	readdir,
	readFile,
	writeFile,
} from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { markdownToPortableText } from "emdash/client";
import matter from "gray-matter";

const root = new URL("../", import.meta.url).pathname;
const contentRoot = join(root, "src/content");

async function contentFiles(directory) {
	const files = [];
	for (const item of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, item.name);
		if (item.isDirectory()) files.push(...(await contentFiles(path)));
		else if (/\.(md|mdx)$/.test(item.name)) files.push(path);
	}
	return files;
}

function cleanMdx(body) {
	return body.replace(/^\s*(?:import [^\n]*\n)+/, "");
}

const posts = [];
const pages = [];
const terms = { category: new Set(), tag: new Set() };
for (const file of await contentFiles(contentRoot)) {
	const path = relative(contentRoot, file).replaceAll("\\", "/");
	if (!path.startsWith("posts/") && !path.startsWith("pages/")) continue;
	const { data, content } = matter(await readFile(file, "utf8"));
	const collection = path.startsWith("posts/") ? "posts" : "pages";
	const slug = path
		.replace(/^(posts|pages)\//, "")
		.replace(/\/index\.(md|mdx)$/, "")
		.replace(/\.(md|mdx)$/, "");
	const blocks = markdownToPortableText(cleanMdx(content));
	for (const block of blocks) {
		if (
			block._type !== "image" ||
			!block.asset?.url ||
			/^https?:\/\//.test(block.asset.url)
		)
			continue;
		const filename = `${slug.replaceAll("/", "-")}-${block.asset.url.split("/").at(-1)}`;
		const assetPath = join("assets", filename);
		await mkdir(join(root, "seed/assets"), { recursive: true });
		await copyFile(
			join(dirname(file), block.asset.url),
			join(root, "seed", assetPath),
		);
		block.asset = { $media: { file: assetPath, alt: block.alt ?? "" } };
	}
	const categories = [data.categories ?? []].flat().filter(Boolean);
	const tags = [data.tags ?? []].flat().filter(Boolean);
	for (const category of categories) terms.category.add(category);
	for (const tag of tags) terms.tag.add(tag);
	const entry = {
		id: `${collection}-${slug.replaceAll("/", "-")}`,
		slug,
		status: data.draft ? "draft" : "published",
		data: {
			title: data.title ?? slug,
			content: blocks,
			...(data.description ? { excerpt: data.description } : {}),
			...(data.summary ? { summary: data.summary } : {}),
			...(data.date
				? { original_date: new Date(data.date).toISOString() }
				: {}),
			...(data.updated
				? { original_updated: new Date(data.updated).toISOString() }
				: {}),
		},
	};
	if (collection === "posts") {
		entry.taxonomies = { category: categories, tag: tags };
		if (slug === "terminal-setup") {
			await copyFile(
				join(dirname(file), "cover.jpg"),
				join(root, "seed/assets/terminal-setup-cover.jpg"),
			);
			entry.data.featured_image = {
				$media: {
					file: "assets/terminal-setup-cover.jpg",
					alt: "My Terminal Setup",
				},
			};
		}
	}
	if (collection === "posts") posts.push(entry);
	else pages.push(entry);
}

pages.push({
	id: "page-home",
	slug: "home",
	status: "published",
	data: {
		title: "Home",
		content: markdownToPortableText(
			await readFile(join(contentRoot, "index.md"), "utf8"),
		),
	},
});

const seed = {
	$schema: "https://emdashcms.com/seed.schema.json",
	version: "1",
	defaultLocale: "en",
	meta: { name: "Mercury", description: "Existing Mercury content" },
	collections: [
		{
			slug: "posts",
			label: "Posts",
			labelSingular: "Post",
			urlPattern: "/blog/{slug}",
			supports: ["drafts", "revisions", "search", "seo", "preview"],
			dateField: "original_date",
			titleField: "title",
			fields: [
				{
					slug: "title",
					label: "Title",
					type: "string",
					required: true,
					searchable: true,
				},
				{
					slug: "content",
					label: "Content",
					type: "portableText",
					searchable: true,
				},
				{ slug: "featured_image", label: "Featured image", type: "image" },
				{ slug: "excerpt", label: "Description", type: "text" },
				{ slug: "summary", label: "Summary", type: "text" },
				{
					slug: "original_date",
					label: "Original date",
					type: "datetime",
					indexed: true,
				},
				{
					slug: "original_updated",
					label: "Original update date",
					type: "datetime",
				},
			],
		},
		{
			slug: "pages",
			label: "Pages",
			labelSingular: "Page",
			urlPattern: "/{slug}",
			supports: ["drafts", "revisions", "search", "seo", "preview"],
			titleField: "title",
			fields: [
				{
					slug: "title",
					label: "Title",
					type: "string",
					required: true,
					searchable: true,
				},
				{
					slug: "content",
					label: "Content",
					type: "portableText",
					searchable: true,
				},
				{ slug: "excerpt", label: "Description", type: "text" },
			],
		},
	],
	taxonomies: [
		{
			name: "category",
			label: "Categories",
			labelSingular: "Category",
			hierarchical: true,
			collections: ["posts"],
			terms: [...terms.category].map((slug) => ({ slug, label: slug })),
		},
		{
			name: "tag",
			label: "Tags",
			labelSingular: "Tag",
			hierarchical: false,
			collections: ["posts"],
			terms: [...terms.tag].map((slug) => ({ slug, label: slug })),
		},
	],
	content: { posts, pages },
};

const output = join(root, "seed/seed.json");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Generated ${posts.length} posts and ${pages.length} pages`);
