import type CVContextData from '@/elements/canvas/CVContextData'
import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type {
  AnimationData,
  CanvasRendererConfig,
  ElementInterfaceIntersect,
  LottieLayer,
  TransformCanvas,
} from '@/types'

import CVImageElement from '@/elements/canvas/CVImageElement'
import CVShapeElement from '@/elements/canvas/CVShapeElement'
import CVSolidElement from '@/elements/canvas/CVSolidElement'
import CVTextElement from '@/elements/canvas/CVTextElement'
import BaseRenderer from '@/renderers/BaseRenderer'
import SVGRenderer from '@/renderers/SVGRenderer'
import { createTag } from '@/utils'
import { PreserveAspectRatio } from '@/utils/enums'
import { createSizedArray } from '@/utils/helpers/arrays'

export default class CanvasRendererBase extends BaseRenderer {
  canvasContext?: null | CanvasRenderingContext2D
  contextData?: CVContextData
  destroyed?: boolean
  renderConfig?: CanvasRendererConfig
  transformCanvas?: TransformCanvas

  constructor() {
    super()
    const { createNull } = SVGRenderer.prototype

    this.createNull = createNull
  }

  override buildItem(pos: number) {
    const { elements, layers } = this

    if (elements[pos] || layers[pos].ty === 99) {
      return
    }
    /**
     * This, this.globalData.
     */
    const element = this.createItem(layers[pos])

    elements[pos] = element as ElementInterfaceIntersect
    element.initExpressions()
    /* if(this.layers[pos].ty === 0){
        element.resize(this.globalData.transformCanvas);
    } */
  }

  override checkPendingElements() {
    while (this.pendingElements.length > 0) {
      const element = this.pendingElements.pop()

      element?.checkParenting()
    }
  }

  configAnimation(animData: AnimationData) {
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: animationItem is not implemented`)
    }
    if (!this.renderConfig) {
      throw new Error(`${this.constructor.name}: renderConfig is not implemented`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    if (this.animationItem.wrapper) {
      this.animationItem.container = createTag('canvas')
      const containerStyle = this.animationItem.container.style

      containerStyle.width = '100%'
      containerStyle.height = '100%'
      const origin = '0px 0px 0px'

      containerStyle.transformOrigin = origin
      containerStyle.contentVisibility = this.renderConfig.contentVisibility
      this.animationItem.wrapper.appendChild(this.animationItem.container)
      this.canvasContext = this.animationItem.container.getContext('2d')
      if (this.renderConfig.className) {
        this.animationItem.container.className = this.renderConfig.className
      }
      if (this.renderConfig.id) {
        this.animationItem.container.id = this.renderConfig.id
      }
    } else {
      this.canvasContext = this.renderConfig.context
    }
    this.contextData?.setContext(this.canvasContext)
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
    this.setupGlobalData(animData, document.body)
    this.globalData.canvasContext = this.canvasContext
    this.globalData.renderer = this as unknown as CanvasRenderer
    this.globalData.isDashed = false
    this.globalData.progressiveLoad = this.renderConfig.progressiveLoad
    this.globalData.transformCanvas = this.transformCanvas
    this.elements = createSizedArray(animData.layers.length)

    this.updateContainerSize()
  }

  override createImage(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVImageElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createShape(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVShapeElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createSolid(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVSolidElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createText(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVTextElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  ctxFill(rule?: CanvasFillRule) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.fill(rule)
  }

  ctxFillRect(
    x: number, y: number, w: number, h: number
  ) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.fillRect(
      x, y, w, h
    )
  }

  ctxFillStyle(value = '') {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.fillStyle = value
  }

  ctxLineCap(value: CanvasLineCap) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.lineCap = value
  }

  ctxLineJoin(value: CanvasLineJoin) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.lineJoin = value
  }

  ctxLineWidth(value: number) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.lineWidth = value
  }

  ctxMiterLimit(value: number) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.miterLimit = value
  }

  ctxOpacity(op = 0) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.globalAlpha *= op < 0 ? 0 : op
  }

  ctxStroke() {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.stroke()
  }

  ctxStrokeStyle(value = '') {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    this.canvasContext.strokeStyle = value
  }

  ctxTransform(props: Float32Array) {
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    if (
      props[0] === 1 &&
      props[1] === 0 &&
      props[4] === 0 &&
      props[5] === 1 &&
      props[12] === 0 &&
      props[13] === 0
    ) {
      return
    }
    this.canvasContext.transform(
      props[0],
      props[1],
      props[4],
      props[5],
      props[12],
      props[13]
    )
  }

  destroy() {
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: animationItem is not implemented`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    if (this.renderConfig?.clearCanvas && this.animationItem.wrapper) {
      this.animationItem.wrapper.innerText = ''
    }
    const { length } = this.layers

    for (let i = length - 1; i >= 0; i -= 1) {
      this.elements[i]?.destroy?.()
    }
    this.elements.length = 0
    this.globalData.canvasContext = null
    this.animationItem.container = null as unknown as HTMLCanvasElement
    this.destroyed = true
  }

  hide() {
    if (!this.animationItem?.container) {
      throw new Error(`${this.constructor.name}: animationItem -> container is not implemented`)
    }
    this.animationItem.container.style.display = 'none'
  }

  renderFrame(num: number, forceRender?: boolean) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: animationItem is not implemented`)
    }

    if (
      this.renderedFrame === num &&
      this.renderConfig?.clearCanvas === true &&
      !forceRender ||
      this.destroyed ||
      num === -1
    ) {
      return
    }
    this.renderedFrame = num
    this.globalData.frameNum = num - Number(this.animationItem._isFirstFrame)
    this.globalData.frameId++
    this.globalData._mdf = !this.renderConfig?.clearCanvas || forceRender
    this.globalData.projectInterface.currentFrame = num

    const { length } = this.layers

    if (!this.completeLayers) {
      this.checkLayers(num)
    }

    for (let i = length - 1; i >= 0; i--) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].prepareFrame(num - this.layers[i].st)
      }
    }
    if (this.globalData._mdf) {
      if (this.renderConfig?.clearCanvas === true) {
        this.canvasContext?.clearRect(
          0,
          0,
          this.transformCanvas?.w || 0,
          this.transformCanvas?.h || 0
        )
      } else {
        this.save()
      }
      for (let i = length - 1; i >= 0; i--) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].renderFrame()
        }
      }
      if (this.renderConfig?.clearCanvas !== true) {
        this.restore()
      }
    }
  }

  reset() {
    if (!this.renderConfig?.clearCanvas) {
      this.canvasContext?.restore()

      return
    }
    this.contextData?.reset()
  }

  restore(actionFlag?: boolean) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.renderConfig?.clearCanvas) {
      this.canvasContext?.restore()

      return
    }
    if (actionFlag) {
      this.globalData.blendMode = 'source-over'
    }
    this.contextData?.restore(actionFlag)
  }

  save(_flag?: boolean) {
    this.canvasContext?.save()
  }

  show() {
    if (!this.animationItem?.container) {
      throw new Error(`${this.constructor.name}: animationItem -> container is not implemented`)
    }
    this.animationItem.container.style.display = 'block'
  }

  updateContainerSize(width?: number, height?: number) {
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: animationItem is not implemented`)
    }
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    if (!this.renderConfig?.dpr) {
      throw new Error(`${this.constructor.name}: renderConfig -> dpr is not implemented`)
    }
    if (!this.transformCanvas) {
      throw new Error(`${this.constructor.name}: transformCanvas is not implemented`)
    }

    this.reset()
    let elementWidth, elementHeight

    if (width) {
      elementWidth = width
      elementHeight = Number(height)
      this.canvasContext.canvas.width = elementWidth
      this.canvasContext.canvas.height = elementHeight
    } else {
      if (this.animationItem.wrapper && this.animationItem.container) {
        elementWidth = this.animationItem.wrapper.offsetWidth
        elementHeight = this.animationItem.wrapper.offsetHeight
      } else {
        elementWidth = this.canvasContext.canvas.width
        elementHeight = this.canvasContext.canvas.height
      }
      this.canvasContext.canvas.width = elementWidth * this.renderConfig.dpr
      this.canvasContext.canvas.height = elementHeight * this.renderConfig.dpr
    }

    let elementRel, animationRel

    if (
      this.renderConfig.preserveAspectRatio.includes('meet') ||
      this.renderConfig.preserveAspectRatio.includes('slice')
    ) {
      const par = this.renderConfig.preserveAspectRatio.split(' '),
        fillType = par[1] || 'meet',
        pos = par[0] || 'xMidYMid',
        xPos = pos.slice(0, 4),
        yPos = pos.slice(4)

      elementRel = elementWidth / elementHeight
      animationRel = this.transformCanvas.w / this.transformCanvas.h
      if (
        animationRel > elementRel && fillType === 'meet' ||
        animationRel < elementRel && fillType === 'slice'
      ) {
        this.transformCanvas.sx =
          elementWidth / (this.transformCanvas.w / this.renderConfig.dpr)
        this.transformCanvas.sy =
          elementWidth / (this.transformCanvas.w / this.renderConfig.dpr)
      } else {
        this.transformCanvas.sx =
          elementHeight / (this.transformCanvas.h / this.renderConfig.dpr)
        this.transformCanvas.sy =
          elementHeight / (this.transformCanvas.h / this.renderConfig.dpr)
      }

      if (
        xPos === 'xMid' &&
        (animationRel < elementRel && fillType === 'meet' ||
          animationRel > elementRel && fillType === 'slice')
      ) {
        this.transformCanvas.tx =
          (elementWidth -
            this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) /
            2 *
            this.renderConfig.dpr
      } else if (
        xPos === 'xMax' &&
        (animationRel < elementRel && fillType === 'meet' ||
          animationRel > elementRel && fillType === 'slice')
      ) {
        this.transformCanvas.tx =
          (elementWidth -
            this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) *
            this.renderConfig.dpr
      } else {
        this.transformCanvas.tx = 0
      }
      if (
        yPos === 'YMid' &&
        (animationRel > elementRel && fillType === 'meet' ||
          animationRel < elementRel && fillType === 'slice')
      ) {
        this.transformCanvas.ty =
          (elementHeight -
            this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) /
            2 *
            this.renderConfig.dpr
      } else if (
        yPos === 'YMax' &&
        (animationRel > elementRel && fillType === 'meet' ||
          animationRel < elementRel && fillType === 'slice')
      ) {
        this.transformCanvas.ty =
          (elementHeight -
            this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) *
            this.renderConfig.dpr
      } else {
        this.transformCanvas.ty = 0
      }
    } else if (this.renderConfig.preserveAspectRatio === PreserveAspectRatio.Initial) {
      this.transformCanvas.sx =
        elementWidth / (this.transformCanvas.w / this.renderConfig.dpr)
      this.transformCanvas.sy =
        elementHeight / (this.transformCanvas.h / this.renderConfig.dpr)
      this.transformCanvas.tx = 0
      this.transformCanvas.ty = 0
    } else {
      this.transformCanvas.sx = this.renderConfig.dpr
      this.transformCanvas.sy = this.renderConfig.dpr
      this.transformCanvas.tx = 0
      this.transformCanvas.ty = 0
    }
    this.transformCanvas.props = [
      this.transformCanvas.sx,
      0,
      0,
      0,
      0,
      this.transformCanvas.sy,
      0,
      0,
      0,
      0,
      1,
      0,
      this.transformCanvas.tx,
      this.transformCanvas.ty,
      0,
      1,
    ] as unknown as Float32Array

    this.ctxTransform(this.transformCanvas.props)
    this.canvasContext.beginPath()
    this.canvasContext.rect(
      0,
      0,
      this.transformCanvas.w,
      this.transformCanvas.h
    )
    this.canvasContext.closePath()
    this.canvasContext.clip()

    this.renderFrame(this.renderedFrame, true)
  }
}
