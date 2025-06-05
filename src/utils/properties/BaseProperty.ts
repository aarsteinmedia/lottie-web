/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {
  Caching,
  CompElementInterface,
  DocumentData,
  EffectFunction,
  ElementInterfaceIntersect,
  ExpressionProperty,
  Keyframe,
  KeyframesMetadata,
  Shape,
  Vector2,
  Vector3,
  Vector4,
  VectorProperty,
} from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type Matrix from '@/utils/Matrix'
import type KeyframedValueProperty from '@/utils/properties/KeyframedValueProperty'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ValueProperty from '@/utils/properties/ValueProperty'
import type ShapePath from '@/utils/shapes/ShapePath'

import { buildBezierData } from '@/utils/Bezier'
import { getBezierEasing } from '@/utils/BezierFactory'
import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import { degToRads, initialDefaultFrame } from '@/utils/helpers/constants'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

const quaternionToEuler = (out: Vector3, quat: Vector4) => {
    const qx = quat[0],
      qy = quat[1],
      qz = quat[2],
      qw = quat[3],
      heading = Math.atan2(2 * qy * qw - 2 * qx * qz,
        1 - 2 * qy * qy - 2 * qz * qz),
      attitude = Math.asin(2 * qx * qy + 2 * qz * qw),
      bank = Math.atan2(2 * qx * qw - 2 * qy * qz,
        1 - 2 * qx * qx - 2 * qz * qz)

    out[0] = heading / degToRads
    out[1] = attitude / degToRads
    out[2] = bank / degToRads
  },
  createQuaternion = (values: Vector3): Vector4 => {
    const heading = values[0] * degToRads,
      attitude = values[1] * degToRads,
      bank = values[2] * degToRads,
      c1 = Math.cos(heading / 2),
      c2 = Math.cos(attitude / 2),
      c3 = Math.cos(bank / 2),
      s1 = Math.sin(heading / 2),
      s2 = Math.sin(attitude / 2),
      s3 = Math.sin(bank / 2),
      w = c1 * c2 * c3 - s1 * s2 * s3,
      x = s1 * s2 * c3 + c1 * c2 * s3,
      y = s1 * c2 * c3 + c1 * s2 * s3,
      z = c1 * s2 * c3 - s1 * c2 * s3

    return [x,
      y,
      z,
      w]
  },
  /**
   * Based on Toji's https://github.com/toji/gl-matrix/.
   */
  slerp = (
    a: Vector4, b: Vector4, t: number
  ): Vector4 => {
    const out: Vector4 = [0,
        0,
        0,
        0],
      ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3]
    let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3],
      /**
       *
       */
      omega,
      cosom: number,
      sinom,
      scale0,
      scale1

    cosom = ax * bx + ay * by + az * bz + aw * bw
    if (cosom < 0.0) {
      cosom = -cosom
      bx = -bx
      by = -by
      bz = -bz
      bw = -bw
    }
    if (1.0 - cosom > 0.000001) {
      omega = Math.acos(cosom)
      sinom = Math.sin(omega)
      scale0 = Math.sin((1.0 - t) * omega) / sinom
      scale1 = Math.sin(t * omega) / sinom
    } else {
      scale0 = 1.0 - t
      scale1 = t
    }
    out[0] = scale0 * ax + scale1 * bx
    out[1] = scale0 * ay + scale1 * by
    out[2] = scale0 * az + scale1 * bz
    out[3] = scale0 * aw + scale1 * bw

    return out
  }

export default abstract class BaseProperty extends DynamicPropertyContainer {
  _caching?: Caching
  _cachingAtTime?: Caching
  _isFirstFrame?: boolean
  _name?: string
  _placeholder?: boolean
  comp?: CompElementInterface
  e?: ValueProperty | { v: number }
  effectsSequence: EffectFunction[] = []
  elem?: ElementInterfaceIntersect
  frameExpressionId?: number
  frameId?: number
  g?: unknown
  initFrame = initialDefaultFrame
  k?: boolean
  keyframesMetadata: KeyframesMetadata[] = []
  kf?: boolean | null
  lock?: boolean
  loopIn?: (type: string, duration: number, durationFlag?: boolean) => void
  loopOut?: (type: string, duration: number, durationFlag?: boolean) => void
  mult?: number
  numKeys?: number
  offsetTime = 0
  propertyGroup?: LayerExpressionInterface
  pv?: string | number | number[] | DocumentData | ShapePath
  s?: ValueProperty | MultiDimensionalProperty<Vector3>
  sh?: Shape
  smooth?: (width: number, samples: number) => void
  textIndex?: number
  textTotal?: number
  v?: string | number | number[] | Matrix | DocumentData | ShapePath
  value?: number | number[]
  vel?: number | number[]
  x?: boolean
  addEffect(effectFunction: EffectFunction) {
    this.effectsSequence.push(effectFunction)
    this.container?.addDynamicProperty(this as DynamicPropertyContainer)
  }

  getSpeedAtTime(_frameNum: number) {
    throw new Error(`${this.constructor.name}: Method getSpeedAtTime is not implemented`)
  }

  getValueAtCurrentTime() {
    this._caching = this._caching ?? {} as Caching

    if (!this.keyframes) {
      return
    }

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

  getValueAtTime(_val1?: unknown, _val2?: unknown): unknown {
    throw new Error(`${this.constructor.name}: Method getValueAtTime is not implemented`)
  }

  getVelocityAtTime(_frameNum: number): number | number[] {
    throw new Error(`${this.constructor.name}: Method getVelocityAtTime is not implemented`)
  }

  initiateExpression(
    _elem: ElementInterfaceIntersect, _data: ExpressionProperty, _property: KeyframedValueProperty
  ): EffectFunction {
    throw new Error('Method not implemented')
  }

  interpolateValue(frameNum: number, caching: Caching = {} as Caching) {
    const offsetTime = Number(this.offsetTime)
    let newValue: Vector3 | ShapePath = [0,
      0,
      0]

    if (this.propType === PropType.MultiDimensional && this.pv) {
      newValue = createTypedArray(ArrayType.Float32,
        (this.pv as number[]).length) as Vector3
    }
    const {
      keyframes = [], keyframesMetadata, propType
    } = this
    let iterationIndex = caching.lastIndex || 0,
      i = iterationIndex,
      len = keyframes.length - 1,
      shouldInterpolate = true,
      keyData = keyframes[0],
      nextKeyData = keyframes[1]

    while (shouldInterpolate) {
      keyData = keyframes[i]
      nextKeyData = keyframes[i + 1]
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
    const keyframeMetadata = keyframesMetadata[i] ?? {}

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
        keyData.ti as Vector2
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
          }

          if (
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
      // eslint-disable-next-line unicorn/consistent-destructuring
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
                keyframeMetadata.__fnct = keyframeMetadata.__fnct ?? [] as any
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
            if (propType === PropType.MultiDimensional) {
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
    if (this.elem.globalData?.frameId === this.frameId) {
      return 0
    }
    if (this.effectsSequence.length === 0) {
      this._mdf = false

      return 0
    }
    if (this.lock && this.pv) {
      this.setVValue(this.pv as number)

      return 0
    }
    this.lock = true
    this._mdf = Boolean(this._isFirstFrame)
    const len = this.effectsSequence.length
    let finalValue = this.kf
      ? this.pv
      : (this.data as unknown as VectorProperty<Keyframe[]>).k

    for (let i = 0; i < len; i++) {
      finalValue = this.effectsSequence[i](finalValue)
    }
    this.setVValue(finalValue as number | number[])
    this._isFirstFrame = false
    this.lock = false
    this.frameId = this.elem.globalData?.frameId

    return 0
  }

  setVValue(val?: number | number[] | Keyframe[] | ShapePath) {
    let multipliedValue

    if (typeof val === 'number' && this.propType === PropType.UniDimensional) {
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

  speedAtTime(_frameNum: number) {
    throw new Error('Method is not implemented')
  }

  valueAtTime(_a: number, _b?: number) {
    throw new Error(`${this.constructor.name}: Method valueAtTime is not implemented`)
  }

  velocityAtTime(_frameNum: number) {
    throw new Error('Method is not implemented')
  }
}
