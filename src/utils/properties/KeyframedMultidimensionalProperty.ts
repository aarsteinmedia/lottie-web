import type {
  Caching, ElementInterfaceIntersect, Keyframe, Vector2, VectorProperty
} from '@/types'

import { pointOnLine2D, pointOnLine3D } from '@/utils/Bezier'
import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import { BaseProperty } from '@/utils/properties/BaseProperty'

export class KeyframedMultidimensionalProperty<
  T extends number[] = Vector2,
> extends BaseProperty {
  override pv: T
  override v: T
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty<Keyframe[]>,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = PropType.MultiDimensional
    const { length } = data.k
    let s,
      e,
      to,
      ti

    for (let i = 0; i < length - 1; i++) {
      if (data.k[i]?.to && data.k[i]?.s && data.k[i + 1]?.s) {
        s = data.k[i]?.s as number[]
        e = data.k[i + 1]?.s as number[]
        to = data.k[i]?.to as number[]
        ti = data.k[i]?.ti as number[]
        if (
          s.length === 2 &&
          !(s[0] === e[0] && s[1] === e[1]) &&
          pointOnLine2D(
            s[0] ?? 0, s[1] ?? 0, e[0] ?? 0, e[1] ?? 0, s[0] ?? 0 + (to[0] ?? 0), s[1] ?? 0 + (to[1] ?? 0)
          ) &&
          pointOnLine2D(
            s[0] ?? 0,
            s[1] ?? 0,
            e[0] ?? 0,
            e[1] ?? 0,
            e[0] ?? 0 + (ti[0] ?? 0),
            e[1] ?? 0 + (ti[1] ?? 0)
          ) ||
          s.length === 3 &&
          !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) &&
          pointOnLine3D(
            s[0] ?? 0,
            s[1] ?? 0,
            s[2] ?? 0,
            e[0] ?? 0,
            e[1] ?? 0,
            e[2] ?? 0,
            s[0] ?? 0 + (to[0] ?? 0),
            s[1] ?? 0 + (to[1] ?? 0),
            s[2] ?? 0 + (to[2] ?? 0)
          ) &&
          pointOnLine3D(
            s[0] ?? 0,
            s[1] ?? 0,
            s[2] ?? 0,
            e[0] ?? 0,
            e[1] ?? 0,
            e[2] ?? 0,
            e[0] ?? 0 + (ti[0] ?? 0),
            e[1] ?? 0 + (ti[1] ?? 0),
            e[2] ?? 0 + (ti[2] ?? 0)
          )
        ) {
          ; (data.k[i] as Keyframe).to = null
          ; (data.k[i] as Keyframe).ti = null
        }
        if (
          s[0] === e[0] &&
          s[1] === e[1] &&
          to[0] === 0 &&
          to[1] === 0 &&
          ti[0] === 0 &&
          ti[1] === 0 && s.length === 2 || s[2] === e[2] && to[2] === 0 && ti[2] === 0
        ) {
          ; (data.k[i] as Keyframe).to = null
          ; (data.k[i] as Keyframe).ti = null
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
    const arrLen: number = data.k[0]?.s?.length || 0

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