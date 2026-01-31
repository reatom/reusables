// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://reatom.github.io',
  base: '/reusables/',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
})
