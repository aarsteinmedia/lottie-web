import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

// import FrameElement from '@/elements/helpers/FrameElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
// import TransformElement from '@/elements/helpers/TransformElement'
// import CompElement from '@/elements/CompElement'
// import SVGBaseElement from '@/elements/svg/SVGBaseElement'
// import SVGRendererBase from '@/renderers/SVGRendererBase'
// import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

// import RenderableElement from '../helpers/RenderableElement'

// import HierarchyElement from '../helpers/HierarchyElement'

export default class SVGCompElement extends RenderableDOMElement {
  _debug?: boolean
  completeLayers: boolean
  elements: ElementInterfaceIntersect[]
  layers: LottieLayer[]
  pendingElements: ElementInterfaceIntersect[]
  // _mdf?: boolean
  supports3d: boolean
  tm?: KeyframedValueProperty
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    super()
    this.layers = data.layers!
    this.supports3d = true
    this.completeLayers = false
    this.pendingElements = []
    this.elements = this.layers ? createSizedArray(this.layers.length) : []
    // this.initRenderable = new RenderableElement().initRenderable
    // const { checkParenting, initHierarchy } = new HierarchyElement()
    // this.checkParenting = checkParenting
    // this.initHierarchy = initHierarchy
    // this.initTransform = new TransformElement().initTransform
    // this.initFrame = new FrameElement().initFrame
    // this.initElement = new RenderableDOMElement().initElement
    this.initElement(data, globalData, comp)
    this.tm = (
      data.tm
        ? PropertyFactory(
            this as any,
            data.tm as any,
            0,
            globalData.frameRate,
            this as any
          )
        : { _placeholder: true }
    ) as KeyframedValueProperty
  }

  // checkParenting() {
  //   throw new Error('SVGCompElement: Method checkParenting is not implemented')
  // }

  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Cannot access global data`)
    }
    return new SVGCompElement(data, this.globalData, this)
  }

  override createContent() {
    // Override
    // throw new Error('SVGCompElement: Method createContent is not implemented')
  }

  setMatte(_id: string) {
    throw new Error(
      `${this.constructor.name}: Method setMatte is not implemented`
    )
  }

  // destroy() {
  //   throw new Error('SVGCompElement: Method destroy is not implemented')
  // }

  // initElement(
  //   _data: LottieLayer,
  //   _globalData: GlobalData,
  //   _comp: ElementInterfaceIntersect
  // ) {
  //   throw new Error('SVGCompElement: Method initElement is not implemented')
  // }

  // initFrame() {
  //   throw new Error('SVGCompElement: Method initFrame not implemented')
  // }

  // initHierarchy() {
  //   throw new Error('SVGCompElement: Method initHierarchy is not implemented')
  // }

  // initRenderable() {
  //   throw new Error('SVGCompElement: Method initRenderable is not implemented')
  // }

  // initTransform() {
  //   throw new Error('SVGCompElement: Method initTransform is not implemented')
  // }

  // prepareFrame(_val: number) {
  //   throw new Error('SVGCompElement: Method prepareFrame is not implemented')
  // }

  // renderFrame() {
  //   throw new Error('SVGCompElement: Method renderFrame is not implemented')
  // }
}

// extendPrototype([SVGRendererBase, CompElement], SVGCompElement)
