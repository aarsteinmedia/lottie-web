import type {
  AnimatedContent,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'

import {
  ShapeGroupData,
  SVGFillStyleData,
  SVGGradientFillStyleData,
  SVGGradientStrokeStyleData,
  SVGNoStyleData,
  SVGShapeData,
  SVGStrokeStyleData,
  SVGStyleData,
  SVGTransformData,
} from '@/elements/helpers/shapes'
import ShapeElement from '@/elements/ShapeElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import { lineCapEnum, lineJoinEnum } from '@/enums'
import { createRenderFunction } from '@/renderers/SVGElementsRenderer'
import { getBlendMode } from '@/utils'
import { getLocationHref } from '@/utils/getterSetter'
import RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import { getModifier } from '@/utils/shapes/ShapeModifiers' // type ShapeModifierInterface,
import { getShapeProp, type ShapeProperty } from '@/utils/shapes/ShapeProperty'
import TrimModifier from '@/utils/shapes/TrimModifier'
import TransformProperty from '@/utils/TransformProperty'
export default class SVGShapeElement extends ShapeElement {
  _debug?: boolean
  animatedContents: AnimatedContent[]
  prevViewData: SVGElementInterface[]
  stylesList: SVGStyleData[]
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    // List of drawable elements
    this.shapes = []
    // Full shape data
    this.shapesData = data.shapes || []
    // List of styles that will be applied to shapes
    this.stylesList = []
    // List of modifiers that will be applied to shapes
    this.shapes = []
    // List of items in shape tree
    this.itemsData = []
    // List of items in previous shape tree
    this.processedElements = []
    // List of animated components
    this.animatedContents = []
    const {
      createContainerElements,
      createRenderableComponents,
      destroyBaseElement,
      getBaseElement,
      getMatte,
      initRendererElement,
      renderElement,
      setMatte,
    } = new SVGBaseElement()
    // this.searchShapes = this.searchShapes.bind(this) // TODO: Evaluate this
    // this.renders = this.renders.bind(this)
    this.createContainerElements = createContainerElements
    this.createRenderableComponents = createRenderableComponents
    this.destroyBaseElement = destroyBaseElement
    this.getBaseElement = getBaseElement
    this.initRendererElement = initRendererElement
    this.renderElement = renderElement
    this.getMatte = getMatte
    this.setMatte = setMatte
    this.initElement(data, globalData, comp)
    // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
    // List of elements that have been created
    this.prevViewData = []
    // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
  }
  addToAnimatedContents(data: Shape, element: SVGElementInterface) {
    let i = 0
    const len = this.animatedContents.length
    while (i < len) {
      if (this.animatedContents[i].element === element) {
        return
      }
      i++
    }
    this.animatedContents.push({
      data,
      element,
      fn: createRenderFunction(data),
    })
  }
  buildExpressionInterface() {
    throw new Error(
      `${this.constructor.name}: Method buildExpressionInterface not implemented`
    )
  }
  override createContent() {
    if (!this.layerElement) {
      throw new Error(`${this.constructor.name}: Could not access Layer`)
    }
    if (!this.shapesData) {
      throw new Error(`${this.constructor.name}: Could not access ShapesData`)
    }
    this.searchShapes(
      this.shapesData,
      this.itemsData as SVGElementInterface[],
      this.prevViewData || [],
      this.layerElement,
      0,
      [],
      true
    )
    this.filterUniqueShapes()
  }
  createGroupElement(data: Shape) {
    const elementData = new ShapeGroupData()
    if (data.ln) {
      elementData.gr.setAttribute('id', data.ln)
    }
    if (data.cl) {
      elementData.gr.setAttribute('class', data.cl)
    }
    if (data.bm) {
      elementData.gr.style.mixBlendMode = getBlendMode(data.bm)
    }
    return elementData
  }
  createShapeElement(
    data: Shape,
    ownTransformers: Transformer[],
    level: number
  ) {
    let ty = 4

    switch (data.ty) {
      case 'rc':
        ty = 5
        break
      case 'el':
        ty = 6
        break
      case 'sr':
        ty = 7
    }

    const shapeProperty = getShapeProp(this, data, ty),
      elementData = new SVGShapeData(
        ownTransformers,
        level,
        shapeProperty as ShapeProperty
      )
    this.shapes.push(elementData)
    this.addShapeToModifiers(elementData)
    this.addToAnimatedContents(data, elementData)
    return elementData
  }
  createStyleElement(data: Shape, level: number) {
    // TODO: prevent drawing of hidden styles
    let elementData: SVGElementInterface | null = null
    const styleOb = new SVGStyleData(data, level)

    const pathElement = styleOb.pElem
    if (data.ty === 'st') {
      elementData = new SVGStrokeStyleData(this, data, styleOb)
    } else if (data.ty === 'fl') {
      elementData = new SVGFillStyleData(this, data, styleOb)
    } else if (data.ty === 'gf' || data.ty === 'gs') {
      const GradientConstructor =
        data.ty === 'gf' ? SVGGradientFillStyleData : SVGGradientStrokeStyleData
      elementData = new GradientConstructor(this, data, styleOb)
      if (elementData.gf) {
        this.globalData?.defs.appendChild(elementData.gf)
      }

      if (elementData.maskId && elementData.ms && elementData.of) {
        this.globalData?.defs.appendChild(elementData.ms)
        this.globalData?.defs.appendChild(elementData.of)
        pathElement.setAttribute(
          'mask',
          `url(${getLocationHref()}#${elementData.maskId})`
        )
      }
    } else if (data.ty === 'no') {
      elementData = new SVGNoStyleData(this, data as any, styleOb)
    }

    if (data.ty === 'st' || data.ty === 'gs') {
      pathElement.setAttribute('stroke-linecap', lineCapEnum[data.lc || 2])
      pathElement.setAttribute('stroke-linejoin', lineJoinEnum[data.lj || 2])
      pathElement.setAttribute('fill-opacity', '0')
      if (data.lj === 1 && data.ml) {
        pathElement.setAttribute('stroke-miterlimit', `${data.ml}`)
      }
    }

    if (data.r === (2 as any)) {
      pathElement.setAttribute('fill-rule', 'evenodd')
    }

    if (data.ln) {
      pathElement.setAttribute('id', data.ln)
    }
    if (data.cl) {
      pathElement.setAttribute('class', data.cl)
    }
    if (data.bm) {
      pathElement.style.mixBlendMode = getBlendMode(data.bm)
    }
    this.stylesList.push(styleOb)
    if (elementData) {
      this.addToAnimatedContents(data, elementData)
    }
    return elementData
  }
  createTransformElement(data: Shape, container: SVGGElement) {
    const transformProperty = new TransformProperty(
      this as unknown as ElementInterfaceIntersect,
      data,
      this as unknown as ElementInterfaceIntersect
    )
    if (!transformProperty.o) {
      throw new Error(
        `${this.constructor.name}: Missing required data in TransformProperty`
      )
    }
    const elementData = new SVGTransformData(
      transformProperty,
      transformProperty.o,
      container
    )
    this.addToAnimatedContents(data, elementData)
    return elementData
  }
  override destroy() {
    this.destroyBaseElement()
    this.shapesData = null as unknown as Shape[]
    this.itemsData = null as unknown as SVGElementInterface[]
  }
  filterUniqueShapes() {
    const { length } = this.shapes,
      jLen = this.stylesList.length,
      tempShapes = []
    let style,
      areAnimated = false
    for (let j = 0; j < jLen; j++) {
      style = this.stylesList[j]
      areAnimated = false
      tempShapes.length = 0
      for (let i = 0; i < length; i++) {
        if ((this.shapes[i] as SVGShapeData).styles.indexOf(style) !== -1) {
          tempShapes.push(this.shapes[i])
          areAnimated = this.shapes[i]._isAnimated || areAnimated
        }
      }
      if (tempShapes.length > 1 && areAnimated) {
        this.setShapesAsAnimated(tempShapes as unknown as ShapeDataInterface[])
      }
    }
  }
  getBaseElement() {
    throw new Error(
      `${this.constructor.name}: Method getBaseElement is not implemented`
    )
  }

  getMatte(_type?: number) {
    throw new Error(
      `${this.constructor.name}: Method getMatte not yet implemented`
    )
  }

  initSecondaryElement() {
    throw new Error(
      `${this.constructor.name}: Method initSecondaryElement not yet implemented`
    )
  }
  reloadShapes() {
    if (!this.layerElement) {
      throw new Error(`${this.constructor.name}: Could not access layerElement`)
    }
    if (!this.shapesData) {
      throw new Error(`${this.constructor.name}: Could not access shapesData`)
    }
    this._isFirstFrame = true
    const { length } = this.itemsData || []
    for (let i = 0; i < length; i++) {
      this.prevViewData[i] = this.itemsData![i]
    }
    this.searchShapes(
      this.shapesData,
      this.itemsData as SVGElementInterface[],
      this.prevViewData,
      this.layerElement,
      0,
      [],
      true
    )
    this.filterUniqueShapes()
    const { length: dLength } = this.dynamicProperties || []
    for (let i = 0; i < dLength; i++) {
      this.dynamicProperties?.[i].getValue()
    }
    this.renderModifiers()
  }
  override renderInnerContent() {
    this.renderModifiers()
    const { length } = this.stylesList
    for (let i = 0; i < length; i++) {
      this.stylesList[i].reset()
    }
    this.renderShape()
    for (let i = 0; i < length; i++) {
      if (!this.stylesList[i]._mdf && !this._isFirstFrame) {
        continue
      }
      if (this.stylesList[i].msElem) {
        this.stylesList[i].msElem?.setAttribute('d', this.stylesList[i].d)
        // Adding M0 0 fixes same mask bug on all browsers
        this.stylesList[i].d = `M0 0${this.stylesList[i].d}`
      }
      this.stylesList[i].pElem.setAttribute('d', this.stylesList[i].d || 'M0 0')
    }
  }
  renderShape() {
    const { length } = this.animatedContents
    for (let i = 0; i < length; i++) {
      if (
        (!this._isFirstFrame &&
          !this.animatedContents[i].element._isAnimated) ||
        this.animatedContents[i].data === (true as any) ||
        !this.animatedContents[i].fn
      ) {
        continue
      }
      this.animatedContents[i].fn!(
        this.animatedContents[i].data,
        this.animatedContents[i].element as any,
        this._isFirstFrame
      )
    }
  }
  searchShapes(
    arr: Shape[],
    itemsData: SVGElementInterface[],
    prevViewData: SVGElementInterface[],
    container: SVGGElement,
    level: number,
    transformers: Transformer[],
    renderFromProps: boolean
  ) {
    let render = renderFromProps
    const ownTransformers: Transformer[] = [].concat(transformers as any),
      ownStyles = [],
      ownModifiers = []
    let currentTransform,
      Modifier: TrimModifier | RepeaterModifier,
      processedPos: number
    const { length } = arr
    for (let i = length - 1; i >= 0; i--) {
      processedPos = this.searchProcessedElement(arr[i])
      if (processedPos) {
        itemsData[i] = prevViewData[processedPos - 1]
      } else {
        arr[i]._render = render
      }

      switch (arr[i].ty) {
        case 'fl':
        case 'st':
        case 'gf':
        case 'gs':
        case 'no': {
          if (processedPos) {
            itemsData[i]!.style!.closed = false
          } else {
            itemsData[i] = this.createStyleElement(
              arr[i],
              level
            ) as SVGElementInterface
          }
          if (arr[i]._render) {
            if (itemsData[i]?.style?.pElem.parentNode !== container) {
              container.appendChild(itemsData[i].style!.pElem)
            }
          }
          ownStyles.push(itemsData[i]?.style)
          break
        }
        case 'gr': {
          if (processedPos) {
            const { length } = itemsData[i]?.it || []
            for (let j = 0; j < length; j++) {
              itemsData[i]!.prevViewData![j] = itemsData[i]!.it![j]
            }
          } else {
            itemsData[i] = this.createGroupElement(
              arr[i]
            ) as SVGElementInterface
          }
          this.searchShapes(
            arr[i].it as Shape[],
            itemsData[i]?.it || [],
            itemsData[i]?.prevViewData || [],
            itemsData[i]!.gr!,
            level + 1,
            ownTransformers,
            render
          )
          if (arr[i]._render) {
            if (itemsData[i]?.gr?.parentNode !== container) {
              container.appendChild(itemsData[i]!.gr!)
            }
          }
          break
        }
        case 'tr': {
          if (!processedPos) {
            itemsData[i] = this.createTransformElement(arr[i], container)
          }
          currentTransform = itemsData[i]?.transform
          if (currentTransform) {
            ownTransformers.push(currentTransform)
          }

          break
        }
        case 'sh':
        case 'rc':
        case 'el':
        case 'sr': {
          if (!processedPos) {
            itemsData[i] = this.createShapeElement(
              arr[i],
              ownTransformers,
              level
            )
          }
          this.setElementStyles(itemsData[i] as SVGShapeData)
          break
        }
        case 'tm':
        case 'rd':
        case 'ms':
        case 'pb':
        case 'zz':
        case 'op': {
          if (processedPos) {
            Modifier = itemsData[i] as unknown as TrimModifier
            Modifier.closed = false
          } else {
            Modifier = getModifier<TrimModifier>(arr[i].ty)
            Modifier.init(this as unknown as ElementInterfaceIntersect, arr[i])
            ;(itemsData as unknown as TrimModifier[])[i] = Modifier
            this.shapeModifiers.push(Modifier)
          }
          ownModifiers.push(Modifier)
          break
        }
        case 'rp': {
          if (processedPos) {
            Modifier = itemsData[i] as unknown as RepeaterModifier
            Modifier.closed = true
          } else {
            Modifier = getModifier<RepeaterModifier>(arr[i].ty)
            ;(itemsData as unknown as RepeaterModifier[])[i] = Modifier
            Modifier.init(
              this as unknown as ElementInterfaceIntersect,
              arr,
              i,
              itemsData as ShapeGroupData[]
            )
            this.shapeModifiers.push(Modifier)

            render = false
          }
          ownModifiers.push(Modifier)
        }
      }

      this.addProcessedElement(
        arr[i] as unknown as ElementInterfaceIntersect,
        i + 1
      )
    }
    const { length: sLen } = ownStyles
    for (let i = 0; i < sLen; i++) {
      ownStyles[i]!.closed = true
    }
    const { length: mLen } = ownModifiers
    for (let i = 0; i < mLen; i++) {
      ownModifiers[i].closed = true
    }
  }
  setElementStyles(elementData: SVGShapeData) {
    const { length } = this.stylesList
    for (let i = 0; i < length; i++) {
      if (!this.stylesList[i].closed) {
        elementData.styles.push(this.stylesList[i])
      }
    }
  }
  setMatte(_id: string) {
    throw new Error(
      `${this.constructor.name}: Method setMatte not yet implemented`
    )
  }
  setShapesAsAnimated(shapes: ShapeDataInterface[]) {
    const { length } = shapes
    for (let i = 0; i < length; i++) {
      shapes[i].setAsAnimated()
    }
  }
}
