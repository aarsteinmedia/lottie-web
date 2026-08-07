import type { AnimationItem } from '@/animation/AnimationItem'
import type {
  CanvasRendererConfig,
  GlobalData,
  LottieLayer,
} from '@/types'

import { CVCompElement } from '@/elements/canvas/CVCompElement'
import { CVContextData } from '@/elements/canvas/CVContextData'
import { CanvasRendererBase } from '@/renderers/CanvasRendererBase'
import { getDevicePixelRatio } from '@/utils'
import { PreserveAspectRatio, RendererType } from '@/utils/enums'
import { Matrix } from '@/utils/Matrix'

export class CanvasRenderer extends CanvasRendererBase {
  rendererType = RendererType.Canvas
  transformMat = new Matrix()

  constructor(animationItem: AnimationItem, config?: CanvasRendererConfig) {
    super()
    this.animationItem = animationItem
    this._dprLocked = typeof config?.dpr === 'number' && config.dpr > 0
    // With a managed wrapper we follow the display DPR; external contexts stay
    // at 1 unless the caller opts in via rendererSettings.dpr.
    const shouldUseDisplayDpr = this._dprLocked || Boolean(animationItem.wrapper)

    this.renderConfig = {
      className: config?.className || '',
      clearCanvas: config?.clearCanvas ?? true,
      contentVisibility: config?.contentVisibility || 'visible',
      context: config?.context ?? null,
      dpr: shouldUseDisplayDpr ? getDevicePixelRatio(config?.dpr) : 1,
      id: config?.id || '',
      imagePreserveAspectRatio:
          config?.imagePreserveAspectRatio || PreserveAspectRatio.Cover,
      preserveAspectRatio:
          config?.preserveAspectRatio || PreserveAspectRatio.Contain,
      progressiveLoad: Boolean(config?.progressiveLoad),
      runExpressions: config?.runExpressions ?? true,
    }
    if (!shouldUseDisplayDpr) {
      this._dprLocked = true
    }
    this.globalData = {
      _mdf: false,
      currentGlobalAlpha: -1,
      frameNum: -1,
      renderConfig: this.renderConfig,
    } as GlobalData
    this.contextData = new CVContextData()
    this.elements = []
    this.pendingElements = []
    this.completeLayers = false
    if (this.renderConfig.clearCanvas) {
      this.ctxTransform = this.contextData.transform.bind(this.contextData)
      this.ctxOpacity = this.contextData.opacity.bind(this.contextData)
      this.ctxFillStyle = this.contextData.fillStyle.bind(this.contextData)
      this.ctxStrokeStyle = this.contextData.strokeStyle.bind(this.contextData)
      this.ctxLineWidth = this.contextData.lineWidth.bind(this.contextData)
      this.ctxLineCap = this.contextData.lineCap.bind(this.contextData)
      this.ctxLineJoin = this.contextData.lineJoin.bind(this.contextData)
      this.ctxMiterLimit = this.contextData.miterLimit.bind(this.contextData)
      this.ctxFill = this.contextData.fill.bind(this.contextData)
      this.ctxFillRect = this.contextData.fillRect.bind(this.contextData)
      this.ctxStroke = this.contextData.stroke.bind(this.contextData)
      this.save = this.contextData.save.bind(this.contextData)
    }
  }

  override createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVCompElement(
      data,
      this.globalData,
      this
    )
  }
}
