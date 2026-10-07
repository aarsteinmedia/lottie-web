import type { AnimationData, LottieManifest } from '@/types'

import { devError, getExt } from '@/utils'
import { getLottieJSON } from '@/utils/dotLottie/getLottieJSON'

const _isZipStream = async (response: Response) => {
    const reader = response.clone().body?.getReader()
    const { value } = await reader?.read() ?? {}

    await reader?.cancel() // Clean up stream

    if (!value || value.length < 4) {
      return false
    }

    return (
      value[0] === 0x50 &&
      value[1] === 0x4b &&
      (
        value[2] === 0x03 && value[3] === 0x04 ||
        value[2] === 0x05 && value[3] === 0x06 ||
        value[2] === 0x07 && value[3] === 0x08
      )
    )
  },
  _isJSON = async (response: Response) => {
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.toLowerCase().includes('json')) {
      return true
    }

    if (contentType.toLowerCase().includes('zip') || await _isZipStream(response)) {
      return false
    }

    return true
  }

export async function getAnimationData(input: unknown): Promise<{
  animations?: undefined | AnimationData[]
  manifest: LottieManifest | null
  isDotLottie: boolean
}> {
  try {
    if (!input || typeof input !== 'string' && typeof input !== 'object') {
      throw new Error('Broken file or invalid file format')
    }

    if (typeof input !== 'string') {
      const animations = Array.isArray(input) ? input : [input]

      return {
        animations,
        isDotLottie: false,
        manifest: null,
      }
    }

    const result = await fetch(input, { headers: { 'Accept': 'application/json' } })

    if (!result.ok) {
      const error = new Error(result.statusText)

      throw error
    }

    /**
     * Check if file is JSON, first by parsing headers for content-type,
     * than by parsing filename, then – if filename has no extension – by
     * cloning the response and parsing response for content.
     */
    const isJSON = await _isJSON(result)

    if (isJSON) {
      const ext = getExt(input)

      if (ext === 'json') {
        const lottie = await result.json()

        return {
          animations: [lottie],
          isDotLottie: false,
          manifest: null,
        }
      }
      const text = await result.clone().text()

      try {
        const lottie = JSON.parse(text)

        return {
          animations: [lottie],
          isDotLottie: false,
          manifest: null,
        }

      } catch (error) {
        /* empty */
      }
    }

    const { data, manifest } = await getLottieJSON(result)

    return {
      animations: data,
      isDotLottie: true,
      manifest,
    }
  } catch (error) {
    devError(error)

    return {
      animations: undefined,
      isDotLottie: false,
      manifest: null,
    }
  }
}