import type {
  AnimationData,
  // AnimatedContent,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  SVGElementInterface,
  Transformer,
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

// import { SVGStyleData } from '@/elements/helpers/shapes'
// import CompElement from '@/elements/CompElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGRendererBase from '@/renderers/SVGRendererBase'
// import SVGShapeElement from '@/elements/svg/SVGShapeElement'
// import SVGRendererBase from '@/renderers/SVGRendererBase'
// import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

import CompElement from '../CompElement'
// import { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers'
export default class SVGCompElement extends SVGBaseElement {
  _debug?: boolean
  // animatedContents: AnimatedContent[]
  completeLayers: boolean
  elements: ElementInterfaceIntersect[]
  layers: LottieLayer[]
  pendingElements: ElementInterfaceIntersect[]
  // shapeModifiers: ShapeModifierInterface[]
  // stylesList: SVGStyleData[]
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
    // const {
    //   animatedContents,
    //   createContent,
    //   filterUniqueShapes,
    //   renderInnerContent,
    //   renderModifiers,
    //   renderShape,
    //   searchShapes,
    //   shapeModifiers,
    //   shapesData,
    //   stylesList,
    // } = new SVGShapeElement(data, globalData, comp)
    // this.animatedContents = animatedContents
    // this.createContent = createContent
    // this.filterUniqueShapes = filterUniqueShapes
    // this.renderInnerContent = renderInnerContent
    // this.renderModifiers = renderModifiers
    // this.renderShape = renderShape
    // this.searchShapes = searchShapes
    // this.shapesData = shapesData
    // this.shapeModifiers = shapeModifiers
    // this.stylesList = stylesList
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
      findIndexByInd,
      hide,
      renderFrame,
      show,
    } = new SVGRendererBase()
    const {
      destroy,
      destroyElements,
      getElements,
      initElement,
      prepareFrame,
      renderInnerContent,
      setElements,
    } = new CompElement()
    this.appendElementInPos = appendElementInPos
    this.buildItem = buildItem
    this.checkPendingElements = checkPendingElements
    this.configAnimation = configAnimation
    this.createImage = createImage
    this.createNull = createNull
    this.createShape = createShape
    this.createSolid = createSolid
    this.createText = createText
    this.findIndexByInd = findIndexByInd
    this.hide = hide
    this.renderFrame = renderFrame
    this.show = show
    this.destroy = destroy
    this.destroyElements = destroyElements
    this.getElements = getElements
    this.initElement = initElement
    this.prepareFrame = prepareFrame
    this.renderInnerContent = renderInnerContent
    this.setElements = setElements
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

  destroyElements() {
    throw new Error(
      `${this.constructor.name}: Method destroyElements is not impelemented`
    )
  }

  filterUniqueShapes() {
    throw new Error(
      `${this.constructor.name}: Method filterUniqueShapes is not impelemented`
    )
  }

  findIndexByInd(_ind: number) {
    throw new Error(
      `${this.constructor.name}: Method findIndexByInd is not impelemented`
    )
  }

  getElements() {
    throw new Error(
      `${this.constructor.name}: Method getElements is not impelemented`
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

  setElements(_elems: ElementInterfaceIntersect[]) {
    throw new Error(
      `${this.constructor.name}: Method setElements is not impelemented`
    )
  }
}

// extendPrototype([SVGRendererBase, CompElement], SVGCompElement)
