import {toString} from 'mdast-util-to-string';
import countWords from 'reading-time'

export function remarkWordCount() {
    return function (tree, { data }) {
        const textOnPage = toString(tree);
        data.astro.frontmatter.wordcount = countWords(textOnPage);
    };
}