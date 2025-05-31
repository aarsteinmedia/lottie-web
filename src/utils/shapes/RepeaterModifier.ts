import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type {
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  Shape,
  VectorProperty,
} from '@/types'
import type { ValueProperty } from '@/utils/Properties'

import { ShapeType } from '@/utils/enums'
import Matrix from '@/utils/Matrix'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'
import TransformPropertyFactory, { type TransformProperty } from '@/utils/TransformProperty'

export default class RepeaterModifier extends ShapeModifier {
  arr: Shape[] = []
  c?: ValueProperty
  override data?: Shape
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
      -transform.a.v[0], -transform.a.v[1], transform.a.v[2]
    )
    rMatrix.rotate(-transform.r.v * dir * perc)
    rMatrix.translate(
      transform.a.v[0], transform.a.v[1], transform.a.v[2]
    )
    sMatrix.translate(
      -transform.a.v[0], -transform.a.v[1], transform.a.v[2]
    )
    sMatrix.scale(inv ? 1 / scaleX : scaleX, inv ? 1 / scaleY : scaleY)
    sMatrix.translate(
      transform.a.v[0], transform.a.v[1], transform.a.v[2]
    )
  }

  changeGroupRender(elements: Shape[], renderFlag?: boolean) {
    const { length } = elements

    for (let i = 0; i < length; i++) {
      elements[i]._render = renderFlag
      if (elements[i].ty === ShapeType.Group) {
        this.changeGroupRender(elements[i].it as Shape[], renderFlag)
      }
    }
  }

  cloneElements(elements: Shape[]): Shape[] {
    const newElements = JSON.parse(JSON.stringify(elements)) as Shape[]

    this.resetElements(newElements)

    return newElements
  }

  override init(
    elem: ElementInterfaceUnion,
    arr: Shape | Shape[],
    posFromProps?: number,
    elemsData: ShapeGroupData[] = []
  ) {
    if (!Array.isArray(arr)) {
      throw new TypeError(`${this.constructor.name}: Method init, param arr must be array`)
    }
    let pos = Number(posFromProps)

    this.elem = elem as ElementInterfaceIntersect
    this.arr = arr
    this.pos = pos
    this.elemsData = elemsData
    this._currentCopies = 0
    this._elements = []
    this._groups = []
    this.frameId = -1
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.initModifierProperties(elem as ElementInterfaceIntersect, arr[pos])
    while (pos > 0) {
      pos--
      this._elements.unshift(arr[pos])
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
        items = this.elemsData[i].it
        // if (!items) {
        //   continue
        // }
        // itemsTransform = items[items.length - 1].transform.mProps.v.props
        items[items.length - 1].transform.mProps._mdf = false
        items[items.length - 1].transform.op._mdf = false
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
        this._groups[i]._render = shouldRender
      }

      this.changeGroupRender(this._groups[i].it ?? [], shouldRender)
      if (!shouldRender) {
        const elems = this.elemsData[i].it,
          transformData = elems[elems.length - 1]

        if (transformData.transform.op.v === 0) {
          transformData.transform.op._mdf = false
        } else {
          transformData.transform.op._mdf = true
          transformData.transform.op.v = 0
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
      items = this.elemsData[i].it
      itemsTransform = items[items.length - 1].transform.mProps.v.props
      const { length: jLen } = itemsTransform

      items[items.length - 1].transform.mProps._mdf = true
      items[items.length - 1].transform.op._mdf = true
      items[items.length - 1].transform.op.v =
        this._currentCopies === 1
          ? Number(this.so?.v)
          : Number(this.so?.v) +
            (Number(this.eo?.v) - Number(this.so?.v)) *
            (i / (this._currentCopies - 1))

      if (iteration === 0) {
        this.matrix.reset()
        for (j = 0; j < jLen; j++) {
          itemsTransform[j] = this.matrix.props[j]
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
          rProps[0],
          rProps[1],
          rProps[2],
          rProps[3],
          rProps[4],
          rProps[5],
          rProps[6],
          rProps[7],
          rProps[8],
          rProps[9],
          rProps[10],
          rProps[11],
          rProps[12],
          rProps[13],
          rProps[14],
          rProps[15]
        )
        this.matrix.transform(
          sProps[0],
          sProps[1],
          sProps[2],
          sProps[3],
          sProps[4],
          sProps[5],
          sProps[6],
          sProps[7],
          sProps[8],
          sProps[9],
          sProps[10],
          sProps[11],
          sProps[12],
          sProps[13],
          sProps[14],
          sProps[15]
        )
        this.matrix.transform(
          pProps[0],
          pProps[1],
          pProps[2],
          pProps[3],
          pProps[4],
          pProps[5],
          pProps[6],
          pProps[7],
          pProps[8],
          pProps[9],
          pProps[10],
          pProps[11],
          pProps[12],
          pProps[13],
          pProps[14],
          pProps[15]
        )

        for (j = 0; j < jLen; j++) {
          itemsTransform[j] = this.matrix.props[j]
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
      elements[i]._processed = false

      const { it } = elements[i]

      if (elements[i].ty === ShapeType.Group && it) {
        this.resetElements(it)
      }
    }
  }
}
