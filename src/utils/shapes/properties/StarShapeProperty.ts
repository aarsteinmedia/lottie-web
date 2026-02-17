import type {
  ElementInterfaceIntersect, Shape, StrokeData, VectorProperty
} from '@/types'
import type { MultiDimensionalProperty } from '@/utils/properties/MultiDimensionalProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'
import type { ShapePath } from '@/utils/shapes/ShapePath'

import { degToRads } from '@/utils/helpers/constants'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import { ShapeBaseProperty } from '@/utils/shapes/properties/ShapeBaseProperty'

export class StarShapeProperty extends ShapeBaseProperty {
  d?: StrokeData[]
  ir?: ValueProperty
  is?: ValueProperty
  or: ValueProperty
  os: ValueProperty
  pt: ValueProperty
  r: ValueProperty
  s?: ValueProperty
  constructor(elem: ElementInterfaceIntersect, data: Shape) {
    super()
    this.v = newElement() as ShapePath
    this.v.setPathData(true, 0)
    this.elem = elem
    this.comp = elem.comp
    this.data = data
    this.frameId = -1
    this.d = data.d as StrokeData[]
    this.initDynamicPropertyContainer(elem)

    if (data.sy === 1) {
      this.ir = PropertyFactory.getProp(
        elem,
        data.ir as VectorProperty,
        0,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.is = PropertyFactory.getProp(
        elem,
        data.is as VectorProperty,
        0,
        0.01,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.convertToPath = this.convertStarToPath
    } else {
      this.convertToPath = this.convertPolygonToPath
    }
    this.pt = PropertyFactory.getProp(
      elem,
      data.pt,
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.p = PropertyFactory.getProp(
      elem,
      data.p,
      1,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.r = PropertyFactory.getProp(
      elem,
      data.r,
      0,
      degToRads,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.or = PropertyFactory.getProp(
      elem,
      data.or as unknown as VectorProperty,
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.os = PropertyFactory.getProp(
      elem,
      data.os as VectorProperty,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.localShapeCollection = newShapeCollection()
    this.localShapeCollection.addShape(this.v)
    this.paths = this.localShapeCollection
    if (this.dynamicProperties.length > 0) {
      this.k = true
    } else {
      this.k = false
      this.convertToPath()
    }
  }

  convertPolygonToPath() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (Shape) is not implemented`)
    }

    if (!this.p) {
      throw new Error(`${this.constructor.name}: p value is not implemented`)
    }

    const numPts = Math.floor(this.pt.v),
      angle = Math.PI * 2 / numPts,
      rad = this.or.v,
      roundness = this.os.v,
      perimSegment = 2 * Math.PI * rad / (numPts * 4)
    let currentAng = -Math.PI * 0.5
    const dir = this.data.d === 3 ? -1 : 1

    currentAng += this.r.v
    if (this.v) {
      this.v._length = 0
    }

    for (let i = 0; i < numPts; i++) {
      let x = rad * Math.cos(currentAng)
      let y = rad * Math.sin(currentAng)
      const ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y)
      const oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y)

      x += this.p.v[0]
      y += this.p.v[1]
      this.v?.setTripleAt(
        x,
        y,
        x - ox * perimSegment * roundness * dir,
        y - oy * perimSegment * roundness * dir,
        x + ox * perimSegment * roundness * dir,
        y + oy * perimSegment * roundness * dir,
        i,
        true
      )
      currentAng += angle * dir
    }
    ; (this.paths as unknown as { length: number }).length = 0 // TODO: Check if values are different in star shapes
    ; (this.paths as unknown as any[])[0] = this.v
  }

  convertStarToPath() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (Shape) is not implemented`)
    }

    if (!this.v) {
      throw new Error(`${this.constructor.name}: v (ShapePath) is not implemented`)
    }

    const numPts = Math.floor(this.pt.v) * 2,
      angle = Math.PI * 2 / numPts
    /* this.v.v.length = numPts;
              this.v.i.length = numPts;
              this.v.o.length = numPts; */
    let isLong = true
    const longRad = this.or.v,
      shortRad = Number(this.ir?.v),
      longRound = this.os.v,
      shortRound = Number(this.is?.v),
      longPerimSegment = 2 * Math.PI * longRad / (numPts * 2),
      shortPerimSegment = 2 * Math.PI * shortRad / (numPts * 2)
    let rad,
      roundness,
      perimSegment,
      currentAng = -Math.PI / 2

    currentAng += this.r.v
    const dir = this.data.d === 3 ? -1 : 1

    this.v._length = 0
    for (let i = 0; i < numPts; i++) {
      rad = isLong ? longRad : shortRad
      roundness = isLong ? longRound : shortRound
      perimSegment = isLong ? longPerimSegment : shortPerimSegment
      let x = rad * Math.cos(currentAng),
        y = rad * Math.sin(currentAng)
      const ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y),
        oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y)

      x += Number(this.p?.v[0])
      y += Number(this.p?.v[1])
      this.v.setTripleAt(
        x,
        y,
        x - ox * perimSegment * roundness * dir,
        y - oy * perimSegment * roundness * dir,
        x + ox * perimSegment * roundness * dir,
        y + oy * perimSegment * roundness * dir,
        i,
        true
      )

      /* this.v.v[i] = [x,y];
                  this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
                  this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
                  this.v._length = numPts; */
      isLong = !isLong
      currentAng += angle * dir
    }
  }

  convertToPath() {
    throw new Error(`${this.constructor.name}: Method convertToPath is not implemented`)
  }

  override getValue(_val?: unknown) {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return 0
    }
    this.frameId = this.elem?.globalData?.frameId || 0
    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertToPath()
    }

    return 0
  }
}