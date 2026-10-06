/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { CVBaseElement } from '@/elements/canvas/CVBaseElement'
import { CompElement } from '@/elements/CompElement'
import { CanvasRendererBase } from '@/renderers/CanvasRendererBase'
import { mixin } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

const rendererMethods = [
  'addPendingElement',
  'buildAllItems',
  'buildElementParenting',
  'buildItem',
  'checkLayers',
  'checkPendingElements',
  'configAnimation',
  'createAudio',
  'createCamera',
  'createFootage',
  'createImage',
  'createItem',
  'createNull',
  'createShape',
  'createSolid',
  'createText',
  'ctxFill',
  'ctxFillRect',
  'ctxFillStyle',
  'ctxLineCap',
  'ctxLineJoin',
  'ctxLineWidth',
  'ctxMiterLimit',
  'ctxOpacity',
  'ctxStroke',
  'ctxStrokeStyle',
  'ctxTransform',
  'getElementById',
  'getElementByPath',
  'includeLayers',
  'initItems',
  'reset',
  'restore',
  'save',
  'searchExtraCompositions',
  'setProjectInterface',
  'setupGlobalData',
  'syncDevicePixelRatio',
  'updateContainerSize',
] as const satisfies readonly (keyof CanvasRendererBase)[],
  canvasMethods = [
    'clearCanvas',
    'createContainerElements',
    'createContent',
    'createRenderableComponents',
    'exitLayer',
    'hide',
    'hideElement',
    'initRendererElement',
    'prepareLayer',
    'renderFrame',
    'setBlendMode',
    'show',
    'showElement'
  ] as const satisfies readonly (keyof CVBaseElement)[]

export interface CVCompElement
  extends Pick<CanvasRendererBase, typeof rendererMethods[number]>,
  Pick<CVBaseElement, typeof canvasMethods[number]> {}

export class CVCompElement extends CompElement {
  canvasContext?: CanvasRenderingContext2D
  pendingElements: ElementInterfaceIntersect[] = []

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    super()
    this.completeLayers = false
    this.layers = data.layers as LottieLayer[]
    this.elements = createSizedArray(this.layers.length)
    this.initElement(
      data, globalData, comp
    )
    this.tm = (
      data.tm
        ? PropertyFactory.getProp(
          this as unknown as ElementInterfaceIntersect,
          data.tm,
          0,
          globalData.frameRate,
          this as unknown as ElementInterfaceIntersect
        )
        : { _placeholder: true }
    ) as ValueProperty
  }

  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVCompElement(
      data, this.globalData, this
    )
  }

  override destroy() {
    const { length } = this.layers

    for (let i = length - 1; i >= 0; i--) {
      this.elements[i]?.destroy()
    }
    this.layers = null as unknown as LottieLayer[]
    this.elements = null as unknown as ElementInterfaceIntersect[]
  }

  /**
   * Canvas layers draw into the shared context and own no DOM node.
   * renderFrame and destroy are replaced by CVBaseElement's, so these
   * DOM hooks inherited via RenderableDOMElement are never called.
   */
  override destroyBaseElement() {
    // Intentionally empty
  }

  override renderElement() {
    // Intentionally empty
  }

  override renderInnerContent() {
    if (!this.data?.w || !this.data.h) {
      throw new Error(`${this.constructor.name} data (LottieLayer) is not implemented`)
    }

    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      canvasContext: ctx, completeLayers, data, elements, layers
    } = this

    if (!ctx) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(data.w || 0, 0)
    ctx.lineTo(data.w || 0, data.h || 0)
    ctx.lineTo(0, data.h || 0)
    ctx.lineTo(0, 0)
    ctx.clip()
    const { length } = layers

    for (let i = length - 1; i >= 0; i--) {
      if (completeLayers || elements[i]) {
        elements[i]?.renderFrame()
      }
    }
  }
}

mixin(
  CVCompElement, CanvasRendererBase, rendererMethods
)
mixin(
  CVCompElement, CVBaseElement, canvasMethods
)