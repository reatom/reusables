import registryData from '../../registry.json'

// Reusable sources are inlined at bundle time rather than read from disk at
// runtime: a filesystem path relative to this module survives `astro dev` but
// not `astro build`, where the bundled chunk lives under dist/.
// Keys are repo-root absolute ("/src/reusables/..."), matching registry.json's
// relativePath with a leading slash.
const sourceFiles = import.meta.glob('/src/reusables/**/*.{ts,tsx,md}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

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

/**
 * Nested file entry within a directory (used for multi-file reusables like
 * tweakpane)
 */
export interface NestedFileEntry {
  type?: string
  role?: string
  path: string
  relativePath?: string
  registryDependencies?: string[]
  dependencies?: ReusableDependency[]
  devDependencies?: ReusableDependency[]
}

/** Directory entry containing nested files */
export interface DirectoryEntry {
  path: string
  relativePath?: string
  files: NestedFileEntry[]
}

export interface RegistryItem {
  name: string
  type: string
  registryDependencies: string[]
  dependencies: ReusableDependency[]
  devDependencies: ReusableDependency[]
  files: ReusableFile[]
}

export interface SourceFile {
  path: string
  content: string
}

export interface Reusable {
  name: string
  type: ReusableType
  registryDependencies: string[]
  devDependencies: ReusableDependency[]
  doc: string | null
  example: string | null
  source: string | null
  sources: SourceFile[]
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
  const content = sourceFiles[`/${relativePath}`]
  if (content === undefined) {
    // Every registry path is generated from a real file under src/reusables, so
    // a miss means a stale registry.json — fail loudly instead of shipping a
    // page with silently missing docs and source.
    throw new Error(
      `registry.json references "${relativePath}", which does not exist. Run \`pnpm jsrepo:build\` to rebuild the registry.`,
    )
  }
  return content
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

function findAllSourceFiles(item: RegistryItem): ReusableFile[] {
  const sourceFiles: ReusableFile[] = []
  for (const file of item.files) {
    if (!file.role || file.role === 'file') {
      sourceFiles.push(file)
    }
  }
  return sourceFiles
}

function buildReusable(item: RegistryItem): Reusable {
  const docFile = findFileByRole(item, 'doc')
  const exampleFile = findFileByRole(item, 'example')
  const sourceFile = findSourceFile(item)
  const allSourceFiles = findAllSourceFiles(item)

  const sources: SourceFile[] = allSourceFiles
    .map((f) => {
      const content = readFile(f.relativePath)
      return content ? { path: f.path, content } : null
    })
    .filter((s): s is SourceFile => s !== null)

  return {
    name: item.name,
    type: parseType(item.type),
    registryDependencies: item.registryDependencies,
    devDependencies: item.devDependencies,
    doc: docFile ? readFile(docFile.relativePath) : null,
    example: exampleFile ? readFile(exampleFile.relativePath) : null,
    source: sourceFile ? readFile(sourceFile.relativePath) : null,
    sources,
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
    if ('files' in f && Array.isArray((f as DirectoryEntry).files)) {
      // Nested directory structure (tweakpane)
      const dir = f as DirectoryEntry
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
