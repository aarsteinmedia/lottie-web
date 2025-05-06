import type { GroupEffect } from '@/effects/EffectsManager'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  TransformCanvas,
} from '@/types'

import CVEffects from '@/elements/canvas/CVEffects'
import CVMaskElement from '@/elements/canvas/CVMaskElement'
import { effectTypes } from '@/elements/helpers/TransformElement'
import { getBlendMode } from '@/utils'
import {
  createCanvas,
  getLumaCanvas,
  loadLumaCanvas,
} from '@/utils/helpers/AssetManager'
import Matrix from '@/utils/Matrix'

const operationsMap = {
  1: 'source-in',
  2: 'source-out',
  3: 'source-in',
  4: 'source-out',
}

export default class CVBaseElement {
  _isFirstFrame?: boolean
  buffers: (HTMLCanvasElement | OffscreenCanvas)[] = []
  canvasContext?: CanvasRenderingContext2D
  comp?: ElementInterfaceIntersect
  currentTransform?: DOMMatrix
  data?: LottieLayer
  finalTransform?: Transformer
  globalData?: GlobalData
  hidden?: boolean
  isInRange?: boolean
  isTransparent?: boolean
  maskManager?: CVMaskElement
  mHelper = new Matrix()
  renderableEffectsManager?: CVEffects
  transformCanvas?: TransformCanvas
  transformEffects: GroupEffect[] = []
  destroy() {
    this.canvasContext = null as unknown as CanvasRenderingContext2D
    this.data = null as unknown as LottieLayer
    this.globalData = null as unknown as GlobalData
    this.maskManager?.destroy()
  }

  hideElement() {
    if (!this.hidden && (!this.isInRange || this.isTransparent)) {
      this.hidden = true
    }
  }

  showElement() {
    if (!this.maskManager) {
      throw new Error(`${this.constructor.name}: Method maskManager is not implemented`)
    }
    if (!this.isInRange || this.isTransparent) {
      return
    }
    this.hidden = false
    this._isFirstFrame = true
    this.maskManager._isFirstFrame = true
  }

  // initRendererElement() {
  //   // TODO: Pass through?
  //   throw new Error(
  //     `${this.constructor.name}: initRendererElement is not implemented`
  //   )
  // }
}

CVBaseElement.prototype.clearCanvas = function (canvasContext?:
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null) {
  canvasContext.clearRect(
    this.transformCanvas.tx,
    this.transformCanvas.ty,
    this.transformCanvas.w * this.transformCanvas.sx,
    this.transformCanvas.h * this.transformCanvas.sy
  )
}

CVBaseElement.prototype.createContainerElements = function () {
  // If the layer is masked we will use two buffers to store each different states of the drawing
  // This solution is not ideal for several reason. But unfortunately, because of the recursive
  // nature of the render tree, it's the only simple way to make sure one inner mask doesn't override an outer mask.
  // TODO: try to reduce the size of these buffers to the size of the composition contaning the layer
  // It might be challenging because the layer most likely is transformed in some way
  if (this.data.tt >= 1) {
    this.buffers = []
    const { canvasContext } = this.globalData
    const bufferCanvas = createCanvas(canvasContext.canvas.width,
      canvasContext.canvas.height)

    this.buffers.push(bufferCanvas)
    const bufferCanvas2 = createCanvas(canvasContext.canvas.width,
      canvasContext.canvas.height)

    this.buffers.push(bufferCanvas2)
    if (this.data.tt >= 3 && !document._isProxy) {
      loadLumaCanvas()
    }
  }
  this.canvasContext = this.globalData.canvasContext
  this.transformCanvas = this.globalData.transformCanvas
  this.renderableEffectsManager = new CVEffects(this)
  this.searchEffectTransforms()
}

CVBaseElement.prototype.createContent = function () {}
CVBaseElement.prototype.createElements = function () {}
CVBaseElement.prototype.createRenderableComponents = function () {
  this.maskManager = new CVMaskElement(this.data, this)
  this.transformEffects = this.renderableEffectsManager.getEffects(effectTypes.TRANSFORM_EFFECT)
}

CVBaseElement.prototype.exitLayer = function () {
  if (this.data.tt >= 1) {
    const buffer = this.buffers[1]
    // On the second buffer we store the current state of the global drawing
    // that only contains the content of this layer
    // (if it is a composition, it also includes the nested layers)
    const bufferCtx = buffer.getContext('2d')

    this.clearCanvas(bufferCtx)
    bufferCtx.drawImage(
      this.canvasContext.canvas, 0, 0
    )
    // We clear the canvas again
    this.canvasContext.setTransform(
      1, 0, 0, 1, 0, 0
    )
    this.clearCanvas(this.canvasContext)
    this.canvasContext.setTransform(this.currentTransform)
    // We draw the mask
    const mask = this.comp.getElementById('tp' in this.data ? this.data.tp : this.data.ind - 1)

    mask.renderFrame(true)
    // We draw the second buffer (that contains the content of this layer)
    this.canvasContext.setTransform(
      1, 0, 0, 1, 0, 0
    )

    // If the mask is a Luma matte, we need to do two extra painting operations
    // the _isProxy check is to avoid drawing a fake canvas in workers that will throw an error
    if (this.data.tt >= 3 && !document._isProxy) {
      // We copy the painted mask to a buffer that has a color matrix filter applied to it
      // that applies the rgb values to the alpha channel
      const lumaBuffer = getLumaCanvas(this.canvasContext.canvas)
      const lumaBufferCtx = lumaBuffer.getContext('2d')

      lumaBufferCtx.drawImage(
        this.canvasContext.canvas, 0, 0
      )
      this.clearCanvas(this.canvasContext)
      // we repaint the context with the mask applied to it
      this.canvasContext.drawImage(
        lumaBuffer, 0, 0
      )
    }
    this.canvasContext.globalCompositeOperation = operationsMap[this.data.tt]
    this.canvasContext.drawImage(
      buffer, 0, 0
    )
    // We finally draw the first buffer (that contains the content of the global drawing)
    // We use destination-over to draw the global drawing below the current layer
    this.canvasContext.globalCompositeOperation = 'destination-over'
    this.canvasContext.drawImage(
      this.buffers[0], 0, 0
    )
    this.canvasContext.setTransform(this.currentTransform)
    // We reset the globalCompositeOperation to source-over, the standard type of operation
    this.canvasContext.globalCompositeOperation = 'source-over'
  }
}

CVBaseElement.prototype.initRendererElement = function () {}

CVBaseElement.prototype.prepareLayer = function () {
  if (this.data.tt >= 1) {
    const buffer = this.buffers[0]
    const bufferCtx = buffer.getContext('2d')

    this.clearCanvas(bufferCtx)
    // on the first buffer we store the current state of the global drawing
    bufferCtx.drawImage(
      this.canvasContext.canvas, 0, 0
    )
    // The next four lines are to clear the canvas
    // TODO: Check if there is a way to clear the canvas without resetting the transform
    this.currentTransform = this.canvasContext.getTransform()
    this.canvasContext.setTransform(
      1, 0, 0, 1, 0, 0
    )
    this.clearCanvas(this.canvasContext)
    this.canvasContext.setTransform(this.currentTransform)
  }
}

CVBaseElement.prototype.renderFrame = function (forceRender?: boolean) {
  if (this.hidden || this.data.hd) {
    return
  }
  if (this.data.td === 1 && !forceRender) {
    return
  }
  this.renderTransform()
  this.renderRenderable()
  this.renderLocalTransform()
  this.setBlendMode()
  const forceRealStack = this.data.ty === 0

  this.prepareLayer()
  this.globalData.renderer.save(forceRealStack)
  this.globalData.renderer.ctxTransform(this.finalTransform.localMat.props)
  this.globalData.renderer.ctxOpacity(this.finalTransform.localOpacity)
  this.renderInnerContent()
  this.globalData.renderer.restore(forceRealStack)
  this.exitLayer()
  if (this.maskManager.hasMasks) {
    this.globalData.renderer.restore(true)
  }
  if (this._isFirstFrame) {
    this._isFirstFrame = false
  }
}

CVBaseElement.prototype.setBlendMode = function () {
  const { globalData } = this

  if (globalData.blendMode !== this.data.bm) {
    globalData.blendMode = this.data.bm
    const blendModeValue = getBlendMode(this.data.bm)

    globalData.canvasContext.globalCompositeOperation = blendModeValue
  }
}

CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement
CVBaseElement.prototype.show = CVBaseElement.prototype.showElement
