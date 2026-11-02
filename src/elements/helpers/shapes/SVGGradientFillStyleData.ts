import type { SVGStyleData } from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  GradientColor,
  Shape,
  ShapeDataInterface,
  Stop,
  SVGElementInterface,
  Transformer,
  VectorProperty,
} from '@/types'
import type { KeyframeValueProperty } from '@/utils/properties/KeyframeValueProperty'
import type { MultiDimensionalProperty } from '@/utils/properties/MultiDimensionalProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { createElementID } from '@/utils'
import {
  GradientType,
  GradientTypeName,
  GradientUnitName,
  lineCapEnum, lineJoinEnum, ShapeType,
  SpreadMethod,
  StrokeLinecap,
  StrokeLinejoin
} from '@/utils/enums'
import { degToRads } from '@/utils/helpers/constants'
import { DynamicPropertyContainer } from '@/utils/helpers/DynamicPropertyContainer'
import { getLocationHref } from '@/utils/helpers/locationHref'
import { createNS } from '@/utils/helpers/svgElements'
import PropertyFactory from '@/utils/PropertyFactory'
import { GradientProperty } from '@/utils/shapes/properties/GradientProperty'

export class SVGGradientFillStyleData extends DynamicPropertyContainer {
  a?: undefined | ValueProperty
  cst: SVGStopElement[] = []
  e?: undefined | MultiDimensionalProperty
  g?: undefined | GradientProperty
  gf?: undefined | SVGGradientElement
  gr?: undefined | SVGGElement
  h?: undefined | KeyframeValueProperty
  it: ShapeDataInterface[] = []
  maskId?: undefined | string
  ms?: undefined | SVGMaskElement
  o?: undefined | ValueProperty
  of?: undefined | SVGElement
  ost: SVGStopElement[] = []
  prevViewData: SVGElementInterface[] = []
  s?: undefined | MultiDimensionalProperty
  stops: SVGStopElement[] = []
  style?: undefined | SVGStyleData
  transform?: undefined | Transformer
  constructor(
    elem: ElementInterfaceIntersect,
    data: Shape,
    styleData: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem)
    this.getValue = this.iterateDynamicProperties
    this.initGradientData(
      elem, data, styleData
    )
  }

  initGradientData(
    elem: ElementInterfaceIntersect,
    data: Shape,
    styleData: SVGStyleData
  ) {
    this.o = PropertyFactory.getProp(
      elem,
      data.o,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.s = PropertyFactory.getProp(
      elem,
      data.s,
      1,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.e = PropertyFactory.getProp(
      elem,
      data.e,
      1,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
    this.h = PropertyFactory.getProp<KeyframeValueProperty>(
      elem,
      // @ts-expect-error: ignore
      data.h ?? ({ k: 0 } as unknown as VectorProperty<KeyframeValueProperty>),
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as KeyframeValueProperty
    this.a = PropertyFactory.getProp(
      elem,
      data.a ?? ({ k: 0 } as VectorProperty),
      0,
      degToRads,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.g = new GradientProperty(
      elem,
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
      gfill = createNS<SVGGradientElement>(data.t === GradientType.Linear ? GradientTypeName.Linear : GradientTypeName.Radial)

    gfill.id = gradientId
    gfill.setAttribute('spreadMethod', SpreadMethod.Pad)
    gfill.setAttribute('gradientUnits', GradientUnitName.UserSpaceOnUse)
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

    mask.appendChild(maskElement)
    const opacityId = createElementID(),
      maskId = createElementID()

    mask.id = maskId
    const opFill = createNS(data.t === GradientType.Linear ? GradientTypeName.Linear : GradientTypeName.Radial)

    opFill.id = opacityId
    opFill.setAttribute('spreadMethod', SpreadMethod.Pad)
    opFill.setAttribute('gradientUnits', GradientUnitName.UserSpaceOnUse)
    const jLen =
        ((data.g?.k.k as Stop[] | undefined)?.[0]?.s
          ? (data.g?.k.k as Stop[])[0]?.s.length
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
      maskElement.setAttribute('stroke-linecap', lineCapEnum[data.lc ?? StrokeLinecap.Round])
      maskElement.setAttribute('stroke-linejoin', lineJoinEnum[data.lj ?? StrokeLinejoin.Round])
      if (data.lj === StrokeLinejoin.Miter) {
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
