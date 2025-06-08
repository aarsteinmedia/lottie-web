import type { Plugin, RollupOptions } from 'rollup'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dts } from 'rollup-plugin-dts'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-opener'
// import sourcemaps from 'rollup-plugin-sourcemaps'
import pluginSummary from 'rollup-plugin-summary'
import { minify, swc } from 'rollup-plugin-swc3'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

const isProd = process.env.NODE_ENV !== 'development',
  isMinified = process.env.NODE_ENV === 'minified',
  { url } = import.meta,
  __dirname = path.dirname(fileURLToPath(url)),

  pkgBuffer = await readFile(new URL(path.resolve(__dirname, 'package.json'), url)),
  pkg: typeof import('./package.json') = JSON.parse(pkgBuffer.toString()),
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
  injectVersion = (): Plugin => ({
    name: 'inject-version',
    renderChunk: (code: string) => code.replace('[[BM_VERSION]]', pkg.version),
  }),
  plugins = (): Plugin[] => isProd ? [
    typescriptPaths(),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    commonjs(),
    injectVersion(),
    swc(),
    pluginSummary(),
  ] : [
    typescriptPaths(),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    commonjs(),
    injectVersion(),
    swc(),
    // sourcemaps(),
    serve({
      browser: 'firefox',
      open: true,
      port: 1002
    }),
    livereload()
  ],
  inputs = [
    {
      file: path.resolve(
        __dirname, 'src', 'Lottie.ts'
      ),
      name: 'lottie'
    },
    {
      file: path.resolve(
        __dirname, 'src', 'LottieLight.ts'
      ),
      name: 'lottie-light',
    },
    {
      file: path.resolve(
        __dirname, 'src', 'LottieUtils.ts'
      ),
      name: 'lottie-utils',
    },
  ],
  types: RollupOptions[] = inputs.map((input) => ({
    input: path.resolve(
      __dirname, 'types', `${toPascalCase(input.name)}.d.ts`
    ),
    output: {
      file: `./dist/${input.name}.d.ts`,
      format: 'esm',
    },
    plugins: [dts()],
  })),
  outputs: RollupOptions[] = inputs.map((input) => ({
    input: input.file,
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return
      }
      warn(warning)
    },
    output: {
      exports: 'named',
      extend: true,
      file: `./dist/${input.name}.js`,
      format: 'esm',
    },

    plugins: plugins(),
  })),
  output = [...outputs, ...types],
  minified: RollupOptions = {
    input: path.resolve(__dirname, 'player.js'),
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return
      }
      warn(warning)
    },
    output: {
      exports: 'named',
      extend: true,
      file: './player.min.js',
      format: 'iife',
      name: pkg.name
      // sourcemap: !isProd,
    },
    plugins: [
      typescriptPaths(),
      nodeResolve({
        extensions: ['.ts', '.js'],
        preferBuiltins: true,
      }),
      commonjs(),
      injectVersion(),
      swc(),
      minify(),
      // sourcemaps(),
      serve({
        browser: 'firefox',
        open: true,
        port: 1002
      }),
      livereload()
    ],
  }

let bundle: RollupOptions | RollupOptions[] = output

if (!isProd) {
  bundle = outputs[0]
} else if (isMinified) {
  bundle = minified
}

export default bundle
