import type { HCompElement } from '@/elements/html/HCompElement'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  Keyframe,
  LottieLayer,
  Shape,
  Transformer,
  Vector3,
  VectorProperty,
} from '@/types'
import type { TransformProperty } from '@/utils/properties/TransformProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { FrameElement } from '@/elements/helpers/FrameElement'
import { degToRads } from '@/utils/helpers/constants'
import { Matrix } from '@/utils/Matrix'
import PropertyFactory from '@/utils/PropertyFactory'

export class HCameraElement extends FrameElement {
  _prevMat: Matrix
  a?: ValueProperty<Vector3>
  override comp?: HCompElement
  mat?: Matrix
  or?: ValueProperty<Vector3>
  p?: ValueProperty<number[]>
  pe?: ValueProperty
  px?: ValueProperty
  py?: ValueProperty
  pz?: ValueProperty
  rx?: ValueProperty
  ry?: ValueProperty
  rz?: ValueProperty
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.initFrame()
    this.initBaseData(
      data, globalData, comp
    )
    this.initHierarchy()
    this.pe = PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect,
      data.pe,
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    if ((data.ks.p as unknown as VectorProperty<{ s: unknown }> | undefined)?.s) {
      const prop = data.ks.p as unknown as {
        x: VectorProperty
        y: VectorProperty
        z: VectorProperty
      }

      this.px = PropertyFactory.getProp(
        this as unknown as ElementInterfaceIntersect,
        prop.x,
        1,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.py = PropertyFactory.getProp(
        this as unknown as ElementInterfaceIntersect,
        prop.y,
        1,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.pz = PropertyFactory.getProp(
        this as unknown as ElementInterfaceIntersect,
        prop.z,
        1,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
    } else {
      this.p = PropertyFactory.getProp(
        this as unknown as ElementInterfaceIntersect,
        data.ks.p,
        1,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty<number[]>
    }
    if (data.ks.a) {
      this.a = PropertyFactory.getProp(
        this as unknown as ElementInterfaceIntersect,
        data.ks.a,
        1,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty<Vector3>
    }
    if (data.ks.or?.k.length && data.ks.or.k[0]?.to) {
      const { length } = data.ks.or.k

      for (let i = 0; i < length; i++) {
        const thisK = data.ks.or.k[i]

        if (!thisK) {
          continue
        }

        thisK.to = null
        thisK.ti = null
      }
    }
    this.or = PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect,
      data.ks.or as VectorProperty<Keyframe[]>,
      1,
      degToRads,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty<Vector3>
    this.or.sh = true as unknown as Shape
    this.rx = PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect,
      data.ks.rx,
      0,
      degToRads,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.ry = PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect,
      data.ks.ry,
      0,
      degToRads,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.rz = PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect,
      data.ks.rz,
      0,
      degToRads,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.mat = new Matrix()
    this._prevMat = new Matrix()
    this._isFirstFrame = true

    // TODO: find a better way to make the HCamera element to be compatible with the LayerInterface and TransformInterface.
    this.finalTransform = { mProp: this as unknown as TransformProperty } as Transformer
  }

  createElements() {
    // Pass Through
  }

  override getBaseElement() {
    return null
  }

  hide() {
    // Pass Through
  }

  prepareFrame(num: number) {
    this.prepareProperties(num, true)
  }

  renderFrame(_val?: number) {
    if (!this.globalData?.compSize) {
      throw new Error(`${this.constructor.name}: globalData->compSize is not implemented`)
    }
    let isFirst = this._isFirstFrame

    if (this.hierarchy) {
      const { length } = this.hierarchy

      for (let i = 0; i < length; i++) {
        isFirst = this.hierarchy[i]?.finalTransform?.mProp._mdf || isFirst
      }
    }
    if (
      isFirst ||
      this.pe?._mdf ||
      this.p?._mdf ||
      this.px && (this.px._mdf || this.py?._mdf || this.pz?._mdf) ||
      this.rx?._mdf ||
      this.ry?._mdf ||
      this.rz?._mdf ||
      this.or?._mdf ||
      this.a?._mdf
    ) {
      this.mat?.reset()

      if (this.hierarchy) {
        const len = this.hierarchy.length - 1

        for (let i = len; i >= 0; i--) {
          const mTransf = this.hierarchy[i]?.finalTransform?.mProp

          if (
            !mTransf?.p ||
            !mTransf.or ||
            !mTransf.rx ||
            !mTransf.ry ||
            !mTransf.rz ||
            !mTransf.s ||
            !mTransf.a
          ) {
            continue
          }
          this.mat?.translate(
            -mTransf.p.v[0], -mTransf.p.v[1], mTransf.p.v[2]
          )
          this.mat
            ?.rotateX(-mTransf.or.v[0])
            .rotateY(-mTransf.or.v[1])
            .rotateZ(mTransf.or.v[2])
          this.mat
            ?.rotateX(-mTransf.rx.v)
            .rotateY(-mTransf.ry.v)
            .rotateZ(mTransf.rz.v)
          this.mat?.scale(
            1 / mTransf.s.v[0],
            1 / mTransf.s.v[1],
            1 / mTransf.s.v[2]
          )
          this.mat?.translate(
            mTransf.a.v[0] ?? 0, mTransf.a.v[1] ?? 0, mTransf.a.v[2]
          )
        }
      }
      if (this.p) {
        this.mat?.translate(
          -(this.p.v[0] ?? 0), -(this.p.v[1] ?? 0), this.p.v[2]
        )
      } else if (this.px && this.py && this.pz) {
        this.mat?.translate(
          -this.px.v, -this.py.v, this.pz.v
        )
      }
      if (this.a) {
        let diffVector: number[] = []

        if (this.p) {
          diffVector = [
            this.p.v[0] ?? 0 - this.a.v[0],
            this.p.v[1] ?? 0 - this.a.v[1],
            this.p.v[2] ?? 0 - this.a.v[2],
          ]
        } else if (this.px && this.py && this.pz) {
          diffVector = [
            this.px.v - this.a.v[0],
            this.py.v - this.a.v[1],
            this.pz.v - this.a.v[2],
          ]
        }
        const mag = Math.sqrt(Math.pow(diffVector[0] as number, 2) +
          Math.pow(diffVector[1] as number, 2) +
          Math.pow(diffVector[2] as number, 2))
        // var lookDir = getNormalizedPoint(getDiffVector(this.a.v,this.p.v));
        const lookDir = [
          diffVector[0] as number / mag,
          diffVector[1] as number / mag,
          diffVector[2] as number / mag,
        ]
        const lookLengthOnXZ = Math.sqrt(lookDir[2] as number * (lookDir[2] as number) + (lookDir[0] as number) * (lookDir[0] as number)),
          mRotationX = Math.atan2(lookDir[1] as number, lookLengthOnXZ),
          mRotationY = Math.atan2(lookDir[0] as number, -(lookDir[2] as number))

        this.mat?.rotateY(mRotationY).rotateX(-mRotationX)
      }
      if (this.rx && this.ry && this.rz) {
        this.mat?.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v)
      }

      if (this.or) {
        this.mat
          ?.rotateX(-this.or.v[0])
          .rotateY(-this.or.v[1])
          .rotateZ(this.or.v[2])
      }
      this.mat?.translate(
        this.globalData.compSize.w / 2,
        this.globalData.compSize.h / 2,
        0
      )
      this.mat?.translate(
        0, 0, this.pe?.v
      )

      const hasMatrixChanged = !this._prevMat.equals(this.mat)

      if (
        (hasMatrixChanged || this.pe?._mdf) &&
        this.comp?.threeDElements
      ) {
        const { length: len } = this.comp.threeDElements
        let comp
        let perspectiveStyle
        let containerStyle: CSSStyleDeclaration

        for (let i = 0; i < len; i++) {
          comp = this.comp.threeDElements[i]
          if (comp?.type !== '3d') {
            continue
          }
          if (hasMatrixChanged) {
            const matValue = this.mat?.toCSS()

            containerStyle = comp.container.style
            if (matValue) {
              containerStyle.transform = matValue
            }
          }
          if (this.pe?._mdf) {
            perspectiveStyle = comp.perspectiveElem.style
            perspectiveStyle.perspective = `${this.pe.v}px`
          }
        }
        this.mat?.clone(this._prevMat)
      }
    }
    this._isFirstFrame = false
  }

  setup() {
    const { length } = this.comp?.threeDElements ?? []

    for (let i = 0; i < length; i++) {
      // [perspectiveElem,container]
      const comp = this.comp?.threeDElements[i]

      if (comp?.type === '3d') {
        const perspectiveStyle = comp.perspectiveElem.style,
          containerStyle = comp.container.style,
          perspective = `${this.pe?.v}px`,
          origin = '0px 0px 0px',
          matrix = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'

        perspectiveStyle.perspective = perspective
        containerStyle.transformOrigin = origin
        perspectiveStyle.transform = matrix
      }
    }
  }
}
