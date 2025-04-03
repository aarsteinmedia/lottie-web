import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type { ElementInterfaceIntersect, LottieLayer, Shape } from '@/types'

import MaskElement from '@/elements/MaskElement'
import { createSizedArray } from '@/utils/helpers/arrays'
import { getShapeProp, type ShapeProperty } from '@/utils/shapes/ShapeProperty'

export default class CVMaskElement {
  _isFirstFrame?: boolean
  data: LottieLayer
  element: ElementInterfaceIntersect
  hasMasks: boolean
  masksProperties: Shape[]
  viewData: ShapeProperty[]

  constructor(data: LottieLayer, element: ElementInterfaceIntersect) {
    this.data = data
    this.element = element
    this.masksProperties = this.data.masksProperties || []
    this.viewData = createSizedArray(this.masksProperties.length)
    const { length } = this.masksProperties
    let hasMasks = false
    for (let i = 0; i < length; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        hasMasks = true
      }
      this.viewData[i] = getShapeProp(
        this.element,
        this.masksProperties[i],
        3
      ) as ShapeProperty
    }
    this.hasMasks = hasMasks
    if (hasMasks) {
      this.element.addRenderableComponent(
        this as unknown as ElementInterfaceIntersect
      )
    }
    this.getMaskProperty = MaskElement.prototype.getMaskProperty
  }

  destroy() {
    this.element = null as unknown as ElementInterfaceIntersect
  }

  getMaskProperty(_pos: number) {
    throw new Error(
      `${this.constructor.name}: Method getMaskProperty is not implemented`
    )
  }
  renderFrame() {
    if (!this.element.globalData.compSize) {
      throw new Error(
        `${this.constructor.name}: element->globalData->compSize is not implemented`
      )
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
          ctx?.lineTo(
            this.element.globalData.compSize.w,
            this.element.globalData.compSize.h
          )
          ctx?.lineTo(0, this.element.globalData.compSize?.h)
          ctx?.lineTo(0, 0)
        }
        const data = this.viewData[i].v
        if (!data) {
          throw new Error(
            `${this.constructor.name}: Could not access ShapePath`
          )
        }
        const pt =
          transform?.applyToPointArray(data.v[0][0], data.v[0][1], 0) || []
        ctx?.moveTo(pt[0], pt[1])
        const jLen = data._length
        for (j = 1; j < jLen; j++) {
          pts =
            transform?.applyToTriplePoints(
              data.o[j - 1],
              data.i[j],
              data.v[j]
            ) || []
          ctx?.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5])
        }
        pts =
          transform?.applyToTriplePoints(data.o[j - 1], data.i[0], data.v[0]) ||
          []
        ctx?.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5])
      }
    }
    ;(this.element.globalData.renderer as CanvasRenderer).save(true)
    ctx?.clip()
  }
}
