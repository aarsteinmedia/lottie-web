import {
  existsSync, readdirSync, readFileSync
} from 'node:fs'
import { join, resolve } from 'node:path'
import {
  describe, expect, test
} from 'vitest'

import type PackageJSON from '../package.json'

const { url } = import.meta,
  pkg = JSON.parse(readFileSync(new URL('../package.json', url), 'utf-8')) as typeof PackageJSON,

  distDir = resolve(import.meta.dirname, '../dist')

function readDistJavaScript(): string[] {
  if (!existsSync(distDir)) {
    return []
  }

  const files: string[] = [],
    walk = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name)

        if (entry.isDirectory()) {
          walk(path)
        } else if (entry.name.endsWith('.js')) {
          files.push(readFileSync(path, 'utf8'))
        }
      }
    }

  walk(distDir)

  return files
}

const distFiles = readDistJavaScript(),
  hasProductionBuild = distFiles.some((file) => file.includes(pkg.version)) &&
    !distFiles.some((file) => file.includes('[[BM_VERSION]]'))

describe('production build', () => {
  test.skipIf(!hasProductionBuild)('injects the package version into dist output', () => {
    const combined = distFiles.join('\n')

    expect(combined).toContain(pkg.version)
    expect(combined).not.toContain('[[BM_VERSION]]')
  })
})
