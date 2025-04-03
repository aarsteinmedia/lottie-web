import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type {
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  Shape,
} from '@/types'
import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type RoundCornersModifier from '@/utils/shapes/RoundCornersModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier'

import CVShapeData from '@/elements/helpers/shapes/CVShapeData'
import ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import { initialDefaultFrame } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'

export type ModifierInterface =
  | OffsetPathModifier
  | PuckerAndBloatModifier
  | RepeaterModifier
  | RoundCornersModifier
  | TrimModifier
  | ZigZagModifier

export default class ShapeModifier extends DynamicPropertyContainer {
  closed?: boolean
  elem?: ElementInterfaceIntersect
  frameId?: number
  k?: boolean
  shapes: SVGShapeData[] = []
  addShape(data: SVGShapeData | CVShapeData) {
    if (this.closed) {
      return
    }
    // Adding shape to dynamic properties. It covers the case where a shape has no effects applied, to reset it's _mdf state on every tick.
    data.sh?.container?.addDynamicProperty(data.sh as DynamicPropertyContainer)
    const shapeData = {
      data,
      localShapeCollection: newShapeCollection(),
      shape: data.sh,
    } as unknown as SVGShapeData
    this.shapes.push(shapeData)
    this.addShapeToModifier(shapeData)
    if (this._isAnimated) {
      data.setAsAnimated()
    }
  }
  addShapeToModifier(_shapeData: SVGShapeData) {
    throw new Error(
      `${this.constructor.name}: Method addShapeToModifier is not implemented`
    )
  }
  init(
    elem: ElementInterfaceIntersect,
    data: Shape | Shape[],
    _posFromProps?: number,
    _elemsData?: ShapeGroupData[]
  ) {
    this.shapes = []
    this.elem = elem as ElementInterfaceIntersect
    this.initDynamicPropertyContainer(elem)
    this.initModifierProperties(elem, data)
    this.frameId = initialDefaultFrame
    this.closed = false
    this.k = false
    if (this.dynamicProperties.length) {
      this.k = true
    } else {
      this.getValue(true)
    }
  }
  initModifierProperties(_elem: ElementInterfaceUnion, _data: Shape | Shape[]) {
    throw new Error(
      `${this.constructor.name}: Method initModifierProperties is not implemented`
    )
  }
  isAnimatedWithShape(_data: Shape): boolean {
    throw new Error(
      `${this.constructor.name}: Method isAnimatedWithShape is not implemented`
    )
  }

  processKeys() {
    if (this.elem?.globalData.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem?.globalData.frameId
    this.iterateDynamicProperties()
  }
}
