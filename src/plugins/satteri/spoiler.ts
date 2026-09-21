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
            if (!regex.test(value)) return;
            regex.lastIndex = 0;

            const children: MdastContent[] = [];
            let lastIndex = 0;
            let match: RegExpExecArray | null;

            while ((match = regex.exec(value)) !== null) {
                if (match.index > lastIndex) {
                    children.push({ type: "text", value: value.slice(lastIndex, match.index) });
                }
                children.push({
                    type: nodeType,
                    data: {
                        hName: tagType,
                        hProperties: classNames.length ? { className: classNames } : {},
                    },
                    children: [{ type: "text", value: match[1] }],
                });
                lastIndex = regex.lastIndex;
            }

            if (lastIndex < value.length) {
                children.push({ type: "text", value: value.slice(lastIndex) });
            }

            ctx.replaceNode(node, children);
        },
    });
}