import type {
  ElementInterfaceIntersect,
  Shape,
  Vector2,
  Vector3,
  VectorProperty,
} from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'

import { degToRads } from '@/utils'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import Matrix from '@/utils/Matrix'
import {
  BaseProperty,
  type MultiDimensionalProperty,
  type ValueProperty,
} from '@/utils/Properties'
import PropertyFactory from '@/utils/PropertyFactory'
export default class TransformProperty extends BaseProperty {
  _isDirty?: boolean
  _opMdf?: boolean
  _transformCachingAtTime?: {
    v: Matrix
  }
  a?: MultiDimensionalProperty<number[]>
  appliedTransformations: number
  autoOriented?: boolean
  override data: Shape
  override elem: ElementInterfaceIntersect
  // frameId: number
  o?: ValueProperty
  opacity?: number
  or?: MultiDimensionalProperty<Vector3>
  p?: MultiDimensionalProperty<Vector3>
  pre: Matrix
  override propType: 'transform'
  px?: ValueProperty
  py?: ValueProperty
  pz?: ValueProperty
  r?: ValueProperty
  rx?: ValueProperty
  ry?: ValueProperty
  rz?: ValueProperty
  override s?: MultiDimensionalProperty<Vector3>
  sa?: ValueProperty
  sk?: ValueProperty
  override v: Matrix
  private defaultVector: Vector2 = [0, 0]
  constructor(
    elem: ElementInterfaceIntersect,
    data: Shape,
    container: ElementInterfaceIntersect
  ) {
    super()
    this.elem = elem
    this.frameId = -1
    this.propType = 'transform'
    this.data = data
    this.v = new Matrix()
    // Precalculated matrix with non animated properties
    this.pre = new Matrix()
    this.appliedTransformations = 0
    this.initDynamicPropertyContainer(container || elem)
    if (data.p && 's' in data.p) {
      this.px = PropertyFactory.getProp(
        elem,
        (data.p as any).x,
        0,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.py = PropertyFactory.getProp(
        elem,
        (data.p as any).y,
        0,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      if ('z' in data.p) {
        this.pz = PropertyFactory.getProp(
          elem,
          data.p.z as any,
          0,
          0,
          this as unknown as ElementInterfaceIntersect
        ) as ValueProperty
      }
    } else {
      this.p = PropertyFactory.getProp(
        elem,
        data.p || ({ k: [0, 0, 0] } as any),
        1,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as MultiDimensionalProperty<Vector3>
    }
    if ('rx' in data) {
      this.rx = PropertyFactory.getProp(
        elem,
        data.rx,
        0,
        degToRads,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.ry = PropertyFactory.getProp(
        elem,
        data.ry,
        0,
        degToRads,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.rz = PropertyFactory.getProp(
        elem,
        data.rz,
        0,
        degToRads,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      if (data.or?.k[0].ti) {
        const { length } = data.or.k
        for (let i = 0; i < length; i++) {
          data.or.k[i].to = null
          data.or.k[i].ti = null
        }
      }
      this.or = PropertyFactory.getProp(
        elem,
        data.or as VectorProperty<number[]>,
        1,
        degToRads,
        this as unknown as ElementInterfaceIntersect
      ) as MultiDimensionalProperty<Vector3>
      this.or.sh = true as any
    } else {
      this.r = PropertyFactory.getProp(
        elem,
        data.r || ({ k: 0 } as any),
        0,
        degToRads,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
    }
    if (data.sk) {
      this.sk = PropertyFactory.getProp(
        elem,
        data.sk,
        0,
        degToRads,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.sa = PropertyFactory.getProp(
        elem,
        data.sa,
        0,
        degToRads,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
    }
    this.a = PropertyFactory.getProp(
      elem,
      data.a || ({ k: [0, 0, 0] } as any),
      1,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty<Vector3>
    this.s = PropertyFactory.getProp(
      elem,
      data.s || ({ k: [100, 100, 100] } as any),
      1,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty<Vector3>
    // Opacity is not part of the transform properties, that's why it won't use this.dynamicProperties. That way transforms won't get updated if opacity changes.
    if (data.o) {
      this.o = PropertyFactory.getProp(
        elem,
        data.o,
        0,
        0.01,
        elem
      ) as ValueProperty
    } else {
      this.o = { _mdf: false, v: 1 } as any
    }
    this._isDirty = true
    if (!this.dynamicProperties?.length) {
      this.getValue(true)
    }
  }
  override addDynamicProperty(prop: DynamicPropertyContainer) {
    super.addDynamicProperty(prop)
    this.elem?.addDynamicProperty(prop)
    this._isDirty = true
  }
  applyToMatrix(mat: Matrix) {
    if (!this.data) {
      throw new Error(
        `${this.constructor.name}: data (Shape) is not implemented`
      )
    }
    const _mdf = this._mdf
    this.iterateDynamicProperties()
    this._mdf = this._mdf || _mdf
    if (this.a) {
      mat.translate(-this.a.v[0], -this.a.v[1], this.a.v[2])
    }
    if (this.s) {
      mat.scale(this.s.v[0], this.s.v[1], this.s.v[2])
    }
    if (this.sk) {
      mat.skewFromAxis(-this.sk.v, Number(this.sa?.v))
    }
    if (this.r) {
      mat.rotate(-Number(this.r.v))
    } else {
      mat
        .rotateZ(-Number(this.rz?.v))
        .rotateY(Number(this.ry?.v))
        .rotateX(Number(this.rx?.v))
        .rotateZ(-Number(this.or?.v[2]))
        .rotateY(Number(this.or?.v[1]))
        .rotateX(Number(this.or?.v[0]))
    }
    if (this.data.p && 's' in this.data.p) {
      if ('z' in this.data.p) {
        mat.translate(
          Number(this.px?.v),
          Number(this.py?.v),
          -Number(this.pz?.v)
        )
      } else {
        mat.translate(Number(this.px?.v), Number(this.py?.v), 0)
      }
    } else {
      mat.translate(
        Number(this.p?.v[0]),
        Number(this.p?.v[1]),
        -Number(this.p?.v[2])
      )
    }
  }
  autoOrient() {
    throw new Error(
      `${this.constructor.name}: Method autoOrient not implemented`
    )
  }
  override getValue(forceRender?: boolean) {
    if (this.elem.globalData.frameId === this.frameId) {
      return
    }
    if (this._isDirty) {
      this.precalculateMatrix()
      this._isDirty = false
    }

    this.iterateDynamicProperties()

    if (this._mdf || forceRender) {
      let frameRate
      this.v.cloneFromProps(this.pre.props)
      if (this.appliedTransformations < 1 && this.a) {
        this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2])
      }
      if (this.appliedTransformations < 2 && this.s) {
        this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2])
      }
      if (this.sk && this.appliedTransformations < 3) {
        this.v.skewFromAxis(-this.sk.v, Number(this.sa?.v))
      }
      if (this.r && this.appliedTransformations < 4) {
        this.v.rotate(-Number(this.r.v))
      } else if (!this.r && this.appliedTransformations < 4) {
        this.v
          .rotateZ(-Number(this.rz?.v))
          .rotateY(Number(this.ry?.v))
          .rotateX(Number(this.rx?.v))
          .rotateZ(-Number(this.or?.v[2]))
          .rotateY(Number(this.or?.v[1]))
          .rotateX(Number(this.or?.v[0]))
      }
      if (this.autoOriented) {
        let v1: Vector2, v2: Vector2
        frameRate = this.elem.globalData.frameRate
        if (this.p?.keyframes) {
          if (
            Number(this.p._caching?.lastFrame) + Number(this.p.offsetTime) <=
            this.p.keyframes[0].t
          ) {
            v1 = this.p.getValueAtTime(
              (this.p.keyframes[0].t + 0.01) / frameRate,
              0
            )
            v2 = this.p.getValueAtTime(
              Number(this.p.keyframes[0].t) / frameRate,
              0
            )
          } else if (
            Number(this.p._caching?.lastFrame) + Number(this.p.offsetTime) >=
            this.p.keyframes[this.p.keyframes.length - 1].t
          ) {
            v1 = this.p.getValueAtTime(
              this.p.keyframes[this.p.keyframes.length - 1].t / frameRate,
              0
            )
            v2 = this.p.getValueAtTime(
              (this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) /
                frameRate,
              0
            )
          } else {
            v1 = this.p.pv as Vector2
            v2 = this.p.getValueAtTime(
              (Number(this.p._caching?.lastFrame) +
                Number(this.p.offsetTime) -
                0.01) /
                frameRate,
              Number(this.p.offsetTime)
            )
          }
        } else if (this.px?.keyframes && this.py?.keyframes) {
          v1 = [0, 0] // TODO: Used to be []. Check if works
          v2 = [0, 0]
          const px = this.px,
            py = this.py
          if (
            Number(px._caching?.lastFrame) + Number(px.offsetTime) <=
            Number(px.keyframes?.[0].t)
          ) {
            v1[0] = px.getValueAtTime(
              (Number(px.keyframes?.[0].t) + 0.01) / frameRate,
              0
            )
            v1[1] = py.getValueAtTime(
              (Number(py.keyframes?.[0].t) + 0.01) / frameRate,
              0
            )
            v2[0] = px.getValueAtTime(
              Number(px.keyframes?.[0].t) / frameRate,
              0
            )
            v2[1] = py.getValueAtTime(
              Number(py.keyframes?.[0]?.t) / frameRate,
              0
            )
          } else if (
            Number(px._caching?.lastFrame) + Number(px.offsetTime) >=
            Number(px.keyframes?.[Number(px.keyframes?.length) - 1].t)
          ) {
            v1[0] = px.getValueAtTime(
              Number(px.keyframes?.[Number(px.keyframes?.length) - 1].t) /
                frameRate,
              0
            )
            v1[1] = py.getValueAtTime(
              Number(py.keyframes?.[Number(py.keyframes?.length) - 1].t) /
                frameRate,
              0
            )
            v2[0] = px.getValueAtTime(
              (Number(px.keyframes?.[Number(px.keyframes?.length) - 1].t) -
                0.01) /
                frameRate,
              0
            )
            v2[1] = py.getValueAtTime(
              (Number(py.keyframes?.[Number(py.keyframes?.length) - 1].t) -
                0.01) /
                frameRate,
              0
            )
          } else {
            v1 = [px.pv, py.pv]
            v2[0] = px.getValueAtTime(
              (Number(px._caching?.lastFrame) + Number(px.offsetTime) - 0.01) /
                frameRate,
              px.offsetTime
            )
            v2[1] = py.getValueAtTime(
              (Number(py._caching?.lastFrame) + Number(py.offsetTime) - 0.01) /
                frameRate,
              py.offsetTime
            )
          }
        } else {
          v2 = this.defaultVector
          v1 = v2
        }
        this.v.rotate(-Math.atan2(v1[1] - v2[1], v1[0] - v2[0]))
      }
      if (this.data.p && 's' in this.data.p) {
        if ('z' in this.data.p) {
          this.v.translate(
            Number(this.px?.v),
            Number(this.py?.v),
            -Number(this.pz?.v)
          )
        } else {
          this.v.translate(Number(this.px?.v), Number(this.py?.v), 0)
        }
      } else if (this.p) {
        this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
      }
    }
    this.frameId = this.elem.globalData.frameId!
  }

  precalculateMatrix() {
    this.appliedTransformations = 0
    this.pre.reset()

    if (this.a?.effectsSequence?.length) {
      return
    }

    if (!this.a) {
      throw new Error(`${this.constructor.name}: Cannot read 'a' value`)
    }

    this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2])
    this.appliedTransformations = 1

    if (this.s?.effectsSequence?.length) {
      return
    }

    if (!this.s) {
      throw new Error(`${this.constructor.name}: Cannot read 's' value`)
    }

    this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2])
    this.appliedTransformations = 2

    if (this.sk) {
      if (this.sk.effectsSequence?.length || this.sa?.effectsSequence?.length) {
        return
      }
      this.pre.skewFromAxis(-this.sk.v, Number(this.sa?.v))
      this.appliedTransformations = 3
    }
    if (this.r) {
      if (!this.r.effectsSequence?.length) {
        this.pre.rotate(-Number(this.r.v))
        this.appliedTransformations = 4
      }
      return
    }

    if (
      !this.rz?.effectsSequence.length &&
      !this.ry?.effectsSequence.length &&
      !this.rx?.effectsSequence.length &&
      !this.or?.effectsSequence.length
    ) {
      this.pre
        .rotateZ(-Number(this.rz?.v))
        .rotateY(Number(this.ry?.v))
        .rotateX(Number(this.rx?.v))
        .rotateZ(-Number(this.or?.v[2]))
        .rotateY(this.or?.v[1])
        .rotateX(this.or?.v[0])
      this.appliedTransformations = 4
    }
  }
  setGroupProperty(_propertyGroup: LayerExpressionInterface) {
    throw new Error(
      `${this.constructor.name}: Method setGroupProperty is not implemented`
    )
  }
}

const TransformPropertyFactory = {
  getTransformProperty: (
    elem: ElementInterfaceIntersect,
    data: Shape,
    container: ElementInterfaceIntersect
  ) => new TransformProperty(elem, data, container),
}

export { TransformPropertyFactory }
