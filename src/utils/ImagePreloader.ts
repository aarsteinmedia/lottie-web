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
  /** Off-DOM SVG used to decode SVG images without polluting animation `defs` (filters). */
  private _preloadHost: SVGSVGElement | null = null
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
      ),

      img = createNS<SVGImageElement>('image'),
      obj: ImageData = {
        assetData,
        img,
      }

    // Intrinsic size helps Firefox decode before the layer mounts.
    if (assetData.w) {
      img.setAttribute('width', `${assetData.w}`)
    }
    if (assetData.h) {
      img.setAttribute('height', `${assetData.h}`)
    }
    img.setAttributeNS(
      namespaceXlink, 'href', path
    )

    // Append as a rendered child of the private host (not <defs>) so the
    // browser actually decodes the bitmap. Avoid the live animation defs —
    // dumping images there breaks SVG filter stacks.
    if (this._elementHelper?.append) {
      this._elementHelper.append(img)
    } else {
      this._elementHelper?.appendChild(img)
    }

    this.awaitSvgImageReady(
      img,
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
    this.destroyPreloadHost()
    this.images.length = 0
  }

  public footageLoaded() {
    this.loadedFootagesCount++
    this.notifyIfComplete()
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
    this.notifyIfComplete()
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

  public setCacheType(type: RendererType, _elementHelper?: SVGElement) {
    if (type === RendererType.SVG) {
      // Intentionally ignore the animation's live <defs> — filters live there.
      this._elementHelper = this.ensurePreloadHost()
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
   * Wait until the SVGImageElement itself is paint-ready.
   * Decoding a separate HTMLImageElement does not warm Firefox's SVG image
   * decoder, so we force-decode this element via drawImage / getBBox.
   */
  private awaitSvgImageReady(
    img: SVGImageElement,
    onReady: () => void,
    onError: () => void
  ) {
    if (isServer) {
      onReady()

      return
    }

    let isSettled = false
    let pollCount = 0
    const poll = { id: undefined as ReturnType<typeof setInterval> | undefined }

    const settle = (cb: () => void) => {
      if (isSettled) {
        return
      }
      isSettled = true
      if (poll.id !== undefined) {
        clearInterval(poll.id)
      }
      cb()
    }

    const tryForceDecode = () => {
      try {
        const canvas = createTag<HTMLCanvasElement>('canvas')

        canvas.width = 1
        canvas.height = 1
        const ctx = canvas.getContext('2d')

        // Sync-decode path used by canvas; succeeds once the SVG image has data.
        ctx?.drawImage(
          img, 0, 0, 1, 1
        )

        settle(onReady)

        return true
      } catch {
        return false
      }
    }

    img.addEventListener(
      'load',
      () => {
        tryForceDecode()
      },
      false
    )
    img.addEventListener(
      'error',
      () => {
        settle(onError)
      },
      false
    )

    // Data URIs often finish before listeners attach — try immediately.
    if (tryForceDecode()) {
      return
    }

    poll.id = setInterval(() => {
      if (tryForceDecode()) {
        return
      }
      try {
        const box = img.getBBox()

        if (box.width > 0 || box.height > 0) {
          settle(onReady)
        }
      } catch {
        // Not ready / not in document yet.
      }
      pollCount++
      if (pollCount > 500) {
        settle(onReady)
      }
    },
    50)
  }

  /**
   * Remove preload images still attached to the private host.
   * Adopted images are moved into layers before this runs.
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

  private destroyPreloadHost() {
    this._preloadHost?.remove()
    this._preloadHost = null
    this._elementHelper = undefined
  }

  /**
   * Private 1×1 SVG in the document. Images are direct children (not in
   * <defs>) so browsers decode them; opacity:0 avoids flash. Must not use
   * display:none — Firefox skips decoding those images.
   */
  private ensurePreloadHost(): SVGElement {
    if (this._elementHelper) {
      return this._elementHelper
    }

    if (isServer) {
      this._elementHelper = createNS('g')

      return this._elementHelper
    }

    const svg = createNS<SVGSVGElement>('svg')

    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('width', '1')
    svg.setAttribute('height', '1')
    svg.style.cssText =
      'position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none'

    document.documentElement.appendChild(svg)
    this._preloadHost = svg
    this._elementHelper = svg

    return svg
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

  private notifyIfComplete() {
    if (
      this.loadedAssets !== this.totalImages ||
      this.loadedFootagesCount !== this.totalFootages ||
      !this.imagesLoadedCb
    ) {
      return
    }

    const cb = this.imagesLoadedCb

    // Let ImageElement adopt preloaded nodes first, then detach leftovers.
    cb(null)
    this.cleanupElementHelper()
    if (this._preloadHost && !this._preloadHost.hasChildNodes()) {
      this.destroyPreloadHost()
    }
  }
}
