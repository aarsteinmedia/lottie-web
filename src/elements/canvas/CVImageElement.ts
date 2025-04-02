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
  img: HTMLCanvasElement

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.assetData = globalData.getAssetData(data.refId)
    if (!globalData.imageLoader) {
      throw new Error(
        `${this.constructor.name} imageLoader is not implemented in globalData`
      )
    }
    this.img = globalData.imageLoader.getAsset(
      this.assetData
    ) as HTMLCanvasElement
    const {
        clearCanvas,
        createContainerElements,
        createElements,
        createRenderableComponents,
        exitLayer,
        hideElement,
        initRendererElement,
        prepareLayer,
        renderFrame,
        setBlendMode,
        showElement,
      } = CVBaseElement.prototype,
      { initElement } = SVGShapeElement.prototype,
      { prepareFrame } = ImageElement.prototype
    this.clearCanvas = clearCanvas
    this.createContainerElements = createContainerElements
    this.createElements = createElements
    this.createRenderableComponents = createRenderableComponents
    this.exitLayer = exitLayer
    this.hideElement = hideElement
    this.initElement = initElement
    this.initRendererElement = initRendererElement
    this.prepareFrame = prepareFrame
    this.prepareLayer = prepareLayer
    this.renderFrame = renderFrame
    this.setBlendMode = setBlendMode
    this.showElement = showElement

    this.initElement(data, globalData, comp)
  }

  clearCanvas() {
    throw new Error(
      `${this.constructor.name}: Method clearCanvas is not implemented`
    )
  }
  createContainerElements() {
    throw new Error(
      `${this.constructor.name}: Method createContainerElements is not implemented`
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
      (imgRel > canvasRel && par === 'xMidYMid slice') ||
      (imgRel < canvasRel && par !== 'xMidYMid slice')
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
  createElements() {
    throw new Error(
      `${this.constructor.name}: Method createElements is not implemented`
    )
  }
  createRenderableComponents() {
    throw new Error(
      `${this.constructor.name}: Method createRenderableComponents is not implemented`
    )
  }
  destroy() {
    this.img = null as unknown as HTMLCanvasElement
  }
  exitLayer() {
    throw new Error(
      `${this.constructor.name}: Method exitLayer is not implemented`
    )
  }
  hideElement() {
    throw new Error(
      `${this.constructor.name}: Method hideElement is not implemented`
    )
  }
  initElement(
    _data: LottieLayer,
    _globalData: GlobalData,
    _comp: ElementInterfaceIntersect
  ) {
    throw new Error(
      `${this.constructor.name}: Method initElement is not implemented`
    )
  }
  initRendererElement() {
    throw new Error(
      `${this.constructor.name}: Method initRendererElement is not implemented`
    )
  }

  prepareFrame(_num: number) {
    throw new Error(
      `${this.constructor.name}: Method prepareFrame is not implemented`
    )
  }

  prepareLayer() {
    throw new Error(
      `${this.constructor.name}: Method prepareLayer is not implemented`
    )
  }

  renderFrame() {
    throw new Error(
      `${this.constructor.name}: Method renderFrame is not implemented`
    )
  }

  renderInnerContent() {
    this.canvasContext?.drawImage(this.img, 0, 0)
  }

  setMatte() {
    throw new Error(
      `${this.constructor.name}: Method setMatte is not implemented`
    )
  }

  showElement() {
    throw new Error(
      `${this.constructor.name}: Method showElement is not implemented`
    )
  }
}
