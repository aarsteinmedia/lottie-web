import type HCameraElement from '@/elements/html/HCameraElement'
import type { AnimationItem } from '@/Lottie'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  HTMLRendererConfig,
  LottieLayer,
} from '@/types'

import HCompElement from '@/elements/html/HCompElement'
import SVGCompElement from '@/elements/svg/SVGCompElement'
import HybridRendererBase from '@/renderers/HybridRendererBase'
import { RendererType } from '@/utils/enums'

export default class HybridRenderer extends HybridRendererBase {
  constructor(animationItem: AnimationItem, config?: HTMLRendererConfig) {
    super(animationItem, config)
    this.animationItem = animationItem
    this.layers = null as unknown as LottieLayer[]
    this.renderedFrame = -1
    this.renderConfig = {
      className: config && config.className || '',
      filterSize: {
        height:
          config?.filterSize.height || '400%',
        width:
          config?.filterSize.width || '400%',
        x: config?.filterSize.x || '-100%',
        y: config?.filterSize.y || '-100%',
      },
      hideOnTransparent: !(config && config.hideOnTransparent === false),
      imagePreserveAspectRatio:
        config && config.imagePreserveAspectRatio || 'xMidYMid slice',
      runExpressions:
        !config || config.runExpressions === undefined || config.runExpressions,
    }
    this.globalData = {
      _mdf: false,
      frameNum: -1,
      renderConfig: this.renderConfig,
    } as GlobalData
    this.pendingElements = []
    this.elements = []
    this.threeDElements = []
    this.destroyed = false
    this.camera = null as unknown as HCameraElement
    this.supports3d = true
    this.rendererType = RendererType.HTML
  }
  override createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.supports3d) {
      return new SVGCompElement(
        data,
        this.globalData,
        this as unknown as ElementInterfaceIntersect
      )
    }

    return new HCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }
}
