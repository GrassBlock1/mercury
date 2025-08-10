import {execSync} from "child_process";
import {statSync} from "node:fs";

export function remarkModifiedTime() {
    return function (tree, file) {
        const filepath = file.history[0];
        file.data.astro.frontmatter.lastModified = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`).toString() || statSync(filepath).mtime.toISOString();
    };
}