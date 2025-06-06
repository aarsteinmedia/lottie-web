import type {
  ElementInterfaceIntersect, Shape, VectorProperty
} from '@/types'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ValueProperty from '@/utils/properties/ValueProperty'
import type ShapePath from '@/utils/shapes/ShapePath'

import { roundCorner } from '@/utils/helpers/constants'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeBaseProperty from '@/utils/shapes/properties/ShapeBaseProperty'

export default class RectShapeProperty extends ShapeBaseProperty {
  d?: number
  ir?: ValueProperty
  is?: ValueProperty
  or?: ValueProperty
  os?: ValueProperty
  pt?: ValueProperty
  r: ValueProperty
  s: MultiDimensionalProperty

  constructor(elem: ElementInterfaceIntersect, data: Shape) {
    super()
    this.v = newElement() as ShapePath
    this.v.c = true
    this.localShapeCollection = newShapeCollection()
    this.localShapeCollection.addShape(this.v)
    this.paths = this.localShapeCollection
    this.elem = elem
    this.comp = elem.comp
    this.frameId = -1
    this.d = data.d as number
    this.initDynamicPropertyContainer(elem)
    this.p = PropertyFactory.getProp(
      elem,
      data.p,
      1,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.s = PropertyFactory.getProp(
      elem,
      data.s,
      1,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.r = PropertyFactory.getProp(
      elem,
      data.r as unknown as VectorProperty<number[]>, // TODO: Find out if typing is wrong
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    if (this.dynamicProperties.length > 0) {
      this.k = true
    } else {
      this.k = false
      this.convertRectToPath()
    }
  }

  convertRectToPath() {
    if (!this.p) {
      throw new Error(`${this.constructor.name}: p value is not implemented`)
    }

    const p0 = this.p.v[0],
      p1 = this.p.v[1],
      v0 = this.s.v[0] / 2,
      v1 = this.s.v[1] / 2,
      round = Math.min(
        v0, v1, this.r.v
      ),
      cPoint = round * (1 - roundCorner)

    if (this.v) {
      this.v._length = 0
    }


    if (this.d === 2 || this.d === 1) {
      this.v?.setTripleAt(
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + cPoint,
        0,
        true
      )
      this.v?.setTripleAt(
        p0 + v0,
        p1 + v1 - round,
        p0 + v0,
        p1 + v1 - cPoint,
        p0 + v0,
        p1 + v1 - round,
        1,
        true
      )
      if (round === 0) {
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          p0 - v0,
          p1 + v1,
          2
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1,
          p0 - v0,
          p1 - v1 + cPoint,
          p0 - v0,
          p1 - v1,
          3
        )
      } else {
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          2,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          p0 - v0 + round,
          p1 + v1,
          3,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - cPoint,
          4,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + cPoint,
          p0 - v0,
          p1 - v1 + round,
          5,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          6,
          true
        )
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - cPoint,
          p1 - v1,
          p0 + v0 - round,
          p1 - v1,
          7,
          true
        )
      }
    } else {
      this.v?.setTripleAt(
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + cPoint,
        p0 + v0,
        p1 - v1 + round,
        0,
        true
      )
      if (round === 0) {
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          p0 - v0,
          p1 - v1,
          1,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1,
          p0 - v0,
          p1 + v1 - cPoint,
          p0 - v0,
          p1 + v1,
          2,
          true
        )
        this.v?.setTripleAt(
          p0 + v0,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          p0 + v0,
          p1 + v1,
          3,
          true
        )
      } else {
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - cPoint,
          p1 - v1,
          1,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          p0 - v0 + round,
          p1 - v1,
          2,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + cPoint,
          3,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - cPoint,
          p0 - v0,
          p1 + v1 - round,
          4,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          5,
          true
        )
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          p0 + v0 - round,
          p1 + v1,
          6,
          true
        )
        this.v?.setTripleAt(
          p0 + v0,
          p1 + v1 - round,
          p0 + v0,
          p1 + v1 - round,
          p0 + v0,
          p1 + v1 - cPoint,
          7,
          true
        )
      }
    }
  }

  override getValue() {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return 0 // For type compability
    }
    if (this.elem?.globalData?.frameId) {
      this.frameId = this.elem.globalData.frameId
    }

    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertRectToPath()
    }

    return 0 // For type compability
  }
}