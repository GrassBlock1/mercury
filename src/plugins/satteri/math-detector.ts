import { defineMdastPlugin } from "satteri";

export const mdastDetectMathPlugin = defineMdastPlugin({
	name: "mdast-has-math",
	math(_node, context) {
		if (context.data.astro !== undefined)
			context.data.astro.frontmatter.hasMath = true;
	},
	inlineMath(_node, context) {
		if (context.data.astro !== undefined)
			context.data.astro.frontmatter.hasMath = true;
	},
});
