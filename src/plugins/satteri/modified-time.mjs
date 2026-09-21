import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineMdastPlugin } from "satteri";

export const mdastModifiedTimePlugin = defineMdastPlugin({
    name: "mdast-modified-time",
    before(root, context) {
        if (!context.fileURL) return;

        const filepath = fileURLToPath(context.fileURL);
        let result;
        try {
            result = execFileSync('git', ["log", "-1", "--pretty=format:%cI", "--", filepath], { stdio: ['ignore','pipe','ignore'] }).toString().trim();
        } catch (e) {
            console.warn("unable to get data from git", e)
        }
        if (!result) {
            try {
                result = statSync(filepath).mtime.toISOString();
            } catch (e) {
                result = undefined;
            }
        }

        if (context.data.astro !== undefined) {
            context.data.astro.frontmatter.lastModified = result;
        }
    },
});
