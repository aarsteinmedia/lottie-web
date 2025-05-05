import type { AnimationData } from '@/Lottie'
import type { LottieLayer } from '@/types'

import CanvasRendererOriginal from '@/renderers/CanvasRenderer'
import { createTag } from '@/utils'
import { createSizedArray } from '@/utils/helpers/arrays'

export default class CanvasRenderer extends CanvasRendererOriginal {
  override configAnimation(animData: AnimationData) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (this.animationItem?.wrapper) {
      this.animationItem.container = createTag('canvas')
      const containerStyle = this.animationItem.container.style

      containerStyle.width = '100%'
      containerStyle.height = '100%'
      const origin = '0px 0px 0px'

      containerStyle.transformOrigin = origin
      this.animationItem.wrapper.appendChild(this.animationItem.container)
      this.canvasContext = this.animationItem.container.getContext('2d')
      if (this.renderConfig?.className) {
        this.animationItem.container.setAttribute('class',
          this.renderConfig.className)
      }
    } else {
      this.canvasContext = this.renderConfig?.context
    }
    this.data = animData as unknown as LottieLayer
    this.layers = animData.layers
    this.transformCanvas = {
      h: animData.h,
      sx: 0,
      sy: 0,
      tx: 0,
      ty: 0,
      w: animData.w,
    }
    this.globalData.frameId = 0
    this.globalData.frameRate = animData.fr
    this.globalData.nm = animData.nm
    this.globalData.compSize = {
      h: animData.h,
      w: animData.w,
    }
    this.globalData.canvasContext = this.canvasContext
    this.globalData.renderer = this
    this.globalData.isDashed = false
    this.globalData.progressiveLoad = this.renderConfig?.progressiveLoad
    this.globalData.transformCanvas = this.transformCanvas
    this.elements = createSizedArray(animData.layers.length)

    this.updateContainerSize()
  }
}
