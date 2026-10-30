import { defineMdastPlugin, type MdastContent } from "satteri";

type SpoilerOptions = {
	nodeType?: string;
	marker?: string;
	classNames?: string[];
	tagType?: string;
};

export function mdastSpoilerPlugin(options: SpoilerOptions = {}) {
	const nodeType = options.nodeType ?? "spoiler";
	const marker = options.marker ?? "||";
	const classNames = options.classNames ?? ["spoiler"];
	const tagType = options.tagType ?? "span";

	return defineMdastPlugin({
		name: "spoiler",
		text(node, ctx) {
			const value = node.value;
			if (!value || typeof value !== "string") return;

			const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			const regex = new RegExp(`${escapedMarker}(.*?)${escapedMarker}`, "g");
			const matches = [...value.matchAll(regex)];
			if (matches.length === 0) return;

			const children: MdastContent[] = [];
			let lastIndex = 0;

			for (const match of matches) {
				if (match.index > lastIndex) {
					children.push({
						type: "text",
						value: value.slice(lastIndex, match.index),
					});
				}
				children.push({
					type: nodeType,
					data: {
						hName: tagType,
						hProperties: classNames.length ? { className: classNames } : {},
					},
					children: [{ type: "text", value: match[1] }],
				});
				lastIndex = match.index + match[0].length;
			}

			if (lastIndex < value.length) {
				children.push({ type: "text", value: value.slice(lastIndex) });
			}

			ctx.replaceNode(node, children);
		},
	});
}
