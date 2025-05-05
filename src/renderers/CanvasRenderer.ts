import type AnimationItem from '@/animation/AnimationItem'
import type {
  CanvasRendererConfig,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import CVCompElement from '@/elements/canvas/CVCompElement'
import CVContextData from '@/elements/canvas/CVContextData'
import { PreserveAspectRatio, RendererType } from '@/enums'
import CanvasRendererBase from '@/renderers/CanvasRendererBase'
import Matrix from '@/utils/Matrix'

export default class CanvasRenderer extends CanvasRendererBase {
  rendererType: RendererType
  transformMat: Matrix

  constructor(animationItem: AnimationItem, config?: CanvasRendererConfig) {
    super()
    this.animationItem = animationItem
    this.renderConfig = {
      className: config?.className || '',
      clearCanvas: config?.clearCanvas ?? true,
      contentVisibility: config?.contentVisibility || 'visible',
      context: config?.context ?? null,
      dpr: config?.dpr ?? 1,
      id: config?.id || '',
      imagePreserveAspectRatio:
        config?.imagePreserveAspectRatio || PreserveAspectRatio.Cover,
      preserveAspectRatio:
        config?.preserveAspectRatio || PreserveAspectRatio.Contain,
      progressiveLoad: Boolean(config?.progressiveLoad),
      runExpressions: config?.runExpressions ?? true,
    }
    if (this.animationItem.wrapper) {
      this.renderConfig.dpr = config?.dpr || window.devicePixelRatio || 1
    }
    this.renderedFrame = -1
    this.globalData = {
      _mdf: false,
      currentGlobalAlpha: -1,
      frameNum: -1,
      renderConfig: this.renderConfig,
    } as GlobalData
    this.contextData = new CVContextData()
    this.elements = []
    this.pendingElements = []
    this.transformMat = new Matrix()
    this.completeLayers = false
    this.rendererType = RendererType.Canvas
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
      this as unknown as ElementInterfaceIntersect
    )
  }
}
