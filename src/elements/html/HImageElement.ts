import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import { HSolidElement } from '@/elements/html/HSolidElement'
import { namespaceXlink } from '@/utils/helpers/constants'
import { createNS } from '@/utils/helpers/svgElements'

export class HImageElement extends HSolidElement {
  imageElem?: SVGImageElement

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super(
      data, globalData, comp
    )
    this.assetData = globalData.getAssetData(data.refId)
    this.initElement(
      data, globalData, comp
    )
  }

  override createContent() {
    if (!this.assetData) {
      throw new Error(`${this.constructor.name}: assetData is not implemented`)
    }

    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    const assetPath = this.globalData.getAssetsPath(this.assetData),
      img = new Image()

    if (this.data?.hasMask) {
      this.imageElem = createNS('image')
      this.imageElem.setAttribute('width', `${this.assetData.w}px`)
      this.imageElem.setAttribute('height', `${this.assetData.h}px`)
      this.imageElem.setAttributeNS(
        namespaceXlink,
        'href',
        assetPath
      )
      this.layerElement?.appendChild(this.imageElem)
      this.baseElement?.setAttribute('width', `${this.assetData.w}`)
      this.baseElement?.setAttribute('height', `${this.assetData.h}`)
    } else {
      this.layerElement?.appendChild(img)
    }
    img.crossOrigin = 'anonymous'
    img.src = assetPath
    if (this.data?.ln) {
      this.baseElement?.setAttribute('id', this.data.ln)
    }
  }
}
