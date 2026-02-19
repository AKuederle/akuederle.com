import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.string().optional(),
  permalink: z.string(),
  description: z.string().optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: postSchema,
});

const quicktips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quicktips' }),
  schema: postSchema,
});

export const collections = { posts, quicktips };
