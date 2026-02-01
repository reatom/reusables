import { defineConfig, type RegistryItem } from 'jsrepo'
import { repository } from 'jsrepo/outputs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const items = await loadRegistryItems(path.join(rootDir, 'src', 'reusables'))

export default defineConfig({
  registry: {
    name: '@reatom/reusables',
    homepage: 'https://v1000.reatom.dev',
    bugs: 'https://github.com/reatom/reusables/issues',
    items,
    outputs: [repository()],
    excludeDeps: ['@reatom/core', '@reatom/react'],
    defaultPaths: {
      'reatom:utility': 'src/reatom',
      'reatom:factory': 'src/reatom',
      'reatom:extension': 'src/reatom',
      'reatom:integration': 'src/reatom',
    },
  },
})

async function loadRegistryItems(baseDir: string): Promise<RegistryItem[]> {
  const metaFiles = (await findMetaFiles(baseDir)).sort()
  const modules = await Promise.all(
    metaFiles.map(async (filePath) => {
      const module = await import(pathToFileURL(filePath).href)
      return { filePath, module }
    }),
  )

  const items: RegistryItem[] = []

  for (const { filePath, module } of modules) {
    const metaDir = path.dirname(filePath)

    for (const value of Object.values(module)) {
      if (isRegistryItem(value)) {
        items.push(resolveRegistryItemPaths(value, metaDir))
      }
    }
  }

  return items
}

async function findMetaFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const matches: string[] = []
  const metaPattern = /\.meta\.(?:c|m)?(?:ts|js)$/

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      matches.push(...(await findMetaFiles(fullPath)))
      continue
    }

    if (entry.isFile() && metaPattern.test(entry.name)) {
      matches.push(fullPath)
    }
  }

  return matches
}

function isRegistryItem(value: unknown): value is RegistryItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'files' in value
  )
}

function resolveRegistryItemPaths(
  item: RegistryItem,
  metaDir: string,
): RegistryItem {
  return {
    ...item,
    files: item.files.map((file) => ({
      ...file,
      path: toRegistryPath(metaDir, file.path),
    })),
  }
}

function toRegistryPath(metaDir: string, filePath: string): string {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : filePath.startsWith('.')
      ? path.resolve(metaDir, filePath)
      : path.resolve(rootDir, filePath)

  return path.relative(rootDir, resolved)
}
