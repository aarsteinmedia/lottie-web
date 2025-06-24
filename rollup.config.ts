import type { Plugin, RollupOptions } from 'rollup'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dts } from 'rollup-plugin-dts'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-opener'
import pluginSummary from 'rollup-plugin-summary'
import { swc } from 'rollup-plugin-swc3'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

const isProd = process.env.NODE_ENV !== 'development',
  { url } = import.meta,
  __dirname = dirname(fileURLToPath(url)),
  toPascalCase = (str: string) => {
    // Use regex to match words regardless of delimiter
    const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)

    // If no words are found, return an empty string
    if (!words) {
      return ''
    }

    // Capitalize each word and join them
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  },
  plugins = (): Plugin[] => isProd ? [
    typescriptPaths(),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    commonjs(),
    swc(),
    pluginSummary(),
  ] : [
    typescriptPaths(),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    commonjs(),
    swc(),
    serve({
      browser: 'firefox',
      open: true,
      port: 1002
    }),
    livereload()
  ],
  inputs = [
    {
      file: resolve(
        __dirname, 'src', 'Lottie.ts'
      ),
      name: 'lottie'
    },
    {
      file: resolve(
        __dirname, 'src', 'LottieLight.ts'
      ),
      name: 'lottie-light',
    },
    {
      file: resolve(
        __dirname, 'src', 'LottieUtils.ts'
      ),
      name: 'lottie-utils',
    },
    {
      file: resolve(
        __dirname, 'src', 'Dotlottie.ts'
      ),
      name: 'dotlottie'
    }
  ],
  types: RollupOptions[] = inputs.map((input) => ({
    input: resolve(
      __dirname, 'types', `${toPascalCase(input.name)}.d.ts`
    ),
    output: {
      file: resolve(
        __dirname, 'dist', `${input.name}.d.ts`
      ),
      format: 'esm',
    },
    plugins: [typescriptPaths({ tsConfigPath: resolve(__dirname, 'tsconfig.build.json') }), dts()],
  })),
  outputs: RollupOptions[] = inputs.map((input) => ({
    external: [
      'fflate'
    ],
    input: input.file,
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return
      }
      warn(warning)
    },
    output: {
      exports: 'named',
      file: resolve(
        __dirname, 'dist', `${input.name}.js`
      ),
      format: 'esm',
    },

    plugins: plugins(),
  })),
  output = [...outputs, ...types]

export default isProd ? output : output[0]
