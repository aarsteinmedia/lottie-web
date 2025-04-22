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
      className: (config && config.className) || '',
      clearCanvas:
        config?.clearCanvas === undefined ? true : config.clearCanvas,
      contentVisibility: (config && config.contentVisibility) || 'visible',
      context: config?.context || null,
      id: (config && config.id) || '',
      imagePreserveAspectRatio:
        (config && config.imagePreserveAspectRatio) ||
        PreserveAspectRatio.Cover,
      preserveAspectRatio:
        (config && config.preserveAspectRatio) || PreserveAspectRatio.Contain,
      progressiveLoad: (config && config.progressiveLoad) || false,
      runExpressions:
        !config || config.runExpressions === undefined || config.runExpressions,
    }
    this.renderConfig.dpr = (config && config.dpr) || 1
    if (this.animationItem.wrapper) {
      this.renderConfig.dpr =
        (config && config.dpr) || window.devicePixelRatio || 1
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
      this.ctxTransform = this.contextData.transform.bind(
        this.contextData
      ) as any
      this.ctxOpacity = this.contextData.opacity.bind(this.contextData)
      this.ctxFillStyle = this.contextData.fillStyle.bind(this.contextData)
      this.ctxStrokeStyle = this.contextData.strokeStyle.bind(this.contextData)
      this.ctxLineWidth = this.contextData.lineWidth.bind(
        this.contextData
      ) as any
      this.ctxLineCap = this.contextData.lineCap.bind(this.contextData)
      this.ctxLineJoin = this.contextData.lineJoin.bind(this.contextData)
      this.ctxMiterLimit = this.contextData.miterLimit.bind(
        this.contextData
      ) as any
      this.ctxFill = this.contextData.fill.bind(this.contextData)
      this.ctxFillRect = this.contextData.fillRect.bind(this.contextData)
      this.ctxStroke = this.contextData.stroke.bind(this.contextData)
      this.save = this.contextData.save.bind(this.contextData)
    }
  }

  override createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor}: globalData is not implemented`)
    }
    return new CVCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }
}
