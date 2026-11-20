Hi! My name is Kelechi 👨🏾‍🍳 Welcome to the code that controls my evergrowing space on the internet.

### Built with

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

### Project tech icons

Project detail pages match each `technologies` label to `src/data/svgs.json` by name, ignoring case. To add an icon, put a self-contained image in `public/tools/` and map the label to its local `/tools/…` URL. Use one URL or a `{ "light": "...", "dark": "..." }` pair. A label without a local icon still renders as text.

`bun run build` checks that every tech-icon image in the built project pages resolves to a decodable asset in `dist`. Run `bun run smoke:tech-icons` to repeat that check after a build. Icons under `public/tools/tech/` are from [SVGL](https://github.com/pheralb/svgl/tree/90f6de7026c5e75a9014dbf1f422792bd40b1802/static/library); its MIT notice is in that directory. Brand marks belong to their respective owners.

### Run Locally

1. Clone the project

```bash
  git clone https://github.com/KelechiOdom10/chef.git
```

2. Go to the project directory

```bash
  cd chef
```

3. Install dependencies

```bash
  bun install
```

4. Run the local development server

```bash
  bun run dev
```

## 🏛️ License

MIT
