import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    // Populated by remark-reading-time plugin at build time.
    // Add to package.json devDependencies: "remark-reading-time": "^2.0.0"
    // and register in astro.config.mjs: markdown: { remarkPlugins: [remarkReadingTime] }
    readingTime: z.string().optional(),
  }),
});

export const collections = { posts };
