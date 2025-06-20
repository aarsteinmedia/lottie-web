import type {
  ConvertParams, LottieManifest, Result
} from '@/types'

import { getFilename } from '@/utils'
import createDotLottie from '@/utils/dotLottie/createDotLottie'
import createJSON from '@/utils/dotLottie/createJSON'
import getAnimationData from '@/utils/dotLottie/getAnimationData'

export default async function convert ({
  animations: animationsFromProps,
  currentAnimation = 0,
  fileName: fileNameFromProps,
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

      let fileName = getFilename(fileNameFromProps || toConvert || 'converted')

      if (animations.length > 1) {
        fileName += `-${currentAnimation + 1}`
      }

      fileName += '.json'

      return {
        result: createJSON({
          animation: animations[currentAnimation],
          fileName,
          shouldDownload,
        }),
        success: true
      }
    }

    return {
      result: await createDotLottie({
        animations,
        fileName: `${getFilename(fileNameFromProps || toConvert || 'converted')}.lottie`,
        manifest: {
          ...manifest ?? manifest,
          generator,
        } as LottieManifest,
        shouldDownload,
      }),
      success: true
    }
  } catch (error) {
    return {
      error: (error as Error).message,
      success: false,
    }
  }
}