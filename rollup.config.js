import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { readFile } from 'fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dts } from 'rollup-plugin-dts'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import { summary } from 'rollup-plugin-summary'
import { swc } from 'rollup-plugin-swc3'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

const isProd = process.env.NODE_ENV !== 'development',
  __dirname = path.dirname(fileURLToPath(import.meta.url)),
  /**
   * @type {typeof import('./package.json')}
   * */
  pkg = JSON.parse(
    (
      await readFile(
        new URL(path.resolve(__dirname, 'package.json'), import.meta.url)
      )
    ).toString()
  ),
  injectVersion = () => ({
    name: 'inject-version',
    renderChunk: (code) => code.replace('[[BM_VERSION]]', pkg.version),
  }),
  plugins = () => [
    typescriptPaths(),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    commonjs(),
    injectVersion(),
    swc(),
    isProd && summary(),
    !isProd &&
      serve({
        open: true,
      }),
    !isProd && livereload(),
  ],
  input = path.resolve(__dirname, 'src', 'index.ts'),
  /**
   * @type {import('rollup').RollupOptions}
   * */
  types = {
    input: path.resolve(__dirname, 'types', 'index.d.ts'),
    output: {
      file: pkg.types,
      format: 'esm',
    },
    plugins: [dts()],
  },
  /**
   * @type {import('rollup').RollupOptions}
   * */
  module = {
    input,
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return
      }
      warn(warning)
    },
    output: {
      exports: 'named',
      file: pkg.main,
      format: 'esm',
    },

    plugins: plugins(),
  }

export default isProd ? [module, types] : module
