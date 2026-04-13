// src/plugins/remark-reading-time.mjs
// Install the dependency first:
//   npm install remark-reading-time --save-dev
//
// Then register in astro.config.mjs:
//   import remarkReadingTime from "./src/plugins/remark-reading-time.mjs";
//   markdown: { remarkPlugins: [remarkReadingTime] }
//
// Reading time is then available in post.data.readingTime as a string like "4 min read".

import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // Rounds to nearest minute, e.g. "4 min read"
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
