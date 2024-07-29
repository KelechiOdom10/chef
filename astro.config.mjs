import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  site: "https://kellycooks.dev/",
  integrations: [mdx(), sitemap(), tailwind(), solidJs()],
  adapter: cloudflare(),
  vite: {
    define: {
      "process.env": process.env,
    },
  },
});
