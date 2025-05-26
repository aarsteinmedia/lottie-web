import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
} from '@/types'

import CVBaseElement from '@/elements/canvas/CVBaseElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import ImageElement from '@/elements/ImageElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'
import { createTag } from '@/utils'

export default class CVImageElement extends RenderableElement {
  assetData: LottieAsset | null
  canvasContext?: CanvasRenderingContext2D
  clearCanvas = CVBaseElement.prototype.clearCanvas
  createContainerElements = CVBaseElement.prototype.createContainerElements
  createElements = CVBaseElement.prototype.createElements
  createRenderableComponents = CVBaseElement.prototype.createRenderableComponents
  exitLayer = CVBaseElement.prototype.exitLayer
  hideElement = CVBaseElement.prototype.hideElement
  img: HTMLCanvasElement
  initElement = SVGShapeElement.prototype.initElement
  initRendererElement = CVBaseElement.prototype.initRendererElement
  prepareFrame = ImageElement.prototype.prepareFrame
  prepareLayer = CVBaseElement.prototype.prepareLayer
  renderFrame = CVBaseElement.prototype.renderFrame
  override setBlendMode = CVBaseElement.prototype.setBlendMode
  override show = CVBaseElement.prototype.show
  showElement = CVBaseElement.prototype.showElement
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.assetData = globalData.getAssetData(data.refId)
    if (!globalData.imageLoader) {
      throw new Error(`${this.constructor.name} imageLoader is not implemented in globalData`)
    }
    this.img = globalData.imageLoader.getAsset(this.assetData) as HTMLCanvasElement
    this.initElement(
      data, globalData, comp
    )
  }


  createContent() {
    if (!this.assetData) {
      throw new Error(`${this.constructor.name}: assetData is not implemented`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (
      !this.img.width ||
      !(
        this.assetData.w !== this.img.width ||
        this.assetData.h !== this.img.height
      )
    ) {
      return
    }
    const canvas = createTag<HTMLCanvasElement>('canvas')

    canvas.width = Number(this.assetData.w)
    canvas.height = Number(this.assetData.h)
    const ctx = canvas.getContext('2d'),
      imgW = this.img.width,
      imgH = this.img.height,
      imgRel = imgW / imgH,
      canvasRel = Number(this.assetData.w) / Number(this.assetData.h)
    let widthCrop, heightCrop
    const par =
      this.assetData.pr ||
      this.globalData.renderConfig?.imagePreserveAspectRatio

    if (
      imgRel > canvasRel && par === 'xMidYMid slice' ||
      imgRel < canvasRel && par !== 'xMidYMid slice'
    ) {
      heightCrop = imgH
      widthCrop = heightCrop * canvasRel
    } else {
      widthCrop = imgW
      heightCrop = widthCrop / canvasRel
    }
    ctx?.drawImage(
      this.img,
      (imgW - widthCrop) / 2,
      (imgH - heightCrop) / 2,
      widthCrop,
      heightCrop,
      0,
      0,
      Number(this.assetData.w),
      Number(this.assetData.h)
    )
    this.img = canvas
  }

  override destroy() {
    this.img = null as unknown as HTMLCanvasElement
  }

  renderInnerContent() {
    this.canvasContext?.drawImage(
      this.img, 0, 0
    )
  }
}
