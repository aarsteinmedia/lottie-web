import type {
  AnimatedContent,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  SVGElementInterface,
  Transformer,
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

import { SVGStyleData } from '@/elements/helpers/shapes'
// import CompElement from '@/elements/CompElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'
// import SVGRendererBase from '@/renderers/SVGRendererBase'
// import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'
import { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers'
export default class SVGCompElement extends SVGBaseElement {
  _debug?: boolean
  animatedContents: AnimatedContent[]
  completeLayers: boolean
  elements: ElementInterfaceIntersect[]
  layers: LottieLayer[]
  pendingElements: ElementInterfaceIntersect[]
  shapeModifiers: ShapeModifierInterface[]
  stylesList: SVGStyleData[]
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
      animatedContents,
      createContent,
      filterUniqueShapes,
      renderInnerContent,
      renderModifiers,
      renderShape,
      searchShapes,
      shapeModifiers,
      shapesData,
      stylesList,
    } = new SVGShapeElement(data, globalData, comp)
    this.animatedContents = animatedContents
    this.createContent = createContent
    this.filterUniqueShapes = filterUniqueShapes
    this.renderInnerContent = renderInnerContent
    this.renderModifiers = renderModifiers
    this.renderShape = renderShape
    this.searchShapes = searchShapes
    this.shapesData = shapesData
    this.shapeModifiers = shapeModifiers
    this.stylesList = stylesList
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

  filterUniqueShapes() {
    throw new Error(
      `${this.constructor.name}: Method filterUniqueShapes is not impelemented`
    )
  }

  renderModifiers() {
    throw new Error(
      `${this.constructor.name}: Method renderModifiers is not impelemented`
    )
  }

  renderShape() {
    throw new Error(
      `${this.constructor.name}: Method renderShape is not impelemented`
    )
  }

  searchShapes(
    _arr: Shape[],
    _itemsData: SVGElementInterface[],
    _prevViewData: SVGElementInterface[],
    _container: SVGGElement,
    _level: number,
    _transformers: Transformer[],
    _renderFromProps: boolean
  ) {
    throw new Error(
      `${this.constructor.name}: Method searchShapes is not impelemented`
    )
  }
}

// extendPrototype([SVGRendererBase, CompElement], SVGCompElement)
