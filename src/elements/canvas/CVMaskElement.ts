import type CVBaseElement from '@/elements/canvas/CVBaseElement'
import type CVShapeElement from '@/elements/canvas/CVShapeElement'
import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type { LottieLayer, Shape } from '@/types'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'

import { createSizedArray } from '@/utils/helpers/arrays'
import ShapePropertyFactory from '@/utils/shapes/properties'

export default class CVMaskElement {
  _isFirstFrame?: boolean
  data: LottieLayer
  element: CVShapeElement | CVBaseElement
  hasMasks: boolean

  masksProperties: Shape[]
  viewData: ShapeProperty[]
  constructor(data: LottieLayer, element: CVShapeElement | CVBaseElement) {
    this.data = data
    this.element = element
    this.masksProperties = this.data.masksProperties ?? []
    this.viewData = createSizedArray(this.masksProperties.length)
    const { length } = this.masksProperties
    let hasMasks = false

    for (let i = 0; i < length; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        hasMasks = true
      }
      this.viewData[i] = ShapePropertyFactory.getShapeProp(
        this.element as CVShapeElement,
        this.masksProperties[i],
        3
      ) as ShapeProperty
    }
    this.hasMasks = hasMasks
    if (hasMasks) {
      ; (this.element as CVShapeElement).addRenderableComponent(this)
    }
  }

  destroy() {
    this.element = null as unknown as CVShapeElement
  }

  getMaskProperty(pos: number) {

    return this.viewData[pos]
  }

  renderFrame(_num?: number) {
    if (!this.element.globalData?.compSize) {
      throw new Error(`${this.constructor.name}: element->globalData->compSize is not implemented`)
    }
    if (!this.hasMasks) {
      return
    }
    const transform = this.element.finalTransform?.mat,
      ctx = this.element.canvasContext
    let j
    const { length } = this.masksProperties
    let pts

    ctx?.beginPath()
    for (let i = 0; i < length; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        if (this.masksProperties[i].inv) {
          ctx?.moveTo(0, 0)
          ctx?.lineTo(this.element.globalData.compSize.w, 0)
          ctx?.lineTo(this.element.globalData.compSize.w,
            this.element.globalData.compSize.h)
          ctx?.lineTo(0, this.element.globalData.compSize.h)
          ctx?.lineTo(0, 0)
        }
        const data = this.viewData[i].v

        if (!data) {
          throw new Error(`${this.constructor.name}: Could not access ShapePath`)
        }
        const pt =
          transform?.applyToPointArray(
            data.v[0][0], data.v[0][1], 0
          ) ?? []

        ctx?.moveTo(pt[0], pt[1])
        const jLen = data._length

        for (j = 1; j < jLen; j++) {
          pts =
            transform?.applyToTriplePoints(
              data.o[j - 1],
              data.i[j],
              data.v[j]
            ) ?? []
          ctx?.bezierCurveTo(
            pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]
          )
        }
        pts =
          transform?.applyToTriplePoints(
            data.o[j - 1], data.i[0], data.v[0]
          ) ??
          []
        ctx?.bezierCurveTo(
          pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]
        )
      }
    }
    ; (this.element.globalData.renderer as CanvasRenderer).save(true)
    ctx?.clip()
  }
}
