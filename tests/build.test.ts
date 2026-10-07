import {
  existsSync, readdirSync, readFileSync
} from 'node:fs'
import {
  dirname, join, relative, resolve
} from 'node:path'
import {
  describe, expect, test
} from 'vitest'

import type PackageJSON from '../package.json'

interface File {
  content: string
  name: string
  /** Path relative to dist, e.g. `chunks/createLottie-abc123.js`. */
  path: string
}

const { url } = import.meta,
  pkg = JSON.parse(readFileSync(new URL('../package.json', url), 'utf-8')) as typeof PackageJSON,

  distDir = resolve(import.meta.dirname, '../dist')

function readDistJavaScript(): File[] {
  if (!existsSync(distDir)) {
    return []
  }

  const files: File[] = [],
    walk = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name)

        if (entry.isDirectory()) {
          walk(path)
        } else if (entry.name.endsWith('.js')) {
          files.push({
            content: readFileSync(path, 'utf8'),
            name: entry.name,
            path: relative(distDir, path)
          })
        }
      }
    }

  walk(distDir)

  return files
}

/**
 * Every dist file an entry loads, following static imports into shared chunks.
 * Export names are mangled in chunks, so checks must look at the chunks' code.
 */
function collectImportGraph(files: File[], entry: string): File[] {
  const byPath = new Map(files.map((file) => [file.path, file])),
    seen = new Map<string, File>(),
    visit = (path: string) => {
      const file = byPath.get(path)

      if (!file || seen.has(path)) {
        return
      }
      seen.set(path, file)

      for (const [, specifier] of file.content.matchAll(/(?:from|import)\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
        visit(join(dirname(path), specifier))
      }
    }

  visit(entry)

  return [...seen.values()]
}

const distFiles = readDistJavaScript(),
  hasProductionBuild = distFiles.some((file) => file.content.includes(pkg.version)) &&
    !distFiles.some((file) => file.content.includes('[[BM_VERSION]]'))

describe('production build', () => {
  test.skipIf(!hasProductionBuild)('injects the package version into dist output', () => {
    const combined = distFiles
      .map(({ content }) => content)
      .join('\n')

    expect(combined).toContain(pkg.version)
    expect(combined).not.toContain('[[BM_VERSION]]')
  })
  test.skipIf(!hasProductionBuild)('light entry does not load the canvas renderer', () => {
    const graph = collectImportGraph(distFiles, 'lottie-light.js')

    // Guard against a vacuous pass if the entry is renamed or imports change shape.
    expect(graph.map(({ path }) => path)).toContain('lottie-light.js')
    expect(graph.length).toBeGreaterThan(1)

    const withCanvas = graph
      .filter(({ content }) => content.includes('class CanvasRenderer '))
      .map(({ path }) => path)

    expect(withCanvas).toEqual([])
  })
})
