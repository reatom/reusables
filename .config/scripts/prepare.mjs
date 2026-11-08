import { mkdir, lstat, rename, symlink } from 'node:fs/promises'

const root = new URL('../../', import.meta.url)
const target = new URL('.var/astro/', root)
const link = new URL('.astro', root)
const existing = await lstat(link).catch((error) => {
  if (error.code !== 'ENOENT') throw error
})
if (existing && !existing.isSymbolicLink()) {
  await mkdir(new URL('.var/', root), { recursive: true })
  await rename(link, target)
} else {
  await mkdir(target, { recursive: true })
}
if (!existing || !existing.isSymbolicLink()) {
  await symlink('.var/astro', link, 'dir')
}
