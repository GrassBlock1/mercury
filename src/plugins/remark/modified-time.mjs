import { execSync } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineMdastPlugin } from "satteri";

export const mdastModifiedTimePlugin = defineMdastPlugin({
    name: "mdast-modified-time",
    before(root, context) {
        if (!context.fileURL) return;

        const filepath = fileURLToPath(context.fileURL);
        const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`).toString() || statSync(filepath).mtime.toISOString();

        if (context.data.astro !== undefined) {
            context.data.astro.frontmatter.lastModified = result;
        }
    },
});
