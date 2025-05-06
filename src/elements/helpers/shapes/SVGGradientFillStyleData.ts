import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  GradientColor,
  Shape,
  ShapeDataInterface,
  Stop,
  SVGElementInterface,
  Transformer,
  VectorProperty,
} from '@/types'
import type {
  KeyframedValueProperty,
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import {
  lineCapEnum, lineJoinEnum, ShapeType
} from '@/enums'
import { createElementID } from '@/LottieUtils'
import { createNS, degToRads } from '@/utils'
import { getLocationHref } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import PropertyFactory from '@/utils/PropertyFactory'
import GradientProperty from '@/utils/shapes/GradientProperty'

export default class SVGGradientFillStyleData extends DynamicPropertyContainer {
  a?: MultiDimensionalProperty
  cst: SVGStopElement[] = []

  e?: MultiDimensionalProperty

  g?: GradientProperty

  gf?: SVGGradientElement
  gr?: SVGGElement
  h?: KeyframedValueProperty
  it: ShapeDataInterface[] = []
  maskId?: string
  ms?: SVGMaskElement
  o?: ValueProperty
  of?: SVGElement
  ost: SVGStopElement[] = []
  prevViewData: SVGElementInterface[] = []
  s?: MultiDimensionalProperty
  stops: SVGStopElement[] = []
  style?: SVGStyleData
  transform?: Transformer
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleData: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.initGradientData(
      elem, data, styleData
    )
  }
  initGradientData(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleData: SVGStyleData
  ) {
    this.o = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.o,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.s = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.s,
      1,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.e = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.e,
      1,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.h = PropertyFactory.getProp<KeyframedValueProperty>(
      elem as ElementInterfaceIntersect,
      // @ts-expect-error: ignore
      data.h ?? ({ k: 0 } as unknown as VectorProperty<KeyframedValueProperty>),
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as KeyframedValueProperty
    this.a = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.a ?? ({ k: 0 } as VectorProperty),
      0,
      degToRads,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.g = new GradientProperty(
      elem as ElementInterfaceIntersect,
      data.g as GradientColor,
      this as unknown as ElementInterfaceIntersect
    )
    this.style = styleData
    this.stops = []
    this.setGradientData(styleData.pElem, data)
    this.setGradientOpacity(data, styleData)
    this._isAnimated = Boolean(this._isAnimated)
  }
  setGradientData(pathElement: SVGElement, data: Shape) {
    const gradientId = createElementID(),
      gfill = createNS<SVGGradientElement>(data.t === 1 ? 'linearGradient' : 'radialGradient')

    gfill.setAttribute('id', gradientId)
    gfill.setAttribute('spreadMethod', 'pad')
    gfill.setAttribute('gradientUnits', 'userSpaceOnUse')
    const stops: SVGStopElement[] = []
    let stop
    const jLen = (data.g?.p || 1) * 4

    for (let j = 0; j < jLen; j += 4) {
      stop = createNS<SVGStopElement>('stop')
      gfill.appendChild(stop)
      stops.push(stop)
    }
    pathElement.setAttribute(data.ty === ShapeType.GradientFill ? 'fill' : 'stroke',
      `url(${getLocationHref()}#${gradientId})`)
    this.gf = gfill
    this.cst = stops
  }
  setGradientOpacity(data: Shape, styleData: SVGStyleData) {
    if (!this.g?._hasOpacity || this.g._collapsable) {
      return
    }
    let stop
    const mask = createNS<SVGMaskElement>('mask'),
      maskElement = createNS<SVGPathElement>('path')

    // if (!maskElement || !mask) {
    //   throw new Error(`${this.constructor.name}: Could not create svg element`)
    // }
    mask.appendChild(maskElement)
    const opacityId = createElementID(),
      maskId = createElementID()

    mask.setAttribute('id', maskId)
    const opFill = createNS(data.t === 1 ? 'linearGradient' : 'radialGradient')

    opFill.setAttribute('id', opacityId)
    opFill.setAttribute('spreadMethod', 'pad')
    opFill.setAttribute('gradientUnits', 'userSpaceOnUse')
    const jLen =
          ((data.g?.k.k as Stop[] | undefined)?.[0].s
            ? (data.g?.k.k as Stop[])[0].s.length
            : data.g?.k.k.length) || 0,
      { stops } = this

    for (let j = (data.g?.p || 1) * 4; j < jLen; j += 2) {
      stop = createNS<SVGStopElement>('stop')
      stop.setAttribute('stop-color', 'rgb(255,255,255)')
      opFill.appendChild(stop)
      stops.push(stop)
    }
    maskElement.setAttribute(data.ty === ShapeType.GradientFill ? 'fill' : 'stroke',
      `url(${getLocationHref()}#${opacityId})`)
    if (data.ty === ShapeType.GradientStroke) {
      maskElement.setAttribute('stroke-linecap', lineCapEnum[data.lc || 2])
      maskElement.setAttribute('stroke-linejoin', lineJoinEnum[data.lj || 2])
      if (data.lj === 1) {
        maskElement.setAttribute('stroke-miterlimit', `${Number(data.ml)}`)
      }
    }
    this.of = opFill
    this.ms = mask
    this.ost = stops
    this.maskId = maskId
    styleData.msElem = maskElement
  }
}
