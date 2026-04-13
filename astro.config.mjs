import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

export default defineConfig({
  site: "https://sudomakevibe.com",
  integrations: [mdx(), tailwind(), sitemap()],
  trailingSlash: "ignore",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    server: {
      proxy: {
        "/api": "http://localhost:4321",
      },
    },
  },
});
