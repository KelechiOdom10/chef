import type { Site, Metadata } from "@types";

export const SITE: Site = {
  NAME: "Kelechi Odom",
  EMAIL: "kelechiodom10@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Kelechi Odom is a senior full-stack product engineer in London who ships AI features for customers.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "What I built at Humaans, Unlikely AI, Robin AI, bp, and Cellulant.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "Personal projects and selected client work by Kelechi Odom.",
};

export const SOCIALS = [
  {
    NAME: "github",
    HREF: "https://github.com/KelechiOdom10",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/kelechi-odom-065308157/",
  },
] as const;
