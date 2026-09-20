import countWords from "reading-time";
import { defineMdastPlugin } from "satteri";

export const mdastReadingTimePlugin = defineMdastPlugin({
    name: "mdast-reading-time",
    after(root, context) {
        const textOnPage = context.textContent(root);
        const words = countWords(textOnPage);

        if (context.data.astro !== undefined) {
            context.data.astro.frontmatter.wordcount = words.text;
        }
    },
});