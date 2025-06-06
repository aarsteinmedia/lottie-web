import type { ElementInterfaceIntersect, Shape } from '@/types'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ShapePath from '@/utils/shapes/ShapePath'

import { roundCorner } from '@/utils/helpers/constants'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeBaseProperty from '@/utils/shapes/properties/ShapeBaseProperty'

export default class EllShapeProperty extends ShapeBaseProperty {
  _cPoint = roundCorner
  d?: number
  s: MultiDimensionalProperty

  constructor(elem: ElementInterfaceIntersect, data: Shape) {
    super()
    this.v = newElement() as ShapePath
    this.v.setPathData(true, 4)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.localShapeCollection.addShape(this.v)
    this.d = data.d as number
    this.elem = elem
    this.comp = elem.comp
    this.frameId = -1
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
    if (this.dynamicProperties.length > 0) {
      this.k = true
    } else {
      this.k = false
      this.convertEllToPath()
    }
  }

  convertEllToPath() {
    if (!this.p) {
      return
    }

    const p0 = this.p.v[0],
      p1 = this.p.v[1],
      s0 = this.s.v[0] / 2,
      s1 = this.s.v[1] / 2,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _cw = this.d !== 3,
      _v = this.v

    if (!_v) {
      throw new Error(`${this.constructor.name}: Could not get value of ellipse`)
    }
    _v.v[0][0] = p0
    _v.v[0][1] = p1 - s1
    _v.v[1][0] = _cw ? p0 + s0 : p0 - s0
    _v.v[1][1] = p1
    _v.v[2][0] = p0
    _v.v[2][1] = p1 + s1
    _v.v[3][0] = _cw ? p0 - s0 : p0 + s0
    _v.v[3][1] = p1
    _v.i[0][0] = _cw ? p0 - s0 * this._cPoint : p0 + s0 * this._cPoint
    _v.i[0][1] = p1 - s1
    _v.i[1][0] = _cw ? p0 + s0 : p0 - s0
    _v.i[1][1] = p1 - s1 * this._cPoint
    _v.i[2][0] = _cw ? p0 + s0 * this._cPoint : p0 - s0 * this._cPoint
    _v.i[2][1] = p1 + s1
    _v.i[3][0] = _cw ? p0 - s0 : p0 + s0
    _v.i[3][1] = p1 + s1 * this._cPoint
    _v.o[0][0] = _cw ? p0 + s0 * this._cPoint : p0 - s0 * this._cPoint
    _v.o[0][1] = p1 - s1
    _v.o[1][0] = _cw ? p0 + s0 : p0 - s0
    _v.o[1][1] = p1 + s1 * this._cPoint
    _v.o[2][0] = _cw ? p0 - s0 * this._cPoint : p0 + s0 * this._cPoint
    _v.o[2][1] = p1 + s1
    _v.o[3][0] = _cw ? p0 - s0 : p0 + s0
    _v.o[3][1] = p1 - s1 * this._cPoint
  }

  override getValue(_flag?: boolean) {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return 0
    }
    this.frameId = this.elem?.globalData?.frameId || 0
    this.iterateDynamicProperties()

    if (this._mdf) {
      this.convertEllToPath()
    }

    return 0
  }
}