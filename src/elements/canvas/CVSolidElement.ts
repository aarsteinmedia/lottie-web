import CVBaseElement from '@/elements/canvas/CVBaseElement';
import IImageElement from '@/elements/ImageElement';
import SVGShapeElement from '@/elements/svg/SVGShapeElement';
import RenderableElement from '@/elements/helpers/RenderableElement';
import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '@/types';

export default class CVSolidElement extends RenderableElement{
  constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect) {
    super()
    const { initElement } = SVGShapeElement.prototype
    this.initElement = initElement
    this.initElement(data, globalData, comp);
  }

  initElement(_data: LottieLayer, _globalData: GlobalData, _comp: ElementInterfaceIntersect) {
    throw new Error(`${this.constructor.name}: Method initElement it not implemented`)
  }
}
// extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement);

CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame;

CVSolidElement.prototype.renderInnerContent = function () {
  // var ctx = this.canvasContext;
  this.globalData.renderer.ctxFillStyle(this.data.sc);
  // ctx.fillStyle = this.data.sc;
  this.globalData.renderer.ctxFillRect(0, 0, this.data.sw, this.data.sh);
  // ctx.fillRect(0, 0, this.data.sw, this.data.sh);
  //
};
