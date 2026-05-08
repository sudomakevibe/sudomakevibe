// src/plugins/remark-reading-time.mjs
// Counts prose words only — strips HTML, SVG, code blocks, and tables
// before calculating reading time to avoid inflation from markup.
import getReadingTime from "reading-time";
const READING_SPEED = { wordsPerMinute: 265 };

function extractText(node) {
  // Skip HTML blocks (includes inline SVG), code blocks, and tables
  if (["html", "code", "inlineCode", "table"].includes(node.type)) {
    return "";
  }
  // Recurse into children
  if (node.children) {
    return node.children.map(extractText).join(" ");
  }
  // Return text value for leaf nodes
  return node.value || "";
}

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = extractText(tree);
    const readingTime = getReadingTime(textOnPage, READING_SPEED);
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
