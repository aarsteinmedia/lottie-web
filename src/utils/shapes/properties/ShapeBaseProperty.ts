import type CVShapeElement from '@/elements/canvas/CVShapeElement'
import type HShapeElement from '@/elements/html/HShapeElement'
import type SVGShapeElement from '@/elements/svg/SVGShapeElement'
import type {
  Caching, CompElementInterface, ElementInterfaceIntersect, ExpressionProperty, KeyframesMetadata,
  Shape,
} from '@/types'
import type { ShapeType } from '@/utils/enums'
import type KeyframedValueProperty from '@/utils/properties/KeyframedValueProperty'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'
import type ShapePath from '@/utils/shapes/ShapePath'

import { isArray } from '@/utils'
import { getBezierEasing } from '@/utils/BezierFactory'
import { initialDefaultFrame } from '@/utils/helpers/constants'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import { clone } from '@/utils/pooling/ShapePool'

export default abstract class ShapeBaseProperty extends DynamicPropertyContainer {
  _caching?: Caching
  _cachingAtTime?: Caching
  public comp?: CompElementInterface
  public override data?: Shape
  public effectsSequence: ((arg: unknown) => ShapePath)[] = []
  public elem?: SVGShapeElement | CVShapeElement | HShapeElement
  frameId?: number
  public k?: boolean
  keyframesMetadata: KeyframesMetadata[] = []
  public kf?: boolean
  public localShapeCollection?: ShapeCollection
  lock?: boolean
  offsetTime = 0
  p?: MultiDimensionalProperty
  public paths?: ShapePath[] | ShapeCollection
  public pv?: ShapePath
  ty?: ShapeType
  public v?: ShapePath
  getValueAtTime(_frameNumFromProps: number, _num?: number): ShapePath | null {
    throw new Error(`${this.constructor.name}: Method getShapeValueAtTime is not implemented`)
  }

  initiateExpression(
    _elem: ElementInterfaceIntersect,
    _data: ExpressionProperty,
    _property: KeyframedValueProperty
  ) {
    throw new Error(`${this.constructor.name}: Method initiateExpression is not implemented`)
  }

  interpolateShape(
    frameNum: number,
    previousValue: ShapePath,
    caching: Caching = {} as Caching
  ) {
    let iterationIndex = caching.lastIndex || 0,
      keyPropS,
      keyPropE,
      isHold,
      perc = 0,
      vertexValue: number
    const kf = this.keyframes ?? []

    if (frameNum < (kf[0]?.t ?? 0) - this.offsetTime) {
      keyPropS = kf[0]?.s?.[0] ?? 0
      isHold = true
      iterationIndex = 0
    } else if (frameNum >= (kf[kf.length - 1]?.t ?? 0) - this.offsetTime) {
      keyPropS = kf[kf.length - 1]?.s
        ? kf[kf.length - 1]?.s?.[0]
        : kf[kf.length - 2]?.e[0]
      /* if(kf[kf.length - 1].s){
                keyPropS = kf[kf.length - 1].s[0];
            }else{
                keyPropS = kf[kf.length - 2].e[0];
            } */
      isHold = true
    } else {
      let i = iterationIndex
      const len = kf.length - 1
      let shouldInterpolate = true,
        keyData,
        nextKeyData

      while (shouldInterpolate) {
        keyData = kf[i]
        nextKeyData = kf[i + 1]
        if ((nextKeyData?.t ?? 0) - this.offsetTime > frameNum) {
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
      const keyframeMetadata = this.keyframesMetadata[i] ?? {}

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
            (fnc?.((frameNum - (keyData.t - this.offsetTime)) /
              (nextKeyData.t -
                this.offsetTime -
                (keyData.t - this.offsetTime))) || 0) as number
        }
        keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0]
      }
      keyPropS = keyData.s?.[0]
    }
    if (
      !keyPropS || typeof keyPropS === 'number' || isArray(keyPropS)
      || typeof keyPropE === 'number'
    ) {

      return
    }

    const jLen = previousValue._length,
      kLen = keyPropS.i[0]?.length ?? 0

    caching.lastIndex = iterationIndex

    for (let j = 0; j < jLen; j++) {
      for (let k = 0; k < kLen; k++) {
        vertexValue = (isHold
          ? keyPropS.i[j]?.[k]
          : (keyPropS.i[j]?.[k] ?? 0) + ((keyPropE?.i[j]?.[k] ?? 0) - (keyPropS.i[j]?.[k] ?? 0)) * perc) ?? 0
        // @ts-expect-error: TODO:
        previousValue.i[j][k] = vertexValue
        vertexValue = (isHold
          ? keyPropS.o[j]?.[k]
          : (keyPropS.o[j]?.[k] ?? 0) + ((keyPropE?.o[j]?.[k] ?? 0) - (keyPropS.o[j]?.[k] ?? 0)) * perc) ?? 0
        // @ts-expect-error: TODO:
        previousValue.o[j][k] = vertexValue
        vertexValue = (isHold
          ? keyPropS.v[j]?.[k]
          : (keyPropS.v[j]?.[k] ?? 0) + ((keyPropE?.v[j]?.[k] ?? 0) - (keyPropS.v[j]?.[k] ?? 0)) * perc) ?? 0
        // @ts-expect-error: TODO:
        previousValue.v[j][k] = vertexValue
      }
    }
  }

  interpolateShapeCurrentTime() {
    if (!this.pv) {
      throw new Error(`${this.constructor.name}: Cannot parse ShapePath v value`)
    }

    if (!this.keyframes) {
      return
    }

    this._caching = this._caching ?? ({} as Caching)

    const frameNum = Number(this.comp?.renderedFrame) - this.offsetTime,
      initTime = (this.keyframes[0]?.t ?? 0) - this.offsetTime,
      endTime = (this.keyframes[this.keyframes.length - 1]?.t ?? 0)- this.offsetTime,
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

  processEffectsSequence(_val?: unknown) {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (Shape) is not implemented`)
    }

    if (this.elem?.globalData?.frameId === this.frameId) {
      return 0
    }
    if (this.effectsSequence.length === 0) {
      this._mdf = false

      return 0
    }
    if (this.lock && this.pv) {
      this.setVValue(this.pv)

      return 0
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
      finalValue = this.effectsSequence[i]?.(finalValue)
    }
    this.setVValue(finalValue as ShapePath)
    this.lock = false
    this.frameId = this.elem?.globalData?.frameId || 0

    return 0
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