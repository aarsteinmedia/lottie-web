import {
  strFromU8, unzip as unzipOrg, type Unzipped
} from 'fflate'

import type {
  AnimationData, LottieManifest, Shape
} from '@/types'

import { resolveAssets } from '@/utils/dotLottie/resolveAssets'

/** Transform prop that may carry a (possibly encoded) expression. */
interface ExpressionProp {
  e?: 0 | 1
  x?: string
}

const unzip = async (resp: Response): Promise<Unzipped> => {
    const u8 = new Uint8Array(await resp.arrayBuffer()),
      unzipped = await new Promise<Unzipped>((resolve, reject) => {
        unzipOrg(u8,
          (err, file) => {
            if (err) {
              reject(err)
            }
            resolve(file)
          })
      })

    return unzipped
  },

  getManifest = (unzipped: Unzipped) => {
    const file = strFromU8(unzipped['manifest.json'], false),
      manifest: LottieManifest = JSON.parse(file)

    if (!('animations' in manifest)) {
      throw new Error('Manifest not found')
    }
    if (manifest.animations.length === 0) {
      throw new Error('No animations listed in manifest')
    }

    return manifest
  },

  prepareString = (str: string) =>
    str
      .replaceAll(new RegExp(/"""/, 'g'), '""')
      .replaceAll(/(["'])(.*?)\1/g, (
        _match, quote: string, content: string
      ) => {
        // Avoid aggressive sanitization here — it mangled text layers and expressions.
        return `${quote}${content}${quote}`
      })

export async function getLottieJSON(resp: Response) {
  const unzipped = await unzip(resp),
    manifest = getManifest(unzipped),
    data = [],
    toResolve: Promise<void>[] = [],
    { length } = manifest.animations

  /**
   * Check whether dotLottie is v.1.0 or v.2.0: if animations folder is abbreviated.
   */
  let animationsFolder = 'animations'

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (manifest.version === '2' || unzipped[`a/${manifest.animations[0]?.id}.json`]) {
    animationsFolder = 'a'
  }

  for (let i = 0; i < length; i++) {
    const str = strFromU8(unzipped[`${animationsFolder}/${manifest.animations[i]?.id}.json`]),
      lottie: AnimationData = JSON.parse(prepareString(str))

    // Handle Expressions
    const { length: jLen } = lottie.layers

    for (let j = 0; j < jLen; j++) {
      const { ks: transform } = lottie.layers[j] ?? {},
        props = Object.keys(transform) as (keyof Shape)[],
        { length: pLen } = props

      for (let p = 0; p < pLen; p++) {
        const prop = transform[props[p]] as ExpressionProp | undefined,
          { e: isEncoded, x: expression } = prop ?? {}

        if (!expression || !isEncoded || !prop) {
          continue
        }

        // Base64 Decode to handle compression
        prop.x = atob(expression)
      }

    }

    toResolve.push(resolveAssets(unzipped, lottie.assets))
    data.push(lottie)
  }

  await Promise.all(toResolve)

  return {
    data,
    manifest,
  }
}