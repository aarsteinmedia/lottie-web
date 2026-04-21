import type { Plugin, RollupOptions } from 'rollup'

import { nodeResolve } from '@rollup/plugin-node-resolve'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dts } from 'rollup-plugin-dts'
import livereload from 'rollup-plugin-livereload'
import { serve } from 'rollup-plugin-opener'
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
  plugins = ((): Plugin[] => isProd ? [
    typescriptPaths(),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    swc(),
    pluginSummary(),
  ] : [
    typescriptPaths(),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    swc(),
    serve({
      browser: 'firefox',
      open: true,
      port: 1002
    }),
    livereload()
  ])(),

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
      name: 'lottie-light'
    },
    {
      file: resolve(
        __dirname, 'src', 'LottieSVG.ts'
      ),
      name: 'lottie-svg'
    },
    {
      file: resolve(
        __dirname, 'src', 'LottieCanvas.ts'
      ),
      name: 'lottie-canvas'
    },
    {
      file: resolve(
        __dirname, 'src', 'LottieUtils.ts'
      ),
      name: 'lottie-utils'
    },
    {
      file: resolve(
        __dirname, 'src', 'Dotlottie.ts'
      ),
      name: 'dotlottie'
    },
  ],

  jsInput = Object.fromEntries(inputs.map((i) => [i.name, i.file])),
  dtsInput = Object.fromEntries(inputs.map((i) => [
    i.name, resolve(
      __dirname, 'types', `${toPascalCase(i.name)}.d.ts`
    ),
  ])),

  onwarn: RollupOptions['onwarn'] = (warning, warn) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return
    }
    warn(warning)
  },
  output: RollupOptions[] = [
    // Build all JS entrypoints together so shared modules (e.g. enums) become shared chunks.
    {
      external: ['fflate'],
      input: jsInput,
      onwarn,
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        dir: resolve(__dirname, 'dist'),
        entryFileNames: '[name].js',
        exports: 'named',
        format: 'esm',
      },
      plugins,
    }, {
      // Build all d.ts entrypoints together so shared declarations are de-duplicated.
      input: dtsInput,
      onwarn,
      output: {
        chunkFileNames: 'chunks/[name]-[hash].d.ts',
        dir: resolve(__dirname, 'dist'),
        entryFileNames: '[name].d.ts',
        format: 'esm',
      },
      plugins: [dts()],
    },
  ]

// eslint-disable-next-line import/no-default-export
export default isProd ? output : output[0]
