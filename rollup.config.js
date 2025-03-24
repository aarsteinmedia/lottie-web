import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { readFile } from 'fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dts } from 'rollup-plugin-dts'
// import livereload from 'rollup-plugin-livereload'
// import serve from 'rollup-plugin-serve'
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
  toPascalCase = (str) => {
    // Use regex to match words regardless of delimiter
    const words = str.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )

    // If no words are found, return an empty string
    if (!words) {
      return ''
    }

    // Capitalize each word and join them
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  },
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
    // !isProd &&
    //   serve({
    //     open: true,
    //   }),
    // !isProd && livereload(),
  ],
  inputs = [
    { file: path.resolve(__dirname, 'src', 'Lottie.ts'), name: 'lottie' },
    {
      file: path.resolve(__dirname, 'src', 'LottieLight.ts'),
      name: 'lottie-light',
    },
    {
      file: path.resolve(__dirname, 'src', 'LottieUtils.ts'),
      name: 'lottie-utils',
    },
  ],
  types = inputs.map((input) => ({
    input: path.resolve(__dirname, 'types', `${toPascalCase(input.name)}.d.ts`),
    output: {
      file: `./dist/${input.name}.d.ts`,
      format: 'esm',
    },
    plugins: [dts()],
  })),
  outputs = inputs.map((input) => ({
    input: input.file,
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return
      }
      warn(warning)
    },
    output: {
      exports: 'named',
      file: `./dist/${input.name}.js`,
      format: 'esm',
    },

    plugins: plugins(),
  })),
  output = outputs.concat(types)

export default output
// export default isProd ? [module, types] : module
