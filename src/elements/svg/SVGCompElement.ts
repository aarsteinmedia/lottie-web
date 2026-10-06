import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { KeyframeValueProperty } from '@/utils/properties/KeyframeValueProperty'

import { CompElement } from '@/elements/CompElement'
import { SVGBaseElement } from '@/elements/svg/SVGBaseElement'
import { SVGRendererBase } from '@/renderers/SVGRendererBase'
import { mixin } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

/**
 * A SVG pre-comp is a layer (SVGBaseElement) that also manages child layers
 * like a renderer does. It borrows that behavior from SVGRendererBase and CompElement.
 * Each list below drives both the type (interface) and the runtime copy (mixin).
 */
const rendererMethods = [
  'addPendingElement',
  'appendElementInPos',
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
  'findIndexByInd',
  'getElementById',
  'getElementByPath',
  'includeLayers',
  'initItems',
  'searchExtraCompositions',
  'setProjectInterface',
  'setupGlobalData',
  'updateContainerSize',
] as const satisfies readonly (keyof SVGRendererBase)[],
  compMethods = [
    'createContent',
    'destroy',
    'destroyElements',
    'getElements',
    'hide',
    'initElement',
    'prepareFrame',
    'renderFrame',
    'renderInnerContent',
    'setElements',
    'show',
  ] as const satisfies readonly (keyof CompElement)[]

// Declaration merging: tells the compiler about the methods mixed in at the bottom of this file.
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface SVGCompElement
  extends Pick<SVGRendererBase, typeof rendererMethods[number]>,
  Pick<CompElement, typeof compMethods[number]> {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class SVGCompElement extends SVGBaseElement {
  _debug?: boolean
  completeLayers = false
  currentFrame = 0
  elements: ElementInterfaceIntersect[]
  layers?: undefined | LottieLayer[]
  pendingElements: ElementInterfaceIntersect[] = []
  supports3d = true
  tm?: KeyframeValueProperty

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    super()
    this.layers = data.layers
    this.elements = this.layers ? createSizedArray(this.layers.length) : []

    this.initElement(
      data, globalData, comp
    )
    this.tm = (data.tm ? PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect, data.tm, 0, globalData.frameRate, this as unknown as ElementInterfaceIntersect
    ) : { _placeholder: true }) as KeyframeValueProperty
  }

  createComp(
    data: LottieLayer, _container?: HTMLElement, comp?: CompElementInterface
  ) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Cannot access global data`)
    }

    return new SVGCompElement(
      data,
      this.globalData,
      comp ?? this
    )
  }
}

mixin(
  SVGCompElement, SVGRendererBase, rendererMethods
)
mixin(
  SVGCompElement, CompElement, compMethods
)
