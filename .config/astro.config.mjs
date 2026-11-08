// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://reatom.github.io',
  base: '/reusables/',
  outDir: './.var/site',
  cacheDir: './.var/astro-cache',
  vite: { cacheDir: '.var/vite' },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
})
