import { createHighlighter } from 'shiki'

// Astro evaluates page frontmatter for every route. Share the WASM highlighter
// across those renders instead of allocating one per reusable.
export const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: ['typescript', 'tsx', 'javascript', 'jsx', 'bash', 'json'],
})
