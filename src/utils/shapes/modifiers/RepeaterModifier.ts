import type { ShapeGroupData } from '@/elements/helpers/shapes/ShapeGroupData'
import type { SVGShapeData } from '@/elements/helpers/shapes/SVGShapeData'
import type {
  ElementInterfaceIntersect,
  Shape,
  ShapeDataInterface,
  VectorProperty,
} from '@/types'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { isArray } from '@/utils'
import { ShapeType } from '@/utils/enums'
import { Matrix } from '@/utils/Matrix'
import TransformPropertyFactory, { type TransformProperty } from '@/utils/properties/TransformProperty'
import PropertyFactory from '@/utils/PropertyFactory'
import { ShapeModifier } from '@/utils/shapes/modifiers/ShapeModifier'

export class RepeaterModifier extends ShapeModifier {
  arr: Shape[] = []
  c?: ValueProperty
  override data?: Shape = undefined
  elemsData: ShapeGroupData[] = []
  eo?: ValueProperty
  matrix?: Matrix
  o?: ValueProperty
  pMatrix?: Matrix
  pos?: number
  rMatrix?: Matrix
  sMatrix?: Matrix
  so?: ValueProperty
  tMatrix?: Matrix
  tr?: TransformProperty
  private _currentCopies?: number
  private _elements: Shape[] = []
  private _groups: Shape[] = []

  override addShapeToModifier(shapeData: SVGShapeData) {
    shapeData.pathsData = []
  }

  applyTransforms(
    pMatrix: Matrix,
    rMatrix: Matrix,
    sMatrix: Matrix,
    transform: TransformProperty,
    perc: number,
    inv?: boolean
  ) {
    if (!transform.s || !transform.p || !transform.a || !transform.r) {
      throw new Error(`${this.constructor.name}: Missing required data from Transform`)
    }
    const dir = inv ? -1 : 1,
      scaleX = transform.s.v[0] + (1 - transform.s.v[0]) * (1 - perc),
      scaleY = transform.s.v[1] + (1 - transform.s.v[1]) * (1 - perc)

    pMatrix.translate(
      transform.p.v[0] * dir * perc,
      transform.p.v[1] * dir * perc,
      transform.p.v[2]
    )
    rMatrix.translate(
      -(transform.a.v[0] as number), -(transform.a.v[1] as number), transform.a.v[2]
    )
    rMatrix.rotate(-transform.r.v * dir * perc)
    rMatrix.translate(
      transform.a.v[0] ?? 0, transform.a.v[1] ?? 0, transform.a.v[2]
    )
    sMatrix.translate(
      -(transform.a.v[0] ?? 0), -(transform.a.v[1] ?? 0), transform.a.v[2]
    )
    sMatrix.scale(inv ? 1 / scaleX : scaleX, inv ? 1 / scaleY : scaleY)
    sMatrix.translate(
      transform.a.v[0] ?? 0, transform.a.v[1] ?? 0, transform.a.v[2]
    )
  }

  changeGroupRender(elements: Shape[], renderFlag?: boolean) {
    const { length } = elements

    for (let i = 0; i < length; i++) {
      ; (elements[i] as Shape)._shouldRender = renderFlag
      if (elements[i]?.ty === ShapeType.Group) {
        this.changeGroupRender(elements[i]?.it as Shape[], renderFlag)
      }
    }
  }

  cloneElements(elements: Shape[]): Shape[] {
    const newElements = JSON.parse(JSON.stringify(elements)) as Shape[]

    this.resetElements(newElements)

    return newElements
  }

  override init(
    elem: ElementInterfaceIntersect,
    arr: Shape | Shape[],
    posFromProps?: number,
    elemsData: ShapeGroupData[] = []
  ) {
    if (!isArray(arr)) {
      throw new TypeError(`${this.constructor.name}: Method init, param arr must be array`)
    }
    let pos = Number(posFromProps)

    this.elem = elem
    this.arr = arr
    this.pos = pos
    this.elemsData = elemsData
    this._currentCopies = 0
    this._elements = []
    this._groups = []
    this.frameId = -1
    this.initDynamicPropertyContainer(elem)
    this.initModifierProperties(elem, arr[pos] as Shape)
    while (pos > 0) {
      pos--
      this._elements.unshift(arr[pos] as Shape)
    }
    if (this.dynamicProperties.length > 0) {
      this.k = true

      return
    }
    this.getValue(true)
  }

  override initModifierProperties(elem: ElementInterfaceIntersect,
    data: Shape) {

    this.getValue = this.processKeys
    this.c = PropertyFactory.getProp(
      elem,
      data.c as VectorProperty,
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.o = PropertyFactory.getProp(
      elem,
      data.o,
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    if (data.tr) {
      this.tr = TransformPropertyFactory.getTransformProperty(
        elem,
        data.tr,
        this as unknown as ElementInterfaceIntersect
      )
      this.so = PropertyFactory.getProp(
        elem,
        data.tr.so,
        0,
        0.01,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
      this.eo = PropertyFactory.getProp(
        elem,
        data.tr.eo,
        0,
        0.01,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
    }

    this.data = data
    if (this.dynamicProperties.length === 0) {
      this.getValue(true)
    }
    this._isAnimated = this.dynamicProperties.length > 0
    this.pMatrix = new Matrix()
    this.rMatrix = new Matrix()
    this.sMatrix = new Matrix()
    this.tMatrix = new Matrix()
    this.matrix = new Matrix()
  }

  processShapes(_isFirstFrame: boolean) {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (Shape) is not implemented`)
    }

    let items,
      itemsTransform,
      i,
      dir,
      cont: number,
      hasReloaded = false

    if (!this._mdf && !_isFirstFrame) {
      cont = Number(this._currentCopies)
      i = 0
      dir = 1
      while (cont) {
        items = this.elemsData[i]?.it ?? []
        // if (!items) {
        //   continue
        // }
        // itemsTransform = items[items.length - 1].transform.mProps.v.props
        ; (items[items.length - 1] as ShapeDataInterface).transform.mProps._mdf = false
        ; (items[items.length - 1] as ShapeDataInterface).transform.op._mdf = false
        cont--
        i += dir
      }

      return hasReloaded
    }

    const copies = Math.ceil(Number(this.c?.v))

    if (this._groups.length < copies) {
      while (this._groups.length < copies) {
        const group = {
          it: this.cloneElements(this._elements),
          ty: 'gr',
        } as Shape

        group.it?.push({
          a: {
            a: 0,
            ix: 1,
            k: [0, 0]
          },
          nm: 'Transform',
          o: {
            a: 0,
            ix: 7,
            k: 100
          },
          p: {
            a: 0,
            ix: 2,
            k: [0, 0]
          },
          r: {
            a: 1,
            ix: 6,
            k: [
              {
                e: 0,
                s: 0,
                t: 0
              }, {
                e: 0,
                s: 0,
                t: 1
              },
            ],
          },
          s: {
            a: 0,
            ix: 3,
            k: [100, 100]
          },
          sa: {
            a: 0,
            ix: 5,
            k: 0
          },
          sk: {
            a: 0,
            ix: 4,
            k: 0
          },
          ty: ShapeType.Transform,
        } as Shape)

        this.arr.splice(
          0, 0, group
        )
        this._groups.splice(
          0, 0, group
        )

        if (this._currentCopies) {
          this._currentCopies++
        } else {
          this._currentCopies = 1
        }
      }
      this.elem?.reloadShapes()
      hasReloaded = true
    }
    cont = 0
    let shouldRender
    const length = this._groups.length - 1

    for (i = 0; i <= length - 1; i++) {
      shouldRender = cont < copies
      if (this._groups[i]) {
        ; (this._groups[i] as Shape)._shouldRender = shouldRender
      }

      this.changeGroupRender(this._groups[i]?.it ?? [], shouldRender)
      if (!shouldRender) {
        const elems = this.elemsData[i]?.it ?? [],
          transformData = elems[elems.length - 1]

        if (transformData) {
          if (transformData.transform.op.v === 0) {
            transformData.transform.op._mdf = false
          } else {
            transformData.transform.op._mdf = true
            transformData.transform.op.v = 0
          }
        }

      }
      cont++
    }

    this._currentCopies = copies

    if (
      !this.matrix ||
      !this.pMatrix ||
      !this.rMatrix ||
      !this.sMatrix ||
      !this.tMatrix
    ) {
      throw new Error(`${this.constructor.name}: Could not set Matrix`)
    }

    if (!this.tr) {
      throw new Error(`${this.constructor.name}: Transformproperty is not set`)
    }

    const offset = Number(this.o?.v),
      offsetModulo = offset % 1,
      roundOffset = offset > 0 ? Math.floor(offset) : Math.ceil(offset),
      pProps = this.pMatrix.props,
      rProps = this.rMatrix.props,
      sProps = this.sMatrix.props

    this.pMatrix.reset()
    this.rMatrix.reset()
    this.sMatrix.reset()
    this.tMatrix.reset()
    this.matrix.reset()
    let iteration = 0

    if (offset > 0) {
      while (iteration < roundOffset) {
        this.applyTransforms(
          this.pMatrix,
          this.rMatrix,
          this.sMatrix,
          this.tr,
          1,
          false
        )
        iteration++
      }
      if (offsetModulo) {
        this.applyTransforms(
          this.pMatrix,
          this.rMatrix,
          this.sMatrix,
          this.tr,
          offsetModulo,
          false
        )
        iteration += offsetModulo
      }
    } else if (offset < 0) {
      while (iteration > roundOffset) {
        this.applyTransforms(
          this.pMatrix,
          this.rMatrix,
          this.sMatrix,
          this.tr,
          1,
          true
        )
        iteration--
      }
      if (offsetModulo) {
        this.applyTransforms(
          this.pMatrix,
          this.rMatrix,
          this.sMatrix,
          this.tr,
          -offsetModulo,
          true
        )
        iteration -= offsetModulo
      }
    }
    i = this.data.m === 1 ? 0 : this._currentCopies - 1
    dir = this.data.m === 1 ? 1 : -1
    cont = this._currentCopies
    let j

    while (cont) {
      items = this.elemsData[i]?.it ?? []
      itemsTransform = items[items.length - 1]?.transform.mProps.v.props ?? []
      const { length: jLen } = itemsTransform

      if (items[items.length - 1]) {
        ; (items[items.length - 1] as ShapeDataInterface).transform.mProps._mdf = true
        ; (items[items.length - 1] as ShapeDataInterface).transform.op._mdf = true
        ; (items[items.length - 1] as ShapeDataInterface).transform.op.v =
            this._currentCopies === 1
              ? Number(this.so?.v)
              : Number(this.so?.v) +
                (Number(this.eo?.v) - Number(this.so?.v)) *
                (i / (this._currentCopies - 1))
      }

      if (iteration === 0) {
        this.matrix.reset()
        for (j = 0; j < jLen; j++) {
          itemsTransform[j] = this.matrix.props[j] ?? 0
        }
      } else {
        if (
          i !== 0 && dir === 1 ||
          i !== this._currentCopies - 1 && dir === -1
        ) {
          this.applyTransforms(
            this.pMatrix,
            this.rMatrix,
            this.sMatrix,
            this.tr,
            1,
            false
          )
        }
        this.matrix.transform(
          rProps[0] ?? 0,
          rProps[1] ?? 0,
          rProps[2] ?? 0,
          rProps[3] ?? 0,
          rProps[4] ?? 0,
          rProps[5] ?? 0,
          rProps[6] ?? 0,
          rProps[7] ?? 0,
          rProps[8] ?? 0,
          rProps[9] ?? 0,
          rProps[10] ?? 0,
          rProps[11] ?? 0,
          rProps[12] ?? 0,
          rProps[13] ?? 0,
          rProps[14] ?? 0,
          rProps[15] ?? 0
        )
        this.matrix.transform(
          sProps[0] ?? 0,
          sProps[1] ?? 0,
          sProps[2] ?? 0,
          sProps[3] ?? 0,
          sProps[4] ?? 0,
          sProps[5] ?? 0,
          sProps[6] ?? 0,
          sProps[7] ?? 0,
          sProps[8] ?? 0,
          sProps[9] ?? 0,
          sProps[10] ?? 0,
          sProps[11] ?? 0,
          sProps[12] ?? 0,
          sProps[13] ?? 0,
          sProps[14] ?? 0,
          sProps[15] ?? 0
        )
        this.matrix.transform(
          pProps[0] ?? 0,
          pProps[1] ?? 0,
          pProps[2] ?? 0,
          pProps[3] ?? 0,
          pProps[4] ?? 0,
          pProps[5] ?? 0,
          pProps[6] ?? 0,
          pProps[7] ?? 0,
          pProps[8] ?? 0,
          pProps[9] ?? 0,
          pProps[10] ?? 0,
          pProps[11] ?? 0,
          pProps[12] ?? 0,
          pProps[13] ?? 0,
          pProps[14] ?? 0,
          pProps[15] ?? 0
        )

        for (j = 0; j < jLen; j++) {
          itemsTransform[j] = this.matrix.props[j] ?? 0
        }
        this.matrix.reset()
      }
      iteration++
      cont--
      i += dir
    }

    return hasReloaded
  }

  resetElements(elements: Shape[]) {
    const { length } = elements

    for (let i = 0; i < length; i++) {
      ; (elements[i] as Shape)._processed = false

      const { it } = elements[i] ?? {}

      if (elements[i]?.ty === ShapeType.Group && it) {
        this.resetElements(it)
      }
    }
  }
}
