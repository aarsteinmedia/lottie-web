import type { ImageData, LottieAsset } from '@/types'

import { loadData } from '@/utils/DataManager'
import { RendererType } from '@/utils/enums'
import {
  isServer,
  namespaceXlink,
} from '@/utils/helpers/constants'
import { createTag } from '@/utils/helpers/htmlElements'
import { createNS } from '@/utils/helpers/svgElements'

export class ImagePreloader {
  assetsPath = ''
  images: ImageData[] = []
  imagesLoadedCb: null | ((images: ImageData[] | null) => void) = null
  loadedAssets = 0
  loadedFootagesCount = 0
  path = ''
  totalFootages = 0
  totalImages = 0
  private _createImageData?: (assetData: LottieAsset) => ImageData | undefined
  private _elementHelper?: undefined | SVGElement
  private _footageLoaded
  private _imageLoaded
  private proxyImage: HTMLCanvasElement | null
  constructor() {
    this._imageLoaded = this.imageLoaded.bind(this)
    this._footageLoaded = this.footageLoaded.bind(this)
    this.createFootageData = this.createFootageData.bind(this)
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
    const obj: ImageData = {
      assetData,
      img,
    }

    img.setAttributeNS(
      namespaceXlink, 'href', path
    )
    if (this._elementHelper?.append) {
      this._elementHelper.append(img)
    } else {
      this._elementHelper?.appendChild(img)
    }

    // Gate readiness on HTMLImageElement.decode(): SVGImageElement's `load`
    // event can fire before the bitmap is paint-ready (notably in Firefox).
    this.awaitDecodedImage(
      path,
      this._imageLoaded,
      () => {
        if (this.proxyImage) {
          obj.img = this.proxyImage
        }
        this._imageLoaded()
      }
    )

    return obj
  }

  public destroy() {
    this.imagesLoadedCb = null
    this.cleanupElementHelper()
    this.images.length = 0
  }

  public footageLoaded() {
    this.loadedFootagesCount++
    if (
      this.loadedAssets === this.totalImages &&
      this.loadedFootagesCount === this.totalFootages &&
      this.imagesLoadedCb
    ) {
      this.cleanupElementHelper()
      this.imagesLoadedCb(null)
    }
  }

  public getAsset(assetData: null | LottieAsset) {
    let i = 0
    const { length } = this.images

    while (i < length) {
      if (this.images[i]?.assetData === assetData) {
        return this.images[i]?.img ?? null
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
      this.cleanupElementHelper()
      this.imagesLoadedCb(null)
    }
  }

  public loadAssets(assets: LottieAsset[],
    cb: ImagePreloader['imagesLoadedCb']) {
    this.imagesLoadedCb = cb
    const { length } = assets

    for (let i = 0; i < length; i++) {
      if (assets[i]?.layers) {
        continue
      }
      if ((!assets[i]?.t || assets[i]?.t === 'seq') && this._createImageData) {
        this.totalImages++
        const imageData = this._createImageData(assets[i])

        if (imageData) {
          this.images.push(imageData)
        }

        continue
      }

      if (Number(assets[i]?.t) === 3) {
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

  /**
   * Wait until `path` has been loaded and decoded into a bitmap.
   * Prefers HTMLImageElement.decode() so readiness matches paintability
   * (Firefox may fire `load` before decode completes).
   */
  private awaitDecodedImage(
    path: string,
    onReady: () => void,
    onError: () => void
  ) {
    if (isServer) {
      onReady()

      return
    }

    const img = createTag<HTMLImageElement>('img')
    let isSettled = false
    const settle = (cb: () => void) => {
      if (isSettled) {
        return
      }
      isSettled = true
      cb()
    }
    const finish = () => {
      if (typeof img.decode === 'function') {
        img.decode()
          .then(() => {
            settle(onReady)
          })
          .catch(() => {
            settle(onReady)
          })

        return
      }
      settle(onReady)
    }

    img.crossOrigin = 'anonymous'
    img.addEventListener(
      'load', finish, false
    )
    img.addEventListener(
      'error',
      () => {
        settle(onError)
      },
      false
    )
    img.src = path

    if (img.complete) {
      if (img.naturalWidth > 0) {
        finish()
      } else {
        settle(onError)
      }
    }
  }

  /**
   * For SVG renderer we append temporary <image> nodes into `_elementHelper`
   * so the browser starts fetching. These are moved into layer trees by
   * ImageElement (reuse) or removed here if still attached when preload ends,
   * to avoid duplicating large `data:` URLs in the live SVG output.
   */
  private cleanupElementHelper() {
    const helper = this._elementHelper

    if (!helper) {
      return
    }

    for (let i = 0; i < this.images.length; i++) {
      const img = this.images[i]?.img

      if (
        img &&
        typeof SVGImageElement !== 'undefined' &&
        img instanceof SVGImageElement &&
        img.parentNode === helper
      ) {
        helper.removeChild(img)
      }
    }
  }

  private createImgData(assetData: LottieAsset) {
    const path = this.getAssetsPath(
      assetData, this.assetsPath, this.path
    )
    const img = createTag<HTMLImageElement>('img')

    const obj: ImageData = {
      assetData,
      img,
    }

    img.crossOrigin = 'anonymous'

    let isSettled = false
    const settle = () => {
      if (isSettled) {
        return
      }
      isSettled = true
      this._imageLoaded()
    }
    const onLoad = () => {
      if (typeof img.decode === 'function') {
        img.decode()
          .then(() => {
            settle()
          })
          .catch(() => {
            settle()
          })

        return
      }
      settle()
    }

    img.addEventListener(
      'load', onLoad, false
    )
    img.addEventListener(
      'error',
      () => {
        if (this.proxyImage) {
          obj.img = this.proxyImage
        }

        settle()
      },
      false
    )
    img.src = path

    if (img.complete) {
      if (img.naturalWidth > 0) {
        onLoad()
      } else {
        if (this.proxyImage) {
          obj.img = this.proxyImage
        }
        settle()
      }
    }

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
}
