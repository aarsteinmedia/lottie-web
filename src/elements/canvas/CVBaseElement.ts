// @ts-nocheck
import type { GroupEffect } from '@/effects/EffectsManager'
import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  TransformCanvas,
  Transformer,
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
  clearCanvas(canvasContext?:
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null) {
    if (!this.transformCanvas) {
      throw new Error(`${this.constructor.name}: transformCanvas is not implemented`)
    }
    canvasContext?.clearRect(
      this.transformCanvas.tx,
      this.transformCanvas.ty,
      this.transformCanvas.w * this.transformCanvas.sx,
      this.transformCanvas.h * this.transformCanvas.sy
    )
  }
  createContainerElements() {
    // If the layer is masked we will use two buffers to store each different states of the drawing
    // This solution is not ideal for several reason. But unfortunately, because of the recursive
    // nature of the render tree, it's the only simple way to make sure one inner mask doesn't override an outer mask.
    // TODO: try to reduce the size of these buffers to the size of the composition contaning the layer
    // It might be challenging because the layer most likely is transformed in some way
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.globalData.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented in globalData`)
    }

    const matteMode = this.data.tt || 0

    if (matteMode >= 1) {
      this.buffers = []
      const { canvasContext } = this.globalData,
        bufferCanvas = createCanvas(canvasContext.canvas.width,
          canvasContext.canvas.height)

      this.buffers.push(bufferCanvas)
      const bufferCanvas2 = createCanvas(canvasContext.canvas.width,
        canvasContext.canvas.height)

      this.buffers.push(bufferCanvas2)
      if (matteMode >= 3 && !document._isProxy) {
        loadLumaCanvas()
      }
    }
    this.canvasContext = this.globalData.canvasContext
    this.transformCanvas = this.globalData.transformCanvas
    this.renderableEffectsManager = new CVEffects(this as unknown as ElementInterfaceIntersect)
    this.searchEffectTransforms()
  }
  createContent() {
    // TODO: Pass through?
    throw new Error(`${this.constructor.name}: createContent is not implemented`)
  }
  createElements() {
    // TODO: Pass through?
    throw new Error(`${this.constructor.name}: createElements is not implemented`)
  }
  createRenderableComponents() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }

    this.maskManager = new CVMaskElement(this.data, this)
    if (this.renderableEffectsManager) {
      this.transformEffects = this.renderableEffectsManager.getEffects(effectTypes.TRANSFORM_EFFECT)
    }
  }
  destroy() {
    this.canvasContext = null as unknown as CanvasRenderingContext2D
    this.data = null as unknown as LottieLayer
    this.globalData = null as unknown as GlobalData
    this.maskManager?.destroy()
  }
  exitLayer() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }

    const matteMode = this.data.tt || 0

    if (matteMode < 1) {
      return
    }
    const buffer = this.buffers[1]
    // On the second buffer we store the current state of the global drawing
    // that only contains the content of this layer
    // (if it is a composition, it also includes the nested layers)
    const bufferCtx = buffer.getContext('2d') as CanvasRenderingContext2D

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

    let maskId = Number(this.data.ind) - 1

    if ('tp' in this.data && this.data.tp !== undefined) {
      maskId = this.data.tp
    }
    // We draw the mask
    const mask = this.comp?.getElementById(maskId)

    mask?.renderFrame(true)
    // We draw the second buffer (that contains the content of this layer)
    this.canvasContext.setTransform(
      1, 0, 0, 1, 0, 0
    )

    // If the mask is a Luma matte, we need to do two extra painting operations
    // the _isProxy check is to avoid drawing a fake canvas in workers that will throw an error
    if (matteMode >= 3 && !document._isProxy) {
      // We copy the painted mask to a buffer that has a color matrix filter applied to it
      // that applies the rgb values to the alpha channel
      const lumaBuffer = getLumaCanvas(this.canvasContext.canvas),
        lumaBufferCtx = lumaBuffer.getContext('2d')

      lumaBufferCtx?.drawImage(
        this.canvasContext.canvas, 0, 0
      )
      this.clearCanvas(this.canvasContext)
      // we repaint the context with the mask applied to it
      this.canvasContext.drawImage(
        lumaBuffer, 0, 0
      )
    }
    this.canvasContext.globalCompositeOperation = operationsMap[
      matteMode as keyof typeof operationsMap
    ] as GlobalCompositeOperation
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
  hideElement() {
    if (!this.hidden && (!this.isInRange || this.isTransparent)) {
      this.hidden = true
    }
  }

  initRendererElement() {
    // TODO: Pass through?
    throw new Error(`${this.constructor.name}: initRendererElement is not implemented`)
  }
  prepareLayer() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }

    const matteMode = this.data.tt || 0

    if (matteMode < 1) {
      return
    }
    const buffer = this.buffers[0],
      bufferCtx = buffer.getContext('2d') as CanvasRenderingContext2D

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
  renderFrame(forceRender?: number) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }

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
    const shouldForceRealStack = this.data.ty === 0

    this.prepareLayer()

    const { renderer } = this.globalData as { renderer: CanvasRenderer }

    renderer.save(shouldForceRealStack)
    renderer.ctxTransform(this.finalTransform?.localMat.props as Float32Array)
    renderer.ctxOpacity(this.finalTransform?.localOpacity)
    this.renderInnerContent()
    renderer.restore(shouldForceRealStack)
    this.exitLayer()
    if (this.maskManager?.hasMasks) {
      renderer.restore(true)
    }
    if (this._isFirstFrame) {
      this._isFirstFrame = false
    }
  }

  renderInnerContent() {
    throw new Error(`${this.constructor.name}: Method renderInnerContent is not implemented`)
  }

  renderLocalTransform() {
    throw new Error(`${this.constructor.name}: Method renderLocalTransform is not implemented`)
  }

  renderRenderable() {
    throw new Error(`${this.constructor.name}: Method renderRenderable is not implemented`)
  }
  renderTransform() {
    throw new Error(`${this.constructor.name}: Method renderTransform is not implemented`)
  }
  searchEffectTransforms() {
    throw new Error(`${this.constructor.name}: Method searchEffectTransforms is not implemented`)
  }
  setBlendMode() {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    const { data, globalData } = this

    if (!globalData.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented in globalData`)
    }
    if (globalData.blendMode !== data.bm) {
      globalData.blendMode = data.bm as unknown as string
      const blendModeValue = getBlendMode(data.bm)

      globalData.canvasContext.globalCompositeOperation = blendModeValue as GlobalCompositeOperation
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
}
