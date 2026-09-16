import type {
  ConvertParams, LottieManifest, Result
} from '@/types'

import { getFilename } from '@/utils'
import { createDotLottie } from '@/utils/dotLottie/createDotLottie'
import { createJSON } from '@/utils/dotLottie/createJSON'
import { getAnimationData } from '@/utils/dotLottie/getAnimationData'

export async function convert ({
  animations: animationsFromProps,
  currentAnimation = 0,
  filename: filenameFromProps,
  generator,
  isDotLottie,
  manifest,
  shouldDownload = true,
  src,
  typeCheck
}: ConvertParams): Promise<Result> {
  try {
    const toConvert = src

    if (!toConvert && !animationsFromProps?.length) {
      throw new Error('No animation to convert')
    }

    let animations = animationsFromProps

    if (!animations) {
      const animationData = await getAnimationData(toConvert)

      animations = animationData.animations ?? []
    }

    if (typeCheck || isDotLottie) {

      let filename = getFilename(filenameFromProps || toConvert || 'converted')

      if (animations.length > 1) {
        filename += `-${currentAnimation + 1}`
      }

      filename += '.json'

      return {
        result: createJSON({
          animation: animations[currentAnimation],
          filename,
          shouldDownload,
        }),
        success: true
      }
    }

    return {
      result: await createDotLottie({
        animations,
        filename: `${getFilename(filenameFromProps || toConvert || 'converted')}.lottie`,
        manifest: {
          ...manifest ?? manifest,
          generator,
          version: '2'
        } as LottieManifest,
        shouldDownload,
      }),
      success: true
    }
  } catch (error) {
    return {
      error: (error as Error).message,
      result: null,
      success: false,
    }
  }
}