import type { InferCollectionData } from "emdash";

export function toArticleListPosts(
	entries: { id: string; data: InferCollectionData<"posts"> }[],
) {
	return entries
		.map((entry) => ({
			id: entry.id,
			data: {
				title: entry.data.title,
				date: new Date(
					entry.data.original_date ??
						entry.data.publishedAt ??
						entry.data.createdAt,
				),
			},
		}))
		.sort(
			(left, right) => right.data.date.getTime() - left.data.date.getTime(),
		);
}
