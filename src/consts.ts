import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Kelechi Odom",
  EMAIL: "kelechiodom10@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 4,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Developer, footballer, and anime enthusiast.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/KelechiOdom10",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/kelechi-odom-065308157/",
  },
];
