import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    thumbnail: z.string().optional(),
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
    website: z.string().optional(),
    description: z.string().optional(),
    logo: z
      .object({
        light: z.string(),
        dark: z.string(),
      })
      .optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().optional(),
      demoURL: z.string().optional(),
      repoURL: z.string().optional(),
      thumbnail: image().optional(),
      tags: z.array(z.string()).optional(),
      technologies: z.array(z.string()).optional(),
    }),
});

export const collections = { blog, work, projects };
