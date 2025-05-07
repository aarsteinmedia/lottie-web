import type { ElementInterfaceIntersect } from '@/types'

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import MaskElement from '@/elements/MaskElement'
import SVGEffects from '@/elements/svg/SVGEffects'
import { createElementID, createNS } from '@/utils'
import {
  createAlphaToLuminanceFilter,
  createFilter,
  FeatureSupport,
} from '@/utils/FiltersFactory'
import { getLocationHref } from '@/utils/getterSetter'

export default class SVGBaseElement extends RenderableDOMElement {
  _sizeChanged?: boolean
  maskedElement?: HTMLElement | SVGGElement
  matteElement?: SVGGElement
  matteMasks?: { [key: number]: string }
  transformedElement?: HTMLElement | SVGGElement
  override createContainerElements() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }

    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    if (!this.layerElement) {
      throw new Error(`${this.constructor.name}: layerElement is not implemented`)
    }

    this.matteElement = createNS<SVGGElement>('g')
    this.transformedElement = this.layerElement
    this.maskedElement = this.layerElement
    this._sizeChanged = false
    let layerElementParent = null

    // If this layer acts as a mask for the following layer
    if (this.data.td) {
      this.matteMasks = {}
      const gg = createNS<SVGGElement>('g')

      if (this.layerId) {
        gg.setAttribute('id', this.layerId)
      }
      gg.appendChild(this.layerElement)

      layerElementParent = gg
      this.globalData.defs.appendChild(gg)
    } else if (this.data.tt) {
      this.matteElement.appendChild(this.layerElement)

      layerElementParent = this.matteElement
      this.baseElement = this.matteElement
    } else {
      this.baseElement = this.layerElement
    }
    if (this.data.ln) {
      this.layerElement.setAttribute('id', this.data.ln)
    }
    if (this.data.cl) {
      this.layerElement.setAttribute('class', this.data.cl)
    }
    /**
     * Clipping compositions to hide content that exceeds boundaries.
     * If collapsed transformations is on, component should not be clipped.
      */
    if (this.data.ty === 0 && !this.data.hd) {
      const cp = createNS<SVGClipPathElement>('clipPath'),
        pt = createNS<SVGPathElement>('path')

      pt.setAttribute('d',
        `M0,0 L${this.data.w},0 L${this.data.w},${this.data.h} L0,${
          this.data.h
        }z`)
      const clipId = createElementID()

      cp.setAttribute('id', clipId)
      cp.appendChild(pt)
      this.globalData.defs.appendChild(cp)

      if (this.checkMasks()) {
        const cpGroup = createNS<SVGGElement>('g')

        cpGroup.setAttribute('clip-path', `url(${getLocationHref()}#${clipId})`)
        cpGroup.appendChild(this.layerElement)

        this.transformedElement = cpGroup
        if (layerElementParent) {
          layerElementParent.appendChild(this.transformedElement)
        } else {
          this.baseElement = this.transformedElement
        }
      } else {
        this.layerElement.setAttribute('clip-path',
          `url(${getLocationHref()}#${clipId})`)
      }
    }
    if (this.data.bm !== 0) {
      this.setBlendMode()
    }
  }
  override createRenderableComponents() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: layerData is not initialized`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not initialized`)
    }
    this.maskManager = new MaskElement(
      this.data,
      this as unknown as ElementInterfaceIntersect,
      this.globalData
    )
    this.renderableEffectsManager = new SVGEffects(this as unknown as ElementInterfaceIntersect)
    this.searchEffectTransforms()
  }
  override destroyBaseElement() {
    this.layerElement = null as unknown as SVGGElement
    this.matteElement = null as unknown as SVGGElement
    this.maskManager?.destroy()
  }
  getBaseElement() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (this.data.hd) {
      return null
    }

    return this.baseElement ?? null
  }
  getMatte(matteType = 1): string {
    // This should not be a common case. But for backward compatibility, we'll create the matte object.
    // It solves animations that have two consecutive layers marked as matte masks.
    // Which is an undefined behavior in AE.
    this.matteMasks = this.matteMasks ?? {}
    if (this.matteMasks[matteType]) {
      return this.matteMasks[matteType]
    }
    const featureSupport = new FeatureSupport(),
      id = `${this.layerId}_${matteType}`
    let filId, fil, useElement, gg

    switch (matteType) {
      case 1:
      case 3: {
        {
          const masker = createNS('mask')

          masker.setAttribute('id', id)
          masker.setAttribute('mask-type',
            matteType === 3 ? 'luminance' : 'alpha')
          useElement = createNS('use')
          useElement.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'href',
            `#${this.layerId}`
          )
          masker.appendChild(useElement)
          this.globalData?.defs.appendChild(masker)
          if (featureSupport.maskType || matteType !== 1) {
            break
          }
          masker.setAttribute('mask-type', 'luminance')
          filId = createElementID()
          fil = createFilter(filId)
          this.globalData?.defs.appendChild(fil)
          fil.appendChild(createAlphaToLuminanceFilter())
          gg = createNS<SVGGElement>('g')
          gg.appendChild(useElement)
          masker.appendChild(gg)
          gg.setAttribute('filter', `url(${getLocationHref()}#${filId})`)
        }
        break
      }
      case 2: {
        const maskGroup = createNS<SVGMaskElement>('mask')

        maskGroup.setAttribute('id', id)
        maskGroup.setAttribute('mask-type', 'alpha')
        const maskGrouper = createNS<SVGGElement>('g')

        maskGroup.appendChild(maskGrouper)
        filId = createElementID()
        fil = createFilter(filId)
        // / /
        const feCTr = createNS<SVGFEComponentTransferElement>('feComponentTransfer')

        feCTr.setAttribute('in', 'SourceGraphic')
        fil.appendChild(feCTr)
        const feFunc = createNS('feFuncA')

        feFunc.setAttribute('type', 'table')
        feFunc.setAttribute('tableValues', '1.0 0.0')
        feCTr.appendChild(feFunc)
        // / /
        this.globalData?.defs.appendChild(fil)
        const alphaRect = createNS<SVGRectElement>('rect')

        // if (!alphaRect) {
        //   throw new Error(`${this.constructor.name}: Could not create RECT element`)
        // }
        alphaRect.setAttribute('width', `${Number(this.comp?.data?.w)}`)
        alphaRect.setAttribute('height', `${Number(this.comp?.data?.h)}`)
        alphaRect.setAttribute('x', '0')
        alphaRect.setAttribute('y', '0')
        alphaRect.setAttribute('fill', '#ffffff')
        alphaRect.setAttribute('opacity', '0')
        maskGrouper.setAttribute('filter', `url(${getLocationHref()}#${filId})`)
        maskGrouper.appendChild(alphaRect)
        useElement = createNS('use')
        useElement.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'href',
          `#${this.layerId}`
        )
        maskGrouper.appendChild(useElement)
        if (!featureSupport.maskType) {
          maskGroup.setAttribute('mask-type', 'luminance')
          fil.appendChild(createAlphaToLuminanceFilter())
          gg = createNS<SVGGElement>('g')
          maskGrouper.appendChild(alphaRect)
          if (this.layerElement) {
            gg.appendChild(this.layerElement)
          }

          maskGrouper.appendChild(gg)
        }
        this.globalData?.defs.appendChild(maskGroup)
      }
    }
    this.matteMasks[matteType] = id

    return this.matteMasks[matteType]
  }
  override initRendererElement() {
    this.layerElement = createNS<SVGGElement>('g')
  }
  override renderElement() {
    if (!this.finalTransform) {
      throw new Error(`${this.constructor.name}: finalTransform is not implemented`)
    }
    if (this.finalTransform._localMatMdf) {
      this.transformedElement?.setAttribute('transform',
        this.finalTransform.localMat.to2dCSS())
    }
    if (this.finalTransform._opMdf) {
      this.transformedElement?.setAttribute('opacity',
        `${this.finalTransform.localOpacity}`)
    }
  }
  setMatte(id: string) {
    if (!this.matteElement) {
      return
    }
    this.matteElement.setAttribute('mask', `url(${getLocationHref()}#${id})`)
  }
}
