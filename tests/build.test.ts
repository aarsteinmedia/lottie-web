import {
  existsSync, readdirSync, readFileSync
} from 'node:fs'
import { join, resolve } from 'node:path'
import {
  describe, expect, test
} from 'vitest'

import type PackageJSON from '../package.json'

interface File {
  content: string
  name: string
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
            name: entry.name
          })
        }
      }
    }

  walk(distDir)

  return files
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
  test('Light does not import CanvasRenderer', () => {
    const light = distFiles.find(({ name }) => name === 'lottie-light.js')

    expect(light).not.toBeFalsy()
    expect(light).not.toContain('CanvasRenderer')
  })
})
