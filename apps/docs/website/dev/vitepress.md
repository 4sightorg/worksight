# VitePress Guide

## What is VitePress?

VitePress is a fast, modern static site generator powered by Vite and Vue, ideal for project documentation.

---

## 1. Setup

### a. Install VitePress

```sh
npm install --save-dev vitepress
```

### b. Add Scripts to `package.json`

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  }
}
```

### c. Directory Structure

```
/docs
  /.vitepress
    config.ts
  index.md
  guide.md
  ...
```

---

## 2. Writing Docs

- Use Markdown (`.md`) for all content.
- Organize docs by topic (e.g., `guide.md`, `api.md`, `features.md`).
- Use frontmatter for metadata:

  ```markdown
  ---
  title: Guide
  ---
  ```

- Use headings (`#`, `##`, `###`) for structure.
- Add code blocks with language tags for syntax highlighting.
- Use tables, lists, and images for clarity.

---

## 3. Configuration (`.vitepress/config.ts`)

- Set site title, description, theme, nav, and sidebar.
- Example:

  ```typescript
  import { defineConfig } from 'vitepress';

  export default defineConfig({
    title: 'WorkSight Docs',
    description: 'Centralized task and burnout monitoring dashboard',
    themeConfig: {
      nav: [
        { text: 'Guide', link: '/guide' },
        { text: 'API', link: '/api' }
      ],
      sidebar: [
        { text: 'Introduction', link: '/' },
        { text: 'Guide', link: '/guide' },
        { text: 'Features', link: '/features' }
      ]
    }
  });
  ```

---

## 4. Best Practices

### For Dev Docs

- **Keep docs close to code:** Update docs as you develop features.
- **Document all public APIs and modules.**
- **Use examples:** Show usage for functions, components, and endpoints.
- **Version your docs:** If your API changes, keep old docs accessible.
- **Automate builds:** Deploy docs on every push (e.g., with GitHub Actions).

### For Usage Docs

- **Write for users, not just devs:** Explain setup, configuration, and common workflows.
- **Include screenshots and GIFs** for UI features.
- **Add troubleshooting and FAQ sections.**
- **Keep quick start guides short and actionable.**
- **Link to deeper dives for advanced topics.**

---

## 5. Local Development

- Start docs locally:

  ```sh
  npm run docs:dev
  ```

  Visit [http://localhost:5173](http://localhost:5173) (or as shown in terminal).

- Rebuild static site:

  ```sh
  npm run docs:build
  ```

- Preview production build:

  ```sh
  npm run docs:serve
  ```

---

## 6. Deployment

- Deploy the `docs/.vitepress/dist` folder to any static host (Vercel, Netlify, GitHub Pages).
- Automate deployment with CI/CD for up-to-date docs.

---

## 7. Tips

- Use Markdown features: tables, callouts, links, and images.
- Use custom components for advanced interactivity (see VitePress docs).
- Keep navigation simple and intuitive.
- Regularly review and prune outdated docs.
- Encourage contributions and feedback from users and devs.

---

## 8. Resources

- [VitePress Docs](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [VitePress Theme Reference](https://vitepress.dev/reference/default-theme-config)

---
