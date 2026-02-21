import {
  strToU8, zip, type Zippable
} from 'fflate'

import type {
  AnimationData, LottieManifest, Shape
} from '@/types'

import {
  addExt, createElementID, download, getExt, getExtFromB64, isAudio, isImage,
  parseBase64
} from '@/utils'
import { isServer } from '@/utils/helpers/constants'

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
        reject(error as Error)
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
    true)

/**
 * Convert a JSON Lottie to dotLottie or combine several animations and download new dotLottie file in your browser.
 */
interface CreateDotLottieProps {
  animations?: undefined | AnimationData[]
  fileName?: undefined | string
  manifest?: undefined | LottieManifest
  shouldDownload?: undefined | boolean
}

export async function createDotLottie({
  animations = [],
  fileName,
  manifest,
  shouldDownload = true,
}: CreateDotLottieProps) {
  try {
    // Input validation
    if (animations.length === 0 || !manifest) {
      throw new Error(`Missing or malformed required parameter(s):\n ${animations.length > 0 ? '- manifest\n' : ''
      } ${manifest ? '- animations\n' : ''}`)
    }

    const manifestCompressionLevel = 0,
      animationCompressionLevel = 9,
      /**
       * Prepare the dotLottie file.
       */
      name = addExt('lottie', fileName) || `${createElementID()}.lottie`,
      dotlottie: Zippable = {
        'manifest.json': [
          strToU8(JSON.stringify(manifest), true), { level: manifestCompressionLevel },
        ],
      }


    // Add animations and assets to the dotLottie file
    const { length } = animations

    for (let i = 0; i < length; i++) {
      const { length: jLen } = animations[i]?.assets ?? []

      // Prepare assets
      for (let j = 0; j < jLen; j++) {
        const asset = animations[i]?.assets[j]

        if (
          !asset?.p ||
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
          ext = isEncoded ? getExtFromB64(file) : getExt(file),
          /**
           * Check if the asset is already base64-encoded. If not, get path, fetch it, and encode it.
           */
          dataURL = isEncoded
            ? file
            : await fileToBase64(path
              ? path.endsWith('/') && `${path}${file}` ||
                `${path}/${file}`
              : file)

        // Asset is encoded

        const thisAsset = animations[i]?.assets[j]

        if (thisAsset) {
          thisAsset.e = 1
          thisAsset.p = `${assetId}.${ext}`
          // Asset is embedded, so path empty string
          thisAsset.u = ''
        }

        dotlottie[
          `${isAudio(asset) ? 'audio' : 'i'}/${assetId}.${ext}`
        ] = [base64ToU8(dataURL), { level: animationCompressionLevel }]
      }

      // Prepare expressions
      const { length: kLen } = animations[i]?.layers ?? []

      for (let k = 0; k < kLen; k++) {
        const { ks: shape } = animations[i]?.layers[k] ?? {},
          props = Object.keys(shape ?? {}) as (keyof Shape)[],
          { length: pLen } = props

        for (let p = 0; p < pLen; p++) {
          const { x: expression } = shape?.[props[p] as keyof Shape] as { x?: string }

          if (!expression) {
            continue
          }

          const thisShape = animations[i]?.layers[k]?.ks[props[p] as keyof Shape] as keyof Shape

          // Base64 Encode to handle compression
          // @ts-expect-error: TODO:
          thisShape.x = btoa(expression)

          // Set e (encoded) to 1
          // @ts-expect-error: TODO:
          thisShape.e = 1
        }

      }

      dotlottie[`a/${manifest.animations[i]?.id}.json`] = [
        strToU8(JSON.stringify(animations[i]), true), { level: animationCompressionLevel },
      ]
    }

    const buffer = await getArrayBuffer(dotlottie)

    if (shouldDownload) {
      download(buffer, {
        mimeType: 'application/zip',
        name,
      })

      return null
    }

    return buffer
  } catch (error) {
    console.error(error)

    return null
  }
}