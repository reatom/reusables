import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import registryData from '../../registry.json'

const ROOT = resolve(import.meta.dirname, '..', '..')

// --- Types ---

export type ReusableType = 'extension' | 'factory' | 'utility' | 'integration'

export interface ReusableDependency {
  ecosystem: string
  name: string
  version: string
}

export interface ReusableFile {
  type: string
  role: string
  path: string
  relativePath: string
  registryDependencies: string[]
  dependencies: ReusableDependency[]
  devDependencies: ReusableDependency[]
}

export interface RegistryItem {
  name: string
  type: string
  registryDependencies: string[]
  dependencies: ReusableDependency[]
  devDependencies: ReusableDependency[]
  files: ReusableFile[]
}

export interface Reusable {
  name: string
  type: ReusableType
  registryDependencies: string[]
  devDependencies: ReusableDependency[]
  doc: string | null
  example: string | null
  source: string | null
  docPath: string | null
  examplePath: string | null
  sourcePath: string | null
}

// --- Helpers ---

function parseType(rawType: string): ReusableType {
  const t = rawType.replace('reatom:', '')
  if (
    t === 'extension' ||
    t === 'factory' ||
    t === 'utility' ||
    t === 'integration'
  ) {
    return t
  }
  return 'utility'
}

function readFile(relativePath: string): string | null {
  try {
    return readFileSync(resolve(ROOT, relativePath), 'utf-8')
  } catch {
    return null
  }
}

function findFileByRole(
  item: RegistryItem,
  role: string,
): ReusableFile | undefined {
  for (const file of item.files) {
    if (file.role === role) return file
  }
  return undefined
}

function findSourceFile(item: RegistryItem): ReusableFile | undefined {
  for (const file of item.files) {
    if (!file.role || file.role === 'file') return file
  }
  return undefined
}

function buildReusable(item: RegistryItem): Reusable {
  const docFile = findFileByRole(item, 'doc')
  const exampleFile = findFileByRole(item, 'example')
  const sourceFile = findSourceFile(item)

  return {
    name: item.name,
    type: parseType(item.type),
    registryDependencies: item.registryDependencies,
    devDependencies: item.devDependencies,
    doc: docFile ? readFile(docFile.relativePath) : null,
    example: exampleFile ? readFile(exampleFile.relativePath) : null,
    source: sourceFile ? readFile(sourceFile.relativePath) : null,
    docPath: docFile?.relativePath ?? null,
    examplePath: exampleFile?.relativePath ?? null,
    sourcePath: sourceFile?.relativePath ?? null,
  }
}

// Flatten nested file structures (e.g. tweakpane has nested files array)
function flattenFiles(
  item: (typeof registryData.items)[number],
): ReusableFile[] {
  const result: ReusableFile[] = []
  for (const f of item.files) {
    if ('files' in f && Array.isArray((f as any).files)) {
      // Nested directory structure (tweakpane)
      const dir = f as any
      for (const nested of dir.files) {
        result.push({
          type: nested.type ?? item.type,
          role: nested.role ?? 'file',
          path: nested.path,
          relativePath:
            nested.relativePath ??
            `${dir.relativePath ?? dir.path}/${nested.path}`,
          registryDependencies: nested.registryDependencies ?? [],
          dependencies: nested.dependencies ?? [],
          devDependencies: nested.devDependencies ?? [],
        })
      }
    } else {
      result.push({
        type: f.type ?? item.type,
        role: f.role ?? 'file',
        path: f.path,
        relativePath: f.relativePath ?? f.path,
        registryDependencies: f.registryDependencies ?? [],
        dependencies: f.dependencies ?? [],
        devDependencies: f.devDependencies ?? [],
      })
    }
  }
  return result
}

// --- Build the registry once ---

const items: RegistryItem[] = registryData.items.map((item) => ({
  name: item.name,
  type: item.type,
  registryDependencies: item.registryDependencies,
  dependencies: item.dependencies ?? [],
  devDependencies: item.devDependencies,
  files: flattenFiles(item),
}))

const reusables: Reusable[] = items.map(buildReusable)
const reusablesByName = new Map(reusables.map((r) => [r.name, r]))

// --- Exported API ---

export function getAllReusables(): Reusable[] {
  return reusables
}

export function getReusableByName(name: string): Reusable | undefined {
  return reusablesByName.get(name)
}

export function getReusableDoc(name: string): string | null {
  return reusablesByName.get(name)?.doc ?? null
}

export function getReusableExample(name: string): string | null {
  return reusablesByName.get(name)?.example ?? null
}

export function getReusableSource(name: string): string | null {
  return reusablesByName.get(name)?.source ?? null
}

export type ReusableGroup = { type: ReusableType; items: Reusable[] }

export function getReusablesGroupedByType(): ReusableGroup[] {
  const order: ReusableType[] = [
    'factory',
    'extension',
    'utility',
    'integration',
  ]
  const grouped = new Map<ReusableType, Reusable[]>()

  for (const r of reusables) {
    const list = grouped.get(r.type) ?? []
    list.push(r)
    grouped.set(r.type, list)
  }

  return order
    .filter((t) => grouped.has(t))
    .map((t) => ({ type: t, items: grouped.get(t)! }))
}
