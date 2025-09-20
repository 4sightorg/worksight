# Next.js Guide

## What is Next.js?

Next.js is a React framework for building full-stack web apps with server-side rendering, API routes, and more.

## How to Use

1. **Pages and Routing**
   - Files in `pages/` become routes automatically.
   - Example: `pages/about.tsx` → `/about`

2. **API Routes**
   - Place serverless functions in `pages/api/`.
   - Example:

     ```typescript
     // pages/api/hello.ts
     export default function handler(req, res) {
       res.status(200).json({ message: 'Hello World' });
     }
     ```

3. **Data Fetching**
   - Use `getServerSideProps`, `getStaticProps`, or React Server Components for data fetching.

4. **Styling**
   - Use Tailwind CSS, CSS Modules, or any CSS-in-JS solution.

5. **Deployment**
   - Deploy easily to Vercel or any Node.js host.

## Tips

- Use the App Router (`app/`) for new features (Next.js 13+).
- Leverage API routes for backend logic.
- Use environment variables for secrets.
