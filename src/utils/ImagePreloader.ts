import type { ImageData, LottieAsset } from '@/types'

import { loadData } from '@/utils/DataManager'
import { RendererType } from '@/utils/enums'
import {
  isSafari, isServer, namespaceXlink
} from '@/utils/helpers/constants'
import createTag from '@/utils/helpers/htmlElements'
import createNS from '@/utils/helpers/svgElements'

export default class ImagePreloader {
  assetsPath: string
  images: ImageData[]
  imagesLoadedCb: null | ((images: ImageData[] | null) => void)
  loadedAssets: number
  loadedFootagesCount: number
  path: string
  totalFootages: number
  totalImages: number
  private _createImageData?: (assetData: LottieAsset) => ImageData | undefined
  private _elementHelper?: SVGElement
  private _footageLoaded
  private _imageLoaded
  private proxyImage: HTMLCanvasElement | null
  constructor() {
    this._imageLoaded = this.imageLoaded.bind(this)
    this._footageLoaded = this.footageLoaded.bind(this)
    this.testImageLoaded = this.testImageLoaded.bind(this)
    this.createFootageData = this.createFootageData.bind(this)
    this.assetsPath = ''
    this.path = ''
    this.totalImages = 0
    this.totalFootages = 0
    this.loadedAssets = 0
    this.loadedFootagesCount = 0
    this.imagesLoadedCb = null
    this.images = []
    this.proxyImage = this._createProxyImage()
  }

  createFootageData(data: LottieAsset) {
    const obj: ImageData = {
      assetData: data,
      img: null,
    }
    const path = this.getAssetsPath(
      data, this.assetsPath, this.path
    )

    loadData(
      path,
      (footageData: unknown) => {
        if (footageData) {
          obj.img = footageData as SVGElement
        }
        this._footageLoaded()
      },
      () => {
        this._footageLoaded()
      }
    )

    return obj
  }

  public createImageData(assetData: LottieAsset) {
    const path = this.getAssetsPath(
      assetData, this.assetsPath, this.path
    )
    const img = createNS<SVGImageElement>('image')

    // if (!img) {
    //   throw new Error(`${this.constructor.name}: Could not create SVG`)
    // }
    const obj: ImageData = {
      assetData,
      img,
    }

    if (isSafari) {
      this.testImageLoaded(img)
    } else {
      img.addEventListener(
        'load', this._imageLoaded, false
      )
    }
    img.addEventListener(
      'error',
      () => {
        if (this.proxyImage) {
          obj.img = this.proxyImage
        }
        this._imageLoaded()
      },
      false
    )
    img.setAttributeNS(
      namespaceXlink, 'href', path
    )
    if (this._elementHelper?.append) {
      this._elementHelper.append(img)
    } else {
      this._elementHelper?.appendChild(img)
    }

    return obj
  }

  public destroy() {
    this.imagesLoadedCb = null
    this.images.length = 0
  }

  public footageLoaded() {
    this.loadedFootagesCount++
    if (
      this.loadedAssets === this.totalImages &&
      this.loadedFootagesCount === this.totalFootages &&
      this.imagesLoadedCb
    ) {
      this.imagesLoadedCb(null)
    }
  }

  public getAsset(assetData: null | LottieAsset) {
    let i = 0
    const { length } = this.images

    while (i < length) {
      if (this.images[i].assetData === assetData) {
        return this.images[i].img
      }
      i++
    }

    return null
  }

  public imageLoaded() {
    this.loadedAssets++
    if (
      this.loadedAssets === this.totalImages &&
      this.loadedFootagesCount === this.totalFootages &&
      this.imagesLoadedCb
    ) {
      this.imagesLoadedCb(null)
    }
  }

  public loadAssets(assets: LottieAsset[],
    cb: ImagePreloader['imagesLoadedCb']) {
    this.imagesLoadedCb = cb
    const { length } = assets

    for (let i = 0; i < length; i++) {
      if (assets[i].layers) {
        continue
      }
      if ((!assets[i].t || assets[i].t === 'seq') && this._createImageData) {
        this.totalImages++
        const imageData = this._createImageData(assets[i])

        if (imageData) {
          this.images.push(imageData)
        }

        continue
      }

      if (Number(assets[i].t) === 3) {
        this.totalFootages++
        this.images.push(this.createFootageData(assets[i]))
      }
    }
  }

  public loadedFootages() {
    return this.totalFootages === this.loadedFootagesCount
  }

  public loadedImages() {
    return this.totalImages === this.loadedAssets
  }

  public setAssetsPath(path?: string) {
    this.assetsPath = path || ''
  }

  public setCacheType(type: RendererType, elementHelper?: SVGElement) {
    if (type === RendererType.SVG) {
      this._elementHelper = elementHelper
      this._createImageData = this.createImageData.bind(this)
    } else {
      this._createImageData = this.createImgData.bind(this)
    }
  }

  public setPath(path?: string) {
    this.path = path || ''
  }

  private _createProxyImage() {
    if (isServer) {
      return null
    }
    const canvas = createTag<HTMLCanvasElement>(RendererType.Canvas)

    // if (!canvas) {
    //   throw new Error(`${this.constructor.name}: Could not create canvas element`)
    // }
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.fillStyle = 'rgba(0,0,0,0)'
      ctx.fillRect(
        0, 0, 1, 1
      )
    }

    return canvas
  }

  private createImgData(assetData: LottieAsset) {
    const path = this.getAssetsPath(
      assetData, this.assetsPath, this.path
    )
    const img = createTag<HTMLMediaElement>('img')

    // if (!img) {
    //   throw new Error(`${this.constructor.name}: Could not create image element`)
    // }

    const obj: ImageData = {
      assetData,
      img,
    }

    img.crossOrigin = 'anonymous'
    img.addEventListener(
      'load', this._imageLoaded, false
    )
    img.addEventListener(
      'error',
      () => {
        if (this.proxyImage) {
          obj.img = this.proxyImage
        }

        this._imageLoaded()
      },
      false
    )
    img.src = path


    return obj
  }

  private getAssetsPath(
    assetData: LottieAsset,
    assetsPath: string,
    originalPath: string
  ): string {
    if (assetData.e) {
      return assetData.p || ''
    }

    if (assetsPath) {
      let imagePath = assetData.p

      if (imagePath?.indexOf('images/') !== -1) {
        imagePath = imagePath?.split('/')[1]
      }

      return `${assetsPath}${imagePath || ''}`
    }
    let path = originalPath

    path += assetData.u ?? ''
    path += assetData.p ?? ''

    return path
  }

  private testImageLoaded(img: SVGGraphicsElement) {
    if (isServer) {
      return
    }
    let _count = 0
    const intervalId = setInterval(() => {
      const box = img.getBBox()

      if (box.width || _count > 500) {
        this._imageLoaded()
        clearInterval(intervalId)
      }
      _count++
    },
    50)
  }
}
