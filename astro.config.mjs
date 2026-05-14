import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
export default defineConfig({
  site: "https://sudomakevibe.com",
  integrations: [mdx(), sitemap()],
  trailingSlash: "ignore",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "css-variables",
      defaultLang: "bash",
      wrap: true,
    },
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    css: {
      postcss: "./postcss.config.mjs",
    },
    server: {
      proxy: {
        "/api": "http://localhost:4321",
      },
    },
  },
});
