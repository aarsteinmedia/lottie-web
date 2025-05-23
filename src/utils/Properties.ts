/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {
  Caching,
  CompElementInterface,
  DocumentData,
  EffectFunction,
  ElementInterfaceIntersect,
  Keyframe,
  Shape,
  Svalue,
  TextData,
  TextRangeValue,
  Vector2,
  Vector3,
  VectorProperty,
} from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type Matrix from '@/utils/Matrix'
import type ShapePath from '@/utils/shapes/ShapePath'

import {
  createQuaternion, quaternionToEuler, slerp
} from '@/utils'
import {
  buildBezierData,
  pointOnLine2D,
  pointOnLine3D,
  type BezierData,
} from '@/utils/Bezier'
import { getBezierEasing } from '@/utils/BezierFactory'
import { ArrayType } from '@/utils/enums'
import { initialDefaultFrame } from '@/utils/getterSetter'
import { createTypedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

export abstract class BaseProperty extends DynamicPropertyContainer {
  _caching?: Caching
  _cachingAtTime?: Caching
  _isFirstFrame?: boolean
  _placeholder?: boolean
  comp?: CompElementInterface
  data?:
    | VectorProperty<number | number[] | Keyframe[]>
    | Shape
    | TextRangeValue
    | TextData
  e?: ValueProperty | { v: number }
  effectsSequence: EffectFunction[] = []
  elem?: ElementInterfaceIntersect
  frameId?: number
  g?: unknown
  initFrame = initialDefaultFrame
  k?: boolean
  keyframes: Keyframe[] = []
  keyframesMetadata: {
    bezierData?: BezierData
    __fnct?: ((val: number) => number) | ((val: number) => number)[]
  }[] = []
  kf?: boolean
  lock?: boolean
  mult?: number
  offsetTime = 0
  propertyGroup?: LayerExpressionInterface
  pv?: string | number | number[] | DocumentData | ShapePath
  s?: ValueProperty | MultiDimensionalProperty<Vector3>
  sh?: Shape
  v?: string | number | number[] | Matrix | DocumentData
  value?: number | number[]
  vel?: number | number[]

  addEffect(effectFunction: EffectFunction) {
    this.effectsSequence.push(effectFunction)
    this.container?.addDynamicProperty(this)
  }

  getSpeedAtTime(_frameNum: number) {
    throw new Error(`${this.constructor.name}: Method getSpeedAtTime is not implemented`)
  }

  getValueAtCurrentTime() {
    this._caching = this._caching ?? {} as Caching
    const offsetTime = Number(this.offsetTime),
      frameNum = Number(this.comp?.renderedFrame) - offsetTime,
      initTime = this.keyframes[0].t - offsetTime,
      length = this.keyframes.length - 1,
      endTime = this.keyframes[length].t - offsetTime,
      lastFrame = Number(this._caching.lastFrame)

    if (
      !(
        frameNum === lastFrame ||
        lastFrame !== initialDefaultFrame &&
        (lastFrame >= endTime && frameNum >= endTime ||
          lastFrame < initTime && frameNum < initTime)
      )
    ) {
      if (lastFrame >= frameNum) {
        this._caching._lastKeyframeIndex = -1
        this._caching.lastIndex = 0
      }

      const renderResult = this.interpolateValue(frameNum, this._caching)

      this.pv = renderResult
    }
    this._caching.lastFrame = frameNum

    return this.pv
  }

  getValueAtTime(_a: number,
    _b?: number): number | number[] {
    throw new Error(`${this.constructor.name}: Method getValueAtTime is not implemented`)
  }

  getVelocityAtTime(_frameNum: number): number {
    throw new Error(`${this.constructor.name}: Method getVelocityAtTime is not implemented`)
  }

  interpolateValue(frameNum: number, caching: Caching = {} as Caching) {
    const offsetTime = Number(this.offsetTime)
    let newValue: Vector3 | Svalue = [0,
      0,
      0]

    if (this.propType === 'multidimensional' && this.pv) {
      newValue = createTypedArray(ArrayType.Float32,
        (this.pv as any[]).length) as Vector3
    }
    let iterationIndex = caching.lastIndex || 0,
      i = iterationIndex,
      len = this.keyframes.length - 1,
      shouldInterpolate = true,
      keyData = this.keyframes[0],
      nextKeyData = this.keyframes[1]

    while (shouldInterpolate) {
      keyData = this.keyframes[i]
      nextKeyData = this.keyframes[i + 1]
      if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
        if (keyData.h) {
          keyData = nextKeyData
        }
        iterationIndex = 0
        break
      }
      if (nextKeyData.t - offsetTime > frameNum) {
        iterationIndex = i
        break
      }
      if (i < len - 1) {
        i++
      } else {
        iterationIndex = 0
        shouldInterpolate = false
      }
    }
    const keyframeMetadata = this.keyframesMetadata[i] || {}

    let kLen,
      perc,
      jLen,
      j,
      fnc: null | ((val: number) => number) = null
    const nextKeyTime = nextKeyData.t - offsetTime,
      keyTime = keyData.t - offsetTime
    let endValue

    if (keyData.to && keyData.s) {
      keyframeMetadata.bezierData = keyframeMetadata.bezierData ?? buildBezierData(
        keyData.s as unknown as Vector2,
        (nextKeyData.s ?? keyData.e) as unknown as Vector2,
        keyData.to,
        keyData.ti
      )
      const { __fnct, bezierData } = keyframeMetadata

      if (frameNum >= nextKeyTime || frameNum < keyTime) {
        const ind = frameNum >= nextKeyTime ? bezierData.points.length - 1 : 0

        kLen = bezierData.points[ind].point.length
        for (let k = 0; k < kLen; k++) {
          newValue[k] = bezierData.points[ind].point[k]
        }
        // caching._lastKeyframeIndex = -1;
      } else {
        if (__fnct) {
          fnc = __fnct as (val: number) => number
        } else {
          fnc = getBezierEasing(
            keyData.o.x as number,
            keyData.o.y as number,
            keyData.i.x as number,
            keyData.i.y as number,
            keyData.n
          ).get
          keyframeMetadata.__fnct = fnc
        }
        perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime))
        const distanceInLine = bezierData.segmentLength * perc

        let segmentPerc,
          addedLength =
            Number(caching.lastFrame) < frameNum &&
            caching._lastKeyframeIndex === i
              ? caching._lastAddedLength
              : 0

        j =
          Number(caching.lastFrame) < frameNum &&
          caching._lastKeyframeIndex === i
            ? caching._lastPoint
            : 0
        shouldInterpolate = true
        jLen = bezierData.points.length
        while (shouldInterpolate) {
          addedLength += bezierData.points[j].partialLength
          if (
            distanceInLine === 0 ||
            perc === 0 ||
            j === bezierData.points.length - 1
          ) {
            kLen = bezierData.points[j].point.length
            for (let k = 0; k < kLen; k++) {
              newValue[k] = bezierData.points[j].point[k]
            }
            break
          } else if (
            distanceInLine >= addedLength &&
            distanceInLine <
              addedLength + bezierData.points[j + 1].partialLength
          ) {
            segmentPerc =
              (distanceInLine - addedLength) /
              bezierData.points[j + 1].partialLength
            kLen = bezierData.points[j].point.length
            for (let k = 0; k < kLen; k++) {
              newValue[k] =
                bezierData.points[j].point[k] +
                (bezierData.points[j + 1].point[k] -
                  bezierData.points[j].point[k]) *
                  segmentPerc
            }
            break
          }
          if (j < jLen - 1) {
            j++
          } else {
            shouldInterpolate = false
          }
        }
        caching._lastPoint = j
        caching._lastAddedLength =
          addedLength - bezierData.points[j].partialLength
        caching._lastKeyframeIndex = i
      }
    } else {
      let outX,
        outY,
        inX,
        inY,
        keyValue

      len = keyData.s?.length || 0
      endValue = (nextKeyData.s ?? keyData.e) as Vector3
      if (this.sh && keyData.h !== 1) {
        if (frameNum >= nextKeyTime) {
          newValue[0] = endValue[0]
          newValue[1] = endValue[1]
          newValue[2] = endValue[2]
        } else if (frameNum <= keyTime && keyData.s) {
          newValue[0] = keyData.s[0] as unknown as number
          newValue[1] = keyData.s[1] as unknown as number
          newValue[2] = keyData.s[2] as unknown as number
        } else {
          const quatStart = createQuaternion(keyData.s as unknown as Vector3),
            quatEnd = createQuaternion(endValue as unknown as Vector3),
            time = (frameNum - keyTime) / (nextKeyTime - keyTime)

          quaternionToEuler(newValue, slerp(
            quatStart, quatEnd, time
          ))
        }
      } else {
        for (i = 0; i < len; i++) {
          if (keyData.h !== 1) {
            if (frameNum >= nextKeyTime) {
              perc = 1
            } else if (frameNum < keyTime) {
              perc = 0
            } else {
              if (keyData.o.x.constructor === Array) {
                keyframeMetadata.__fnct = keyframeMetadata.__fnct ?? []
                if ((keyframeMetadata.__fnct as any)[i]) {
                  fnc = (keyframeMetadata.__fnct as any)[i]
                } else if (
                  Array.isArray(keyData.o.y) &&
                  Array.isArray(keyData.i.y) &&
                  Array.isArray(keyData.i.x)
                ) {
                  outX =
                    keyData.o.x[i] ?? keyData.o.x[0]
                  outY =
                    keyData.o.y[i] ?? keyData.o.y[0]
                  inX =
                    keyData.i.x[i] ?? keyData.i.x[0]
                  inY =
                    keyData.i.y[i] ?? keyData.i.y[0]
                  fnc = getBezierEasing(
                    outX, outY, inX, inY
                  ).get
                  ; (keyframeMetadata.__fnct as any)[i] = fnc
                }
              } else if (keyframeMetadata.__fnct) {
                fnc = keyframeMetadata.__fnct as any
              } else {
                outX = keyData.o.x as number
                outY = keyData.o.y as number
                inX = keyData.i.x as number
                inY = keyData.i.y as number
                fnc = getBezierEasing(
                  outX, outY, inX, inY
                ).get
                keyData.keyframeMetadata = fnc
              }
              perc = fnc?.((frameNum - keyTime) / (nextKeyTime - keyTime))
            }
          }

          endValue = nextKeyData.s ?? keyData.e
          keyValue =
            keyData.h === 1
              ? keyData.s?.[i]
              : Number(keyData.s?.[i]) + ((endValue as number[])[i] - Number(keyData.s?.[i])) * Number(perc)

          if (keyValue !== undefined) {
            if (this.propType === 'multidimensional') {
              newValue[i] = keyValue as number
            } else {
              newValue = keyValue as unknown as Vector3
            }
          }

        }
      }
    }
    caching.lastIndex = iterationIndex

    return newValue
  }

  processEffectsSequence() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.elem) {
      throw new Error(`${this.constructor.name}: elem (ElementInterface) is not implemented`)
    }
    if (
      this.elem.globalData.frameId === this.frameId ||
      this.effectsSequence.length === 0
    ) {
      return
    }
    if (this.lock) {
      this.setVValue(this.pv as number | number[])

      return
    }
    this.lock = true
    this._mdf = Boolean(this._isFirstFrame)
    const len = this.effectsSequence.length
    let finalValue = this.kf
      ? this.pv
      : (this.data as VectorProperty<Keyframe[]>).k

    for (let i = 0; i < len; i++) {
      finalValue = this.effectsSequence[i](finalValue)
    }
    this.setVValue(finalValue as number | number[])
    this._isFirstFrame = false
    this.lock = false
    this.frameId = this.elem.globalData.frameId
  }

  setVValue(val?: number | number[] | Keyframe[]) {
    let multipliedValue

    if (typeof val === 'number' && this.propType === 'unidimensional') {
      multipliedValue = val * Number(this.mult)
      if (Math.abs((this.v as number) - multipliedValue) > 0.00001) {
        this.v = multipliedValue
        this._mdf = true
      }

      return
    }
    let i = 0
    const { length } = this.v as number[]

    while (i < length) {
      multipliedValue = (val as number[])[i] * Number(this.mult)
      if (Math.abs((this.v as number[])[i] - multipliedValue) > 0.00001) {
        ; (this.v as number[])[i] = multipliedValue
        this._mdf = true
      }
      i++
    }
  }

  valueAtTime(_a: number, _b?: number) {
    throw new Error(`${this.constructor.name}: Method valueAtTime is not implemented`)
  }
}
export class ValueProperty<
  T extends number | number[] = number,
> extends BaseProperty {
  override pv: T
  override v: T
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = 'unidimensional'
    this.mult = mult || 1
    this.data = data
    this.v = (data.k * (mult || 1)) as T
    this.pv = data.k as T
    this._mdf = false
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.k = false
    this.kf = false
    this.vel = 0
    this.effectsSequence = []
    this._isFirstFrame = true
    this.getValue = this.processEffectsSequence
  }
}

export class MultiDimensionalProperty<
  T extends any[] = Vector2,
> extends BaseProperty {
  override v: T
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty<T>,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = 'multidimensional'
    this.mult = mult || 1
    this.data = data
    this._mdf = false
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.k = false
    this.kf = false
    this.frameId = -1
    const { length } = data.k

    this.v = createTypedArray(ArrayType.Float32, length) as T
    this.pv = createTypedArray(ArrayType.Float32, length) as T
    this.vel = createTypedArray(ArrayType.Float32, length) as T
    for (let i = 0; i < length; i++) {
      this.v[i] = data.k[i] * this.mult
      this.pv[i] = data.k[i]
    }
    this._isFirstFrame = true
    this.effectsSequence = []
    this.getValue = this.processEffectsSequence
  }
}
export class KeyframedValueProperty extends BaseProperty {
  override pv: number
  override v: number
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty<Keyframe[]>,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = 'unidimensional'
    this.keyframes = data.k
    this.keyframesMetadata = []
    this.offsetTime = elem.data.st
    this.frameId = -1
    this._caching = {
      _lastKeyframeIndex: -1,
      lastFrame: this.initFrame,
      lastIndex: 0,
      value: 0,
    } as Caching
    this.k = true
    this.kf = true
    this.data = data
    this.mult = mult || 1
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.v = this.initFrame
    this.pv = this.initFrame
    this._isFirstFrame = true
    this.getValue = this.processEffectsSequence
    this.effectsSequence = [this.getValueAtCurrentTime.bind(this)]
  }
}

export class KeyframedMultidimensionalProperty<
  T extends any[] = Vector2,
> extends BaseProperty {
  override pv: T
  override v: T
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty<any[]>,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = 'multidimensional'
    const { length } = data.k
    let s
    let e
    let to
    let ti

    for (let i = 0; i < length - 1; i++) {
      if (data.k[i].to && data.k[i].s && data.k[i + 1]?.s) {
        s = data.k[i].s as number[]
        e = data.k[i + 1].s as number[]
        to = data.k[i].to as number[]
        ti = data.k[i].ti as number[]
        if (
          s.length === 2 &&
          !(s[0] === e[0] && s[1] === e[1]) &&
          pointOnLine2D(
            s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]
          ) &&
          pointOnLine2D(
            s[0],
            s[1],
            e[0],
            e[1],
            e[0] + ti[0],
            e[1] + ti[1]
          ) ||
          s.length === 3 &&
          !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) &&
          pointOnLine3D(
            s[0],
            s[1],
            s[2],
            e[0],
            e[1],
            e[2],
            s[0] + to[0],
            s[1] + to[1],
            s[2] + to[2]
          ) &&
          pointOnLine3D(
            s[0],
            s[1],
            s[2],
            e[0],
            e[1],
            e[2],
            e[0] + ti[0],
            e[1] + ti[1],
            e[2] + ti[2]
          )
        ) {
          data.k[i].to = null
          data.k[i].ti = null
        }
        if (
          s[0] === e[0] &&
          s[1] === e[1] &&
          to[0] === 0 &&
          to[1] === 0 &&
          ti[0] === 0 &&
          ti[1] === 0 && s.length === 2 || s[2] === e[2] && to[2] === 0 && ti[2] === 0
        ) {
          data.k[i].to = null
          data.k[i].ti = null
        }
      }
    }
    this.effectsSequence = [this.getValueAtCurrentTime.bind(this)]
    this.data = data
    this.keyframes = data.k
    this.keyframesMetadata = []
    this.offsetTime = elem.data.st
    this.k = true
    this.kf = true
    this._isFirstFrame = true
    this.mult = mult || 1
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.getValue = this.processEffectsSequence
    this.frameId = -1
    const arrLen: number = data.k[0].s.length || 0

    this.v = createTypedArray(ArrayType.Float32, arrLen) as T
    this.pv = createTypedArray(ArrayType.Float32, arrLen) as T
    for (let i = 0; i < arrLen; i++) {
      this.v[i] = this.initFrame
      this.pv[i] = this.initFrame
    }
    this._caching = {
      lastFrame: this.initFrame,
      lastIndex: 0,
      value: createTypedArray(ArrayType.Float32, arrLen) as T,
    } as unknown as Caching
  }
}

export class NoProperty extends BaseProperty {
  constructor() {
    super()
    this.propType = false
  }
}
