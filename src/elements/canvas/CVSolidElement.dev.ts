import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import CVBaseElement from '@/elements/canvas/CVBaseElement_'
import RenderableElement from '@/elements/helpers/RenderableElement'
import ImageElement from '@/elements/ImageElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'
import { extendPrototype } from '@/utils'

import BaseElement from '../BaseElement'
import FrameElement from '../helpers/FrameElement'
import HierarchyElement from '../helpers/HierarchyElement'
import TransformElement from '../helpers/TransformElement'

export default function CVSolidElement(
  data, globalData, comp
) {
  this.initElement(
    data, globalData, comp
  )
}
extendPrototype([
  BaseElement,
  TransformElement,
  CVBaseElement,
  HierarchyElement,
  FrameElement,
  RenderableElement,
],
CVSolidElement)

CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement
CVSolidElement.prototype.prepareFrame = ImageElement.prototype.prepareFrame

CVSolidElement.prototype.renderInnerContent = function () {
  // var ctx = this.canvasContext;
  this.globalData.renderer.ctxFillStyle(this.data.sc)
  // ctx.fillStyle = this.data.sc;
  this.globalData.renderer.ctxFillRect(
    0, 0, this.data.sw, this.data.sh
  )
  // ctx.fillRect(0, 0, this.data.sw, this.data.sh);
  //
}
