
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type {
  BoundingBox,
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  ShapeDataInterface,
  Transformer,
  Vector2,
} from '@/types'
import type ValueProperty from '@/utils/properties/ValueProperty'

import RenderableElement from '@/elements/helpers/RenderableElement'
import createNS from '@/utils/helpers/svgElements'

export default class HShapeElement extends RenderableElement {
  animatedContents: any[]
  currentBBox: BoundingBox
  prevViewData: HShapeElement[]

  processedElements: any[]

  shapeBoundingBox = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }

  shapeCont?: SVGElement

  shapeModifiers: any[]

  shapes: Shape[]

  shapesContainer: SVGGElement

  stylesList: any[]

  svgElement?: SVGSVGElement

  tempBoundingBox = {
    height: 0,
    width: 0,
    x: 0,
    xMax: 0,
    y: 0,
    yMax: 0,
  }

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    // List of drawable elements
    this.shapes = []
    // Full shape data
    this.shapesData = data.shapes
    // List of styles that will be applied to shapes
    this.stylesList = []
    // List of modifiers that will be applied to shapes
    this.shapeModifiers = []
    // List of items in shape tree
    this.itemsData = []
    // List of items in previous shape tree
    this.processedElements = []
    // List of animated components
    this.animatedContents = []
    this.shapesContainer = createNS('g')
    this.initElement(
      data, globalData, comp
    )
    // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
    // List of elements that have been created
    this.prevViewData = []
    this.currentBBox = {
      h: 0,
      w: 0,
      x: 999999,
      y: -999999,
    } as BoundingBox

    this._renderShapeFrame = this.renderInnerContent
  }

  /**
   * ExtendPrototype([BaseElement, TransformElement, HSolidElement, SVGShapeElement, HBaseElement, HierarchyElement, FrameElement, RenderableElement], HShapeElement);.
   */
  _renderShapeFrame() {
    throw new Error(`${this.constructor.name}: Method _renderShapeFrame is not implemented`)
  }

  calculateBoundingBox(itemsData: ShapeDataInterface[], boundingBox: BoundingBox) {
    const { length } = itemsData

    for (let i = 0; i < length; i++) {
      this.calculateShapeBoundingBox(itemsData[i], boundingBox)
      continue

      // TODO:
      // @ts-expect-error
      if (itemsData[i]?.it) {
        // @ts-expect-error
        this.calculateBoundingBox(itemsData[i].it, boundingBox)
        continue
      }
      // @ts-expect-error
      if (itemsData[i]?.style && itemsData[i].w) {
        // @ts-expect-error
        this.expandStrokeBoundingBox(itemsData[i].w, boundingBox)
      }
    }
  }

  calculateF(
    t: number,
    p0: Vector2,
    p1: Vector2,
    p2: Vector2,
    p3: Vector2,
    i: number
  ) {
    return (
      Math.pow(1 - t, 3) * p0[i] +
      3 * Math.pow(1 - t, 2) * t * p1[i] +
      3 * (1 - t) * Math.pow(t, 2) * p2[i] +
      Math.pow(t, 3) * p3[i]
    )
  }

  calculateShapeBoundingBox(item: ShapeDataInterface, boundingBox: BoundingBox) {
    const shape = item.sh.v
    const { transformers } = item
    let i
    const len = shape._length
    let vPoint
    let oPoint
    let nextIPoint
    let nextVPoint

    if (len <= 1) {
      return
    }
    for (i = 0; i < len - 1; i++) {
      vPoint = this.getTransformedPoint(transformers, shape.v[i]) as Vector2
      oPoint = this.getTransformedPoint(transformers, shape.o[i]) as Vector2
      nextIPoint = this.getTransformedPoint(transformers,
        shape.i[i + 1]) as Vector2
      nextVPoint = this.getTransformedPoint(transformers,
        shape.v[i + 1]) as Vector2
      this.checkBounds(
        vPoint, oPoint, nextIPoint, nextVPoint, boundingBox
      )
    }
    if (shape.c) {
      vPoint = this.getTransformedPoint(transformers, shape.v[i]) as Vector2
      oPoint = this.getTransformedPoint(transformers, shape.o[i]) as Vector2
      nextIPoint = this.getTransformedPoint(transformers, shape.i[0]) as Vector2
      nextVPoint = this.getTransformedPoint(transformers, shape.v[0]) as Vector2
      this.checkBounds(
        vPoint, oPoint, nextIPoint, nextVPoint, boundingBox
      )
    }
  }

  checkBounds(
    vPoint: Vector2,
    oPoint: Vector2,
    nextIPoint: Vector2,
    nextVPoint: Vector2,
    boundingBox: BoundingBox
  ) {
    this.getBoundsOfCurve(
      vPoint, oPoint, nextIPoint, nextVPoint
    )
    const bounds = this.shapeBoundingBox

    boundingBox.x = Math.min(bounds.left, boundingBox.x)
    boundingBox.xMax = Math.max(bounds.right, boundingBox.xMax)
    boundingBox.y = Math.min(bounds.top, boundingBox.y)
    boundingBox.yMax = Math.max(bounds.bottom, boundingBox.yMax)
  }

  createContent() {
    let cont

    if (!this.baseElement) {
      throw new Error(`${this.constructor.name}: baseElement is not implemented`)
    }
    this.baseElement.style.fontSize = '0'
    if (this.data?.hasMask) {
      this.layerElement?.appendChild(this.shapesContainer)
      cont = this.svgElement
    } else {
      cont = createNS<SVGSVGElement>('svg')
      const size = this.comp?.data ?? this.globalData?.compSize

      if (size) {
        cont.setAttribute('width', `${size.w}`)
        cont.setAttribute('height', `${size.h}`)
      }
      cont.appendChild(this.shapesContainer)
      this.layerElement?.appendChild(cont)
    }

    this.searchShapes(
      this.shapesData,
      this.itemsData,
      this.prevViewData,
      this.shapesContainer,
      0,
      [],
      true
    )
    this.filterUniqueShapes()
    this.shapeCont = cont
  }

  currentBoxContains(box: BoundingBox) {
    return (
      this.currentBBox.x <= box.x &&
      this.currentBBox.y <= box.y &&
      this.currentBBox.width + this.currentBBox.x >= box.x + box.width &&
      this.currentBBox.height + this.currentBBox.y >= box.y + box.height
    )
  }

  expandStrokeBoundingBox(widthProperty: ValueProperty, boundingBox: BoundingBox) {
    let width = 0

    if (widthProperty.keyframes) {
      for (let i = 0; i < widthProperty.keyframes.length; i++) {
        const kfw = widthProperty.keyframes[i].s as unknown as number

        if (kfw > width) {
          width = kfw
        }
      }
      width *= widthProperty.mult ?? 1
    } else {
      width = widthProperty.v * (widthProperty.mult ?? 1)
    }

    boundingBox.x -= width
    boundingBox.xMax += width
    boundingBox.y -= width
    boundingBox.yMax += width
  }

  filterUniqueShapes() {
    throw new Error(`${this.constructor.name}: Method filterUniqueShapes is not implemented`)
  }

  getBoundsOfCurve(
    p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2
  ) {
    const bounds = [
      [p0[0], p3[0]], [p0[1], p3[1]],
    ]

    for (let a, b, c, t, b2ac, t1, t2, i = 0; i < 2; ++i) {
      b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i]
      a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i]
      c = 3 * p1[i] - 3 * p0[i]

      b |= 0
      a |= 0
      c |= 0

      if (a === 0 && b === 0) {
        //
      } else if (a === 0) {
        t = -c / b

        if (t > 0 && t < 1) {
          bounds[i].push(this.calculateF(
            t, p0, p1, p2, p3, i
          ))
        }
      } else {
        b2ac = b * b - 4 * c * a

        if (b2ac >= 0) {
          t1 = (-b + Math.sqrt(b2ac)) / (2 * a)
          if (t1 > 0 && t1 < 1) {
            bounds[i].push(this.calculateF(
              t1, p0, p1, p2, p3, i
            ))
          }
          t2 = (-b - Math.sqrt(b2ac)) / (2 * a)
          if (t2 > 0 && t2 < 1) {
            bounds[i].push(this.calculateF(
              t2, p0, p1, p2, p3, i
            ))
          }
        }
      }
    }

    this.shapeBoundingBox.left = Math.min.apply(null, bounds[0])
    this.shapeBoundingBox.top = Math.min.apply(null, bounds[1])
    this.shapeBoundingBox.right = Math.max.apply(null, bounds[0])
    this.shapeBoundingBox.bottom = Math.max.apply(null, bounds[1])
  }

  getTransformedPoint(transformers: Transformer[], pointFromProps: number[]) {
    let point = pointFromProps
    const { length } = transformers

    for (let i = 0; i < length; i++) {
      point = transformers[i].mProps.v.applyToPointArray(
        point[0], point[1], 0
      )
    }

    return point
  }

  initElement(
    _data: LottieLayer,
    _globalData: GlobalData,
    _comp: CompElementInterface
  ) {
    throw new Error(`${this.constructor.name}: Method initElement is not implemented`)
  }

  renderInnerContent() {
    this._renderShapeFrame()

    if (!this.hidden && (this._isFirstFrame || this._mdf)) {
      if (!this.shapeCont) {
        throw new Error(`${this.constructor.name}: shapeCont is not implemented`)
      }

      const {
          currentBBox, itemsData, shapeCont, tempBoundingBox
        } = this,
        max = 999999

      tempBoundingBox.x = max
      tempBoundingBox.xMax = -max
      tempBoundingBox.y = max
      tempBoundingBox.yMax = -max
      this.calculateBoundingBox(itemsData as unknown as ShapeDataInterface[], tempBoundingBox as BoundingBox)
      tempBoundingBox.width =
        tempBoundingBox.xMax < tempBoundingBox.x
          ? 0
          : tempBoundingBox.xMax - tempBoundingBox.x
      tempBoundingBox.height =
        tempBoundingBox.yMax < tempBoundingBox.y
          ? 0
          : tempBoundingBox.yMax - tempBoundingBox.y
      // var tempBoundingBox = this.shapeCont.getBBox();
      if (this.currentBoxContains(tempBoundingBox as any)) {
        return
      }
      let hasChanged = false

      if (currentBBox.w !== tempBoundingBox.width) {
        currentBBox.w = tempBoundingBox.width
        shapeCont.setAttribute('width', `${tempBoundingBox.width}`)
        hasChanged = true
      }
      if (currentBBox.h !== tempBoundingBox.height) {
        currentBBox.h = tempBoundingBox.height
        shapeCont.setAttribute('height', `${tempBoundingBox.height}`)
        hasChanged = true
      }
      if (
        hasChanged ||
        currentBBox.x !== tempBoundingBox.x ||
        currentBBox.y !== tempBoundingBox.y
      ) {
        currentBBox.w = tempBoundingBox.width
        currentBBox.h = tempBoundingBox.height
        currentBBox.x = tempBoundingBox.x
        currentBBox.y = tempBoundingBox.y

        shapeCont.setAttribute('viewBox',
          `${currentBBox.x} ${currentBBox.y} ${currentBBox.w} ${
            currentBBox.h
          }`)
        const shapeStyle = shapeCont.style,
          shapeTransform = `translate(${currentBBox.x}px,${
            currentBBox.y
          }px)`

        shapeStyle.transform = shapeTransform
        // shapeStyle.webkitTransform = shapeTransform
      }
    }
  }

  searchShapes(
    _shapes: Shape[],
    _itemsData: ShapeGroupData[],
    _prevViewData: HShapeElement[],
    _shapesContainer: SVGElement,
    _pos: number,
    _: unknown[],
    _flag: boolean
  ) {
    throw new Error(`${this.constructor.name}: Method searchShapes is not implemented`)
  }
}
