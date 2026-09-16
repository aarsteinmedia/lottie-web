import {
  strToU8, zip, type DeflateOptions, type Zippable
} from 'fflate'

import type {
  AnimationData, LottieManifest, Shape
} from '@/types'

import {
  addExt, createElementID, devError, download, getExt, getExtFromB64, isAudio, isImage,
  parseBase64,
  trailingslashit
} from '@/utils'
import { isServer } from '@/utils/helpers/constants'

/** Transform prop that may carry a (possibly encoded) expression. */
interface ExpressionProp {
  e?: 0 | 1
  x?: string
}

const getArrayBuffer = async (zippable: Zippable) => {
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      zip(
        zippable, { level: 9 }, (err, data) => {
          if (err) {
            reject(err)

            return
          }
          if (!(data.buffer instanceof ArrayBuffer)) {
            reject(new Error('Data is not transferable'))

            return
          }
          resolve(data.buffer)
        }
      )
    })

    return arrayBuffer
  },

  fileToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url),
      blob = await response.blob()

    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()

        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result)

            return
          }
          reject(new Error('Could not create bas64'))
        }
        reader.readAsDataURL(blob)
      } catch (error) {

        if (error instanceof Error) {
          reject(error)
        }
      }
    })
  },

  /**
   * Convert Base64 encoded string to Uint8Array.
   *
   * @param str - Base64 encoded string.
   * @returns UTF-8/Latin-1 binary.
   */
  base64ToU8 = (str: string) =>
    strToU8(isServer
      ? Buffer.from(parseBase64(str), 'base64').toString('binary')
      : atob(parseBase64(str)),
    true),

  prepareLottie = (filename: string, manifest: LottieManifest) => {
    const manifestCompressionLevel = 0,
      name = addExt('lottie', filename) || `${createElementID()}.lottie`,
      dotLottie: Zippable = {
        'manifest.json': [
          strToU8(JSON.stringify(manifest), true), { level: manifestCompressionLevel },
        ],
      }

    return {
      dotLottie,
      name
    }
  },

  prepareAssets = async (
    animation: AnimationData,
    dotLottie: Zippable,
    animationCompressionLevel: DeflateOptions['level']
  ) => {
    const { length: jLen } = animation.assets

    // Prepare assets
    for (let j = 0; j < jLen; j++) {
      const asset = animation.assets[j]

      if (
        !asset.p ||
        !isImage(asset) &&
        !isAudio(asset)
      ) {
        continue
      }

      const { p: file, u: path } = asset

      if (!file) {
        continue
      }
      // Original asset.id caused issues with multianimations
      const assetId = createElementID(),
        isEncoded = file.startsWith('data:'),
        ext = isEncoded ? getExtFromB64(file) : getExt(file)
      /**
       * Check if the asset is already base64-encoded. If not, get path, fetch it, and encode it.
       */
      let dataURL = file

      if (!isEncoded) {
        let url = file

        if (path) {
          url = `${trailingslashit(path)}${file}`
        }

        dataURL = await fileToBase64(url)
      }

      // Asset is encoded
      const thisAsset = animation.assets[j]

      thisAsset.e = 1
      thisAsset.p = `${assetId}.${ext}`
      // Asset is embedded, so path empty string
      thisAsset.u = ''

      dotLottie[
        `${isAudio(asset) ? 'audio' : 'i'}/${assetId}.${ext}`
      ] = [
        base64ToU8(dataURL), { level: animationCompressionLevel as any }
      ]
    }
  },

  prepareExpressions = (animation: AnimationData) => {
    const { length: kLen } = animation.layers

    for (let k = 0; k < kLen; k++) {
      const { ks: transform } = animation.layers[k] ?? {},
        props = Object.keys(transform) as (keyof Shape)[],
        { length: pLen } = props

      for (let p = 0; p < pLen; p++) {
        const prop = transform[props[p]] as ExpressionProp | undefined,
          expression = prop?.x

        if (!prop || !expression) {
          continue
        }

        // Base64 Encode to handle compression
        prop.x = btoa(expression)
        prop.e = 1
      }

    }
  }

/**
 * Convert a JSON Lottie to dotLottie or combine several animations and download new dotLottie file in your browser.
 */
interface CreateDotLottieProps {
  animations?: undefined | AnimationData[]
  filename?: undefined | string
  manifest?: undefined | LottieManifest
  shouldDownload?: undefined | boolean
}

export async function createDotLottie({
  animations = [],
  filename = '',
  manifest,
  shouldDownload = true,
}: CreateDotLottieProps) {
  try {
    // Input validation
    if (animations.length === 0 || !manifest) {
      throw new Error(`Missing or malformed required parameter(s):\n ${animations.length > 0 ? '- manifest\n' : ''
      } ${manifest ? '- animations\n' : ''}`)
    }

    const animationCompressionLevel = 9,
      { dotLottie, name } = prepareLottie(filename, manifest)


    // Add animations and assets to the dotLottie file
    const { length } = animations

    for (let i = 0; i < length; i++) {
      await prepareAssets(
        animations[i],
        dotLottie,
        animationCompressionLevel
      )
      prepareExpressions(animations[i])

      dotLottie[`a/${manifest.animations[i]?.id}.json`] = [
        strToU8(JSON.stringify(animations[i]), true), { level: animationCompressionLevel },
      ]
    }

    const buffer = await getArrayBuffer(dotLottie)

    if (shouldDownload) {
      download(buffer, {
        mimeType: 'application/zip+dotlottie',
        name,
      })

      return null
    }

    return buffer
  } catch (error) {
    devError(error)

    return null
  }
}