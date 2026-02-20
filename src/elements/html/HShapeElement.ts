import type { ShapeGroupData } from '@/elements/helpers/shapes/ShapeGroupData'
import type {
  BoundingBox,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  ShapeDataInterface,
  Transformer,
  Vector2,
} from '@/types'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { ShapeElement } from '@/elements/ShapeElement'
import { createNS } from '@/utils/helpers/svgElements'

export class HShapeElement extends ShapeElement {
  animatedContents: unknown[]
  currentBBox: BoundingBox
  prevViewData: HShapeElement[]
  shapeBoundingBox = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }
  shapeCont?: undefined | SVGElement
  shapesContainer: SVGGElement
  stylesList: CSSStyleDeclaration[]
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
      this.calculateShapeBoundingBox(itemsData[i] as ShapeDataInterface, boundingBox)
      // continue


      if (itemsData[i]?.it) {
        this.calculateBoundingBox(itemsData[i]?.it ?? [], boundingBox)
        continue
      }
      if (itemsData[i]?.style && itemsData[i]?.w) {
        this.expandStrokeBoundingBox(itemsData[i]?.w as ValueProperty, boundingBox)
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
      Math.pow(1 - t, 3) * (p0[i] as number) +
      3 * Math.pow(1 - t, 2) * t * (p1[i] as number) +
      3 * (1 - t) * Math.pow(t, 2) * (p2[i] as number) +
      Math.pow(t, 3) * (p3[i] as number)
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
      vPoint = this.getTransformedPoint(transformers, shape.v[i] ?? []) as Vector2
      oPoint = this.getTransformedPoint(transformers, shape.o[i] ?? []) as Vector2
      nextIPoint = this.getTransformedPoint(transformers,
        shape.i[i + 1] ?? []) as Vector2
      nextVPoint = this.getTransformedPoint(transformers,
        shape.v[i + 1] ?? []) as Vector2
      this.checkBounds(
        vPoint, oPoint, nextIPoint, nextVPoint, boundingBox
      )
    }
    if (shape.c) {
      vPoint = this.getTransformedPoint(transformers, shape.v[i] ?? []) as Vector2
      oPoint = this.getTransformedPoint(transformers, shape.o[i] ?? []) as Vector2
      nextIPoint = this.getTransformedPoint(transformers, shape.i[0] ?? []) as Vector2
      nextVPoint = this.getTransformedPoint(transformers, shape.v[0] ?? []) as Vector2
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

  override createContent() {
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
        const kfw = widthProperty.keyframes[i]?.s as unknown as number

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
      b = 6 * (p0[i] as number) - 12 * (p1[i] as number) + 6 * (p2[i] as number)
      a = -3 * (p0[i] as number) + 9 * (p1[i] as number) - 9 * (p2[i] as number) + 3 * (p3[i] as number)
      c = 3 * (p1[i] as number) - 3 * (p0[i] as number)

      b |= 0
      a |= 0
      c |= 0

      if (a === 0 && b === 0) {
        //
      } else if (a === 0) {
        t = -c / b

        if (t > 0 && t < 1) {
          bounds[i]?.push(this.calculateF(
            t, p0, p1, p2, p3, i
          ))
        }
      } else {
        b2ac = b * b - 4 * c * a

        if (b2ac >= 0) {
          t1 = (-b + Math.sqrt(b2ac)) / (2 * a)
          if (t1 > 0 && t1 < 1) {
            bounds[i]?.push(this.calculateF(
              t1, p0, p1, p2, p3, i
            ))
          }
          t2 = (-b - Math.sqrt(b2ac)) / (2 * a)
          if (t2 > 0 && t2 < 1) {
            bounds[i]?.push(this.calculateF(
              t2, p0, p1, p2, p3, i
            ))
          }
        }
      }
    }

    this.shapeBoundingBox.left = Math.min.apply(null, bounds[0] ?? [])
    this.shapeBoundingBox.top = Math.min.apply(null, bounds[1] ?? [])
    this.shapeBoundingBox.right = Math.max.apply(null, bounds[0] ?? [])
    this.shapeBoundingBox.bottom = Math.max.apply(null, bounds[1] ?? [])
  }

  getTransformedPoint(transformers: Transformer[], pointFromProps: number[]) {
    let point = pointFromProps
    const { length } = transformers

    for (let i = 0; i < length; i++) {
      point = transformers[i]?.mProps.v.applyToPointArray(
        point[0] ?? 0, point[1] ?? 0, 0
      ) ?? []
    }

    return point
  }

  override renderInnerContent() {
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
      if (this.currentBoxContains(tempBoundingBox as BoundingBox)) {
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
