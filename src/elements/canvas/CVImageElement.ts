
import {createTag} from '@/utils';
import RenderableElement from '@/elements/helpers/RenderableElement';

import CVBaseElement from '@/elements/canvas/CVBaseElement';
import ImageElement from '@/elements/ImageElement';
import SVGShapeElement from '@/elements/svg/SVGShapeElement';
import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '@/types';

export default class CVImageElement extends RenderableElement{
  constructor (data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect) {
    super()
    this.assetData = globalData.getAssetData(data.refId);
    this.img = globalData.imageLoader.getAsset(this.assetData);
    const { initElement } = SVGShapeElement.prototype,
      { prepareFrame } = ImageElement.prototype
    this.initElement = initElement;
    this.prepareFrame = prepareFrame;
    this.initElement(data, globalData, comp);
  }
// extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement);

  initElement(_data: LottieLayer, _globalData: GlobalData, _comp: ElementInterfaceIntersect) {
    throw new Error(`${this.constructor.name}: Method initElement is not implemented`)
  }

  createContent  () {
    if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
      var canvas = createTag<HTMLCanvasElement>('canvas');
      canvas.width = this.assetData.w;
      canvas.height = this.assetData.h;
      var ctx = canvas.getContext('2d');

      var imgW = this.img.width;
      var imgH = this.img.height;
      var imgRel = imgW / imgH;
      var canvasRel = this.assetData.w / this.assetData.h;
      var widthCrop;
      var heightCrop;
      var par = this.assetData.pr || this.globalData.renderConfig?.imagePreserveAspectRatio;
      if ((imgRel > canvasRel && par === 'xMidYMid slice') || (imgRel < canvasRel && par !== 'xMidYMid slice')) {
        heightCrop = imgH;
        widthCrop = heightCrop * canvasRel;
      } else {
        widthCrop = imgW;
        heightCrop = widthCrop / canvasRel;
      }
      ctx.drawImage(this.img, (imgW - widthCrop) / 2, (imgH - heightCrop) / 2, widthCrop, heightCrop, 0, 0, this.assetData.w, this.assetData.h);
      this.img = canvas;
    }
  }

  renderInnerContent  () {
    this.canvasContext.drawImage(this.img, 0, 0);
  }

  destroy  () {
    this.img = null;
  }
}