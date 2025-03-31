import type {
  AnimationData,
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
    this.layers = data.layers || []
    this.supports3d = true
    this.completeLayers = false
    this.pendingElements = []
    this.elements = this.layers ? createSizedArray(this.layers.length) : []
    const {
      appendElementInPos,
      buildItem,
      checkPendingElements,
      configAnimation,
      createImage,
      createNull,
      createShape,
      createSolid,
      createText,
      destroy,
      findIndexByInd,
      hide,
      // renderFrame,
      // show,
    } = new SVGRendererBase()
    this.appendElementInPos = appendElementInPos
    this.buildItem = buildItem
    this.checkPendingElements = checkPendingElements
    this.configAnimation = configAnimation
    this.createImage = createImage
    this.createNull = createNull
    this.createShape = createShape
    this.createSolid = createSolid
    this.createText = createText
    this.destroy = destroy
    this.findIndexByInd = findIndexByInd
    this.hide = hide
    // this.renderFrame = renderFrame
    // this.show = show
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

  appendElementInPos(_element: ElementInterfaceIntersect, _pos: number) {
    throw new Error(
      `${this.constructor.name}: Method appendElementInPos is not impelemented`
    )
  }

  buildItem(_pos: number) {
    throw new Error(
      `${this.constructor.name}: Method buildItem is not impelemented`
    )
  }

  checkPendingElements() {
    throw new Error(
      `${this.constructor.name}: Method checkPendingElements is not impelemented`
    )
  }

  configAnimation(_data: AnimationData) {
    throw new Error(
      `${this.constructor.name}: Method configAnimation is not impelemented`
    )
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

  createImage(_data: LottieLayer) {
    throw new Error(
      `${this.constructor.name}: Method createImage is not impelemented`
    )
  }

  createNull(_data: LottieLayer) {
    throw new Error(
      `${this.constructor.name}: Method createNull is not impelemented`
    )
  }

  createShape(_data: LottieLayer) {
    throw new Error(
      `${this.constructor.name}: Method createShape is not impelemented`
    )
  }

  createSolid(_data: LottieLayer) {
    throw new Error(
      `${this.constructor.name}: Method createSolid is not impelemented`
    )
  }

  createText(_data: LottieLayer) {
    throw new Error(
      `${this.constructor.name}: Method createText is not impelemented`
    )
  }

  findIndexByInd(_ind: number) {
    throw new Error(
      `${this.constructor.name}: Method findIndexByInd is not impelemented`
    )
  }
}

for (const proto of Object.getOwnPropertyNames(SVGRendererBase.prototype)) {
  console.log(proto)
}

extendPrototype([CompElement], SVGCompElement)
