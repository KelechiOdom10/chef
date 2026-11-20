import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const dist = resolve("dist");
const projects = resolve(dist, "projects");
const pages = (await readdir(projects, { recursive: true }))
  .filter(path => path.endsWith("/index.html"));
const icons = new Map();

for (const page of pages) {
  const html = await readFile(resolve(projects, page), "utf8");
  for (const [, stack] of html.matchAll(/<section\b[^>]*\bdata-project-tech\b[^>]*>([\s\S]*?)<\/section>/g)) {
    for (const [image] of stack.matchAll(/<img\b[^>]*>/g)) {
      const src = /\bsrc="([^"]+)"/.exec(image)?.[1];
      if (!src || !/^\/tools\/[a-z0-9/_-]+\.(?:svg|jpe?g|png|webp)$/.test(src)) {
        throw new Error(`${page}: project icon must point to a local image under /tools/: ${image}`);
      }
      if (!icons.has(src)) icons.set(src, page);
    }
  }
}

if (!pages.length || !icons.size) {
  throw new Error("No project detail pages or tech icons in dist. Run the site build first.");
}

await Promise.all([...icons].map(async ([src, page]) => {
  try {
    const data = await readFile(resolve(dist, `.${src}`));
    await sharp(data).resize(16, 16, { fit: "inside" }).png().toBuffer();
  } catch (cause) {
    throw new Error(`${page}: cannot decode project icon ${src}`, { cause });
  }
}));

console.log(`Checked ${icons.size} local tech icons across ${pages.length} built project detail pages.`);
