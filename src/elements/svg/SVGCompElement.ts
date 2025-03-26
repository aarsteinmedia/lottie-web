import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

import CompElement from '@/elements/CompElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

export default class SVGCompElement extends SVGBaseElement {
  _debug?: boolean
  completeLayers: boolean
  elements: ElementInterfaceIntersect[]
  layers: LottieLayer[]
  pendingElements: ElementInterfaceIntersect[]
  supports3d: boolean
  tm?: KeyframedValueProperty
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.layers = data.layers!
    this.supports3d = true
    this.completeLayers = false
    this.pendingElements = []
    this.elements = this.layers ? createSizedArray(this.layers.length) : []
    this.initElement(data, globalData, comp)
    this.tm = (
      data.tm
        ? PropertyFactory(
            this as unknown as ElementInterfaceIntersect,
            data.tm,
            0,
            globalData.frameRate,
            this as unknown as ElementInterfaceIntersect
          )
        : { _placeholder: true }
    ) as KeyframedValueProperty
  }

  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Cannot access global data`)
    }
    return new SVGCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }
}

extendPrototype([SVGRendererBase, CompElement], SVGCompElement)
