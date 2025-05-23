/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type CVShapeElement from '@/elements/canvas/CVShapeElement'
import type HShapeElement from '@/elements/html/HShapeElement'
import type SVGShapeElement from '@/elements/svg/SVGShapeElement'
import type {
  Caching,
  CompElementInterface,
  ElementInterfaceIntersect,
  Keyframe,
  KeyframesMetadata,
  Shape,
  StrokeData,
  Svalue,
  VectorProperty,
} from '@/types'
import type PropertyInterface from '@/utils/expressions/PropertyInterface'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'
import type ShapePath from '@/utils/shapes/ShapePath'
import type TextSelectorProperty from '@/utils/text/TextSelectorProperty'

import { degToRads } from '@/utils'
import { getBezierEasing } from '@/utils/BezierFactory'
import { initialDefaultFrame, roundCorner } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'
import { clone, newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'

function getConstructorFunction() {
  return ShapeProperty
}

function getKeyframedConstructorFunction() {
  return KeyframedShapeProperty
}

function getShapeProp(
  elem: SVGShapeElement | CVShapeElement | HShapeElement,
  data: Shape,
  type: number,
  _arr?: any[],
  _trims?: any[]
) {
  let prop = null

  switch (type) {
    case 3:
    case 4: {
      const dataProp = type === 3 ? data.pt : data.ks,
        keys = dataProp?.k

      if (keys?.length) {
        prop = new KeyframedShapeProperty(
          elem, data, type
        )
        break
      }
      prop = new ShapeProperty(
        elem, data, type
      )
      break
    }
    case 5: {
      prop = new RectShapeProperty(elem as ElementInterfaceIntersect, data)
      break
    }
    case 6: {
      prop = new EllShapeProperty(elem as ElementInterfaceIntersect, data)
      break
    }
    case 7: {
      prop = new StarShapeProperty(elem as ElementInterfaceIntersect, data)
    }
  }

  if (prop?.k) {
    elem.addDynamicProperty(prop)
  }

  return prop
}

export abstract class ShapeBaseProperty extends DynamicPropertyContainer {
  _caching?: Caching
  _cachingAtTime?: Caching
  public comp?: CompElementInterface
  public data?: Shape
  public effectsSequence: ((arg: unknown) => ShapePath)[] = []
  public elem?: SVGShapeElement | CVShapeElement | HShapeElement
  frameId?: number
  public k?: boolean
  keyframes: Keyframe[] = []
  keyframesMetadata: KeyframesMetadata[] = []
  public kf?: boolean
  public localShapeCollection?: ShapeCollection
  lock?: boolean
  offsetTime = 0
  public paths?: ShapePath[] | ShapeCollection
  public pv?: ShapePath
  public v?: ShapePath
  getValueAtTime(_frameNumFromProps: number, _num?: number): ShapePath {
    throw new Error(`${this.constructor.name}: Method getShapeValueAtTime is not implemented`)
  }

  initiateExpression(
    _elem: ElementInterfaceIntersect,
    _data: TextSelectorProperty,
    _property: TextSelectorProperty
  ) {
    throw new Error(`${this.constructor.name}: Method initiateExpression is not implemented`)
  }

  interpolateShape(
    frameNum: number,
    previousValue: ShapePath,
    caching: Caching = {} as Caching
  ) {
    let iterationIndex = caching.lastIndex || 0,
      keyPropS: Svalue[],
      keyPropE,
      isHold,
      perc = 0,
      vertexValue
    const kf = this.keyframes

    if (frameNum < kf[0].t - this.offsetTime) {
      keyPropS = kf[0].s?.[0] as unknown as Svalue[]
      isHold = true
      iterationIndex = 0
    } else if (frameNum >= kf[kf.length - 1].t - this.offsetTime) {
      // @ts-expect-error: ignore
      keyPropS = kf[kf.length - 1].s
        ? kf[kf.length - 1].s?.[0]
        : kf[kf.length - 2].e[0]
      /* if(kf[kf.length - 1].s){
                keyPropS = kf[kf.length - 1].s[0];
            }else{
                keyPropS = kf[kf.length - 2].e[0];
            } */
      isHold = true
    } else {
      let i = iterationIndex
      const len = kf.length - 1
      let shouldInterpolate = true
      let keyData
      let nextKeyData

      while (shouldInterpolate) {
        keyData = kf[i]
        nextKeyData = kf[i + 1]
        if (nextKeyData.t - this.offsetTime > frameNum) {
          break
        }
        if (i < len - 1) {
          i++
        } else {
          shouldInterpolate = false
        }
      }
      if (!keyData || !nextKeyData) {
        throw new Error(`${this.constructor.name}: Could not set keyframe data`)
      }
      const keyframeMetadata = this.keyframesMetadata[i] || {}

      isHold = keyData.h === 1
      iterationIndex = i
      if (!isHold) {
        if (frameNum >= nextKeyData.t - this.offsetTime) {
          perc = 1
        } else if (frameNum < keyData.t - this.offsetTime) {
          perc = 0
        } else {
          let fnc

          if (keyframeMetadata.__fnct) {
            fnc = keyframeMetadata.__fnct
          } else if (
            typeof keyData.o.x === 'number' &&
            typeof keyData.o.y === 'number' &&
            typeof keyData.i.x === 'number' &&
            typeof keyData.i.y === 'number'
          ) {
            fnc = getBezierEasing(
              keyData.o.x,
              keyData.o.y,
              keyData.i.x,
              keyData.i.y
            ).get
            keyframeMetadata.__fnct = fnc
          }
          perc =
            fnc?.((frameNum - (keyData.t - this.offsetTime)) /
              (nextKeyData.t -
                this.offsetTime -
                (keyData.t - this.offsetTime))) || 0
        }
        keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0]
      }
      // @ts-expect-error: ignore
      keyPropS = keyData.s?.[0]
    }
    const jLen = previousValue._length
    // @ts-expect-error: ignore
    const kLen = keyPropS.i[0].length

    caching.lastIndex = iterationIndex

    for (let j = 0; j < jLen; j++) {
      for (let k = 0; k < kLen; k++) {
        vertexValue = isHold
          // @ts-expect-error: ignore
          ? keyPropS.i[j][k]
          // @ts-expect-error: ignore
          : Number(keyPropS.i[j][k]) + (keyPropE.i[j][k] - keyPropS.i[j][k]) * perc
        previousValue.i[j][k] = vertexValue
        vertexValue = isHold
          // @ts-expect-error: ignore
          ? keyPropS.o[j][k]
          // @ts-expect-error: ignore
          : Number(keyPropS.o[j][k]) + (keyPropE.o[j][k] - keyPropS.o[j][k]) * perc
        previousValue.o[j][k] = vertexValue
        vertexValue = isHold
          // @ts-expect-error: ignore
          ? keyPropS.v[j][k]
          // @ts-expect-error: ignore
          : Number(keyPropS.v[j][k]) + (keyPropE.v[j][k] - keyPropS.v[j][k]) * perc
        previousValue.v[j][k] = vertexValue
      }
    }
  }

  interpolateShapeCurrentTime() {
    if (!this.pv) {
      throw new Error(`${this.constructor.name}: Cannot parse ShapePath v value`)
    }

    this._caching = this._caching ?? ({} as Caching)

    const frameNum = Number(this.comp?.renderedFrame) - this.offsetTime,
      initTime = this.keyframes[0].t - this.offsetTime,
      endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
      lastFrame = Number(this._caching.lastFrame)

    if (
      !(
        lastFrame !== initialDefaultFrame &&
        (lastFrame < initTime && frameNum < initTime ||
          lastFrame > endTime && frameNum > endTime)
      )
    ) {
      this._caching.lastIndex =
        lastFrame < frameNum ? Number(this._caching.lastIndex) : 0
      this.interpolateShape(
        frameNum, this.pv, this._caching
      )
    }
    this._caching.lastFrame = frameNum

    return this.pv
  }

  processEffectsSequence() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (Shape) is not implemented`)
    }

    if (this.elem?.globalData?.frameId === this.frameId) {
      return
    }
    if (this.effectsSequence.length === 0) {
      this._mdf = false

      return
    }
    if (this.lock && this.pv) {
      this.setVValue(this.pv)

      return
    }
    this.lock = true
    this._mdf = false
    let finalValue

    if (this.kf) {
      finalValue = this.pv
    } else if (this.data.ks) {
      finalValue = this.data.ks.k
    } else {
      finalValue = this.data.pt?.k
    }
    let i
    const len = this.effectsSequence.length

    for (i = 0; i < len; i++) {
      finalValue = this.effectsSequence[i](finalValue)
    }
    this.setVValue(finalValue as ShapePath)
    this.lock = false
    this.frameId = this.elem?.globalData?.frameId || 0
  }

  reset() {
    this.paths = this.localShapeCollection
  }

  setVValue(newPath?: ShapePath) {
    if (!this.v || !newPath) {
      throw new Error(`${this.constructor.name}: ShapePath is not set`)
    }
    if (!this.localShapeCollection) {
      throw new Error(`${this.constructor.name}: localShapeCollection is not set`)
    }
    if (!this.shapesEqual(this.v, newPath)) {
      this.v = clone(newPath)
      this.localShapeCollection.releaseShapes()
      this.localShapeCollection.addShape(this.v)
      this._mdf = true
      this.paths = this.localShapeCollection
    }
  }

  shapesEqual(shape1: ShapePath, shape2: ShapePath) {
    if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
      return false
    }
    const len = shape1._length || 0

    for (let i = 0; i < len; i++) {
      if (
        shape1.v[i]?.[0] !== shape2.v[i]?.[0] ||
        shape1.v[i]?.[1] !== shape2.v[i]?.[1] ||
        shape1.o[i]?.[0] !== shape2.o[i]?.[0] ||
        shape1.o[i]?.[1] !== shape2.o[i]?.[1] ||
        shape1.i[i]?.[0] !== shape2.i[i]?.[0] ||
        shape1.i[i]?.[1] !== shape2.i[i]?.[1]
      ) {
        return false
      }
    }

    return true
  }
}

export class RectShapeProperty extends ShapeBaseProperty {
  d?: number
  ir?: ValueProperty
  is?: ValueProperty
  or?: ValueProperty
  os?: ValueProperty
  p: MultiDimensionalProperty
  pt?: ValueProperty
  r: ValueProperty
  s: MultiDimensionalProperty

  constructor(elem: ElementInterfaceIntersect, data: Shape) {
    super()
    this.v = newElement()
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
      return
    }
    if (this.elem?.globalData?.frameId) {
      this.frameId = this.elem.globalData.frameId
    }

    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertRectToPath()
    }
  }
}

export class StarShapeProperty extends ShapeBaseProperty {
  d?: StrokeData[]
  ir?: ValueProperty
  is?: ValueProperty
  or: ValueProperty
  os: ValueProperty
  p: MultiDimensionalProperty
  pt: ValueProperty
  r: ValueProperty
  s?: ValueProperty
  constructor(elem: ElementInterfaceIntersect, data: Shape) {
    super()
    this.v = newElement()
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

      x += Number(this.p.v[0])
      y += Number(this.p.v[1])
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
    ;(this.paths as unknown as { length: number }).length = 0 // TODO: Check if values are different in star shapes
    ;(this.paths as unknown as any[])[0] = this.v
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

      x += Number(this.p.v[0])
      y += Number(this.p.v[1])
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

  override getValue() {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem?.globalData?.frameId || 0
    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertToPath()
    }
  }
}

export class EllShapeProperty extends ShapeBaseProperty {
  _cPoint = roundCorner
  d?: number
  p: MultiDimensionalProperty
  s: MultiDimensionalProperty

  constructor(elem: ElementInterfaceIntersect, data: Shape) {
    super()
    this.v = newElement()
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

  override getValue() {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem?.globalData?.frameId || 0
    this.iterateDynamicProperties()

    if (this._mdf) {
      this.convertEllToPath()
    }
  }
}

export class ShapeProperty extends ShapeBaseProperty {
  ix?: number
  pathsData?: ShapePath[] | ShapePath
  propertyIndex?: number
  shape?: {
    _mdf?: boolean
    paths?: {
      shapes: ShapePath[]
      _length: number
    }
  }
  totalShapeLength?: number
  x?: boolean
  constructor(
    elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number
  ) {
    super()
    this.propType = 'shape'
    this.comp = elem.comp
    this.container = elem as ElementInterfaceIntersect
    this.elem = elem
    this.data = data
    this.k = false
    this.kf = false
    this._mdf = false
    const pathData = type === 3 ? data.pt?.k : data.ks?.k

    if (!pathData) {
      throw new Error(`${this.constructor.name}: Could now get Path Data`)
    }
    this.v = clone(pathData as ShapePath)
    this.pv = clone(this.v)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.effectsSequence = []
    this.getValue = this.processEffectsSequence
  }

  setGroupProperty(_propertyInterface: PropertyInterface) {
    throw new Error(`${this.constructor.name}: Method setGroupProperty is not implemented`)
  }
}

export class KeyframedShapeProperty extends ShapeBaseProperty {
  public lastFrame
  constructor(
    elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number
  ) {
    super()
    this.data = data
    this.propType = 'shape'
    this.comp = elem.comp
    this.elem = elem
    this.container = elem as ElementInterfaceIntersect
    this.offsetTime = elem.data?.st || 0
    this.keyframes = (type === 3
      ? data.pt?.k
      : data.ks?.k ?? []) as unknown as Keyframe[]
    this.keyframesMetadata = []
    this.k = true
    this.kf = true
    const { length } = this.keyframes[0].s?.[0].i ?? []

    this.v = newElement()
    this.v.setPathData(Boolean(this.keyframes[0].s?.[0].c), length)
    this.pv = clone(this.v)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.lastFrame = initialDefaultFrame
    this._caching = {
      lastFrame: initialDefaultFrame,
      lastIndex: 0
    } as Caching
    this.effectsSequence = [this.interpolateShapeCurrentTime.bind(this)]
    this.getValue = this.processEffectsSequence
  }
}

const ShapePropertyFactory = {
  getConstructorFunction,
  getKeyframedConstructorFunction,
  getShapeProp,
}

export default ShapePropertyFactory
