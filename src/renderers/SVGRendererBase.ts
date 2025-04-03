import type { AnimationItem } from '@/Lottie'
import type {
  AnimationData,
  CompElementInterface,
  ElementInterfaceIntersect,
  LottieLayer,
  SVGRendererConfig,
} from '@/types'

import ImageElement from '@/elements/ImageElement'
import NullElement from '@/elements/NullElement'
import SolidElement from '@/elements/SolidElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'
import SVGTextLottieElement from '@/elements/svg/SVGTextElement'
import BaseRenderer from '@/renderers/BaseRenderer'
import { createNS } from '@/utils'
import {
  createElementID,
  getExpressionsPlugin,
  getLocationHref,
} from '@/utils/getterSetter'
import { createSizedArray } from '@/utils/helpers/arrays'

export default class SVGRendererBase extends BaseRenderer {
  destroyed?: boolean
  renderConfig?: SVGRendererConfig
  svgElement?: SVGSVGElement

  appendElementInPos(element: ElementInterfaceIntersect, pos: number) {
    if (!element.getBaseElement) {
      throw new Error(
        `${element.constructor.name}: Method getBaseElement is not implemented`
      )
    }
    const newElement = element.getBaseElement()
    if (!newElement) {
      return
    }
    let i = 0
    let nextElement
    while (i < pos) {
      if (
        this.elements[i] &&
        this.elements[i] !== (true as unknown as ElementInterfaceIntersect) &&
        this.elements[i].getBaseElement()
      ) {
        nextElement = this.elements[i].getBaseElement()
      }
      i++
    }
    if (nextElement) {
      this.layerElement?.insertBefore(newElement, nextElement)
    } else {
      this.layerElement?.appendChild(newElement)
    }
  }

  override buildItem(pos: number) {
    if (!this.layers) {
      throw new Error(`${this.constructor.name}: layers it not implemented`)
    }

    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData it not implemented`)
    }

    const elements = this.elements
    if (elements[pos] || this.layers[pos].ty === 99) {
      return
    }

    elements[pos] = true as unknown as ElementInterfaceIntersect

    const element = this.createItem(this.layers[pos])

    if (!element) {
      throw new Error(`${this.constructor.name}: Could not create element`)
    }

    elements[pos] = element as ElementInterfaceIntersect
    if (getExpressionsPlugin()) {
      if (this.layers[pos].ty === 0) {
        this.globalData.projectInterface.registerComposition(
          element as CompElementInterface
        )
      }
      element.initExpressions()
    }
    this.appendElementInPos(element as ElementInterfaceIntersect, pos)
    if (this.layers[pos].tt) {
      const elementIndex =
        'tp' in this.layers[pos]
          ? this.findIndexByInd(this.layers[pos].tp)
          : pos - 1
      if (elementIndex === -1) {
        return
      }
      if (
        !this.elements[elementIndex] ||
        this.elements[elementIndex] ===
          (true as unknown as ElementInterfaceIntersect)
      ) {
        this.buildItem(elementIndex)
        this.addPendingElement(element as ElementInterfaceIntersect)
        return
      }
      const matteElement = elements[elementIndex],
        matteMask = matteElement.getMatte(this.layers[pos].tt)
      ;(element as ElementInterfaceIntersect).setMatte(matteMask)
    }
  }

  override checkPendingElements() {
    while (this.pendingElements.length) {
      const element = this.pendingElements.pop()
      element?.checkParenting()
      if (element?.data?.tt) {
        let i = 0
        const { length } = this.elements || []
        while (i < length) {
          if (this.elements[i] !== element) {
            i++
            continue
          }
          const elementIndex =
              'tp' in element.data
                ? this.findIndexByInd(element.data.tp)
                : i - 1,
            matteElement = this.elements[elementIndex],
            matteMask = matteElement.getMatte(this.layers[i].tt)

          element.setMatte(matteMask)
          break
        }
        i++
      }
    }
  }

  configAnimation(animData: AnimationData) {
    try {
      if (!this.animationItem) {
        throw new Error(`${this.constructor.name}: Can't access animationItem`)
      }
      if (!this.globalData) {
        throw new Error(`${this.constructor.name}: Can't access globalData`)
      }
      if (!this.renderConfig) {
        throw new Error(`${this.constructor.name}: Can't access renderConfig`)
      }
      if (!this.svgElement) {
        throw new Error(`${this.constructor.name}: Can't access svgElement`)
      }

      this.svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      this.svgElement.setAttribute(
        'xmlns:xlink',
        'http://www.w3.org/1999/xlink'
      )
      if (this.renderConfig.viewBoxSize) {
        this.svgElement.setAttribute('viewBox', this.renderConfig.viewBoxSize)
      } else {
        this.svgElement.setAttribute(
          'viewBox',
          `0 0 ${animData.w} ${animData.h}`
        )
      }

      if (!this.renderConfig.viewBoxOnly) {
        this.svgElement.setAttribute('width', `${animData.w}`)
        this.svgElement.setAttribute('height', `${animData.h}`)
        this.svgElement.style.width = '100%'
        this.svgElement.style.height = '100%'
        this.svgElement.style.transform = 'translate3d(0,0,0)'
        if (this.renderConfig?.contentVisibility) {
          this.svgElement.style.contentVisibility =
            this.renderConfig.contentVisibility
        }
      }
      if (this.renderConfig.width) {
        this.svgElement.setAttribute('width', `${this.renderConfig.width}`)
      }
      if (this.renderConfig.height) {
        this.svgElement.setAttribute('height', `${this.renderConfig.height}`)
      }
      if (this.renderConfig.className) {
        this.svgElement.setAttribute('class', this.renderConfig.className)
      }
      if (this.renderConfig.id) {
        this.svgElement.setAttribute('id', this.renderConfig.id)
      }
      if (this.renderConfig.focusable !== undefined) {
        this.svgElement.setAttribute(
          'focusable',
          `${this.renderConfig.focusable}`
        )
      }
      if (this.renderConfig.preserveAspectRatio) {
        this.svgElement.setAttribute(
          'preserveAspectRatio',
          this.renderConfig.preserveAspectRatio
        )
      }

      this.animationItem.wrapper?.appendChild(this.svgElement)
      // Mask animation
      const defs = this.globalData.defs

      this.setupGlobalData(animData, defs)
      this.globalData.progressiveLoad = this.renderConfig.progressiveLoad
      this.data = animData as unknown as LottieLayer

      const maskElement = createNS<SVGClipPathElement>('clipPath'),
        rect = createNS<SVGRectElement>('rect')
      rect.setAttribute('width', `${animData.w}`)
      rect.setAttribute('height', `${animData.h}`)
      rect.setAttribute('x', '0')
      rect.setAttribute('y', '0')
      const maskId = createElementID()
      maskElement.setAttribute('id', maskId)
      maskElement.appendChild(rect)
      this.layerElement?.setAttribute(
        'clip-path',
        `url(${getLocationHref()}#${maskId})`
      )

      defs.appendChild(maskElement)
      this.layers = animData.layers
      this.elements = createSizedArray(animData.layers.length)
    } catch (err) {
      console.error(err)
    }
  }

  override createImage(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }
    return new ImageElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createNull(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }
    return new NullElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createShape(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }
    return new SVGShapeElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createSolid(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }
    return new SolidElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createText(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }
    return new SVGTextLottieElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  destroy() {
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: Can't access animationItem`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }

    if (this.animationItem.wrapper) {
      this.animationItem.wrapper.innerText = ''
    }
    this.layerElement = null as unknown as SVGGElement
    this.globalData.defs = null as unknown as SVGDefsElement
    const { length } = this.layers
    for (let i = 0; i < length; i++) {
      this.elements[i].destroy()
    }
    this.elements.length = 0
    this.destroyed = true
    this.animationItem = null as unknown as AnimationItem
  }

  findIndexByInd(ind?: number) {
    const { length } = this.layers
    for (let i = 0; i < length; i++) {
      if (this.layers[i].ind === ind) {
        return i
      }
    }
    return -1
  }

  hide() {
    if (this.layerElement) {
      this.layerElement.style.display = 'none'
    }
  }

  renderFrame(numFromProps?: number | null) {
    try {
      if (
        !this.globalData ||
        this.renderedFrame === numFromProps ||
        this.destroyed
      ) {
        return
      }
      let num = numFromProps
      if (num === null) {
        num = this.renderedFrame
      } else {
        this.renderedFrame = Number(num)
      }
      this.globalData.frameNum = num
      this.globalData.frameId++
      this.globalData.projectInterface.currentFrame = num || 0
      this.globalData._mdf = false
      const { length } = this.layers
      if (!this.completeLayers) {
        this.checkLayers(num)
      }
      for (let i = length - 1; i >= 0; i--) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].prepareFrame(Number(num) - Number(this.layers[i].st))
        }
      }
      if (this.globalData._mdf) {
        for (let i = 0; i < length; i++) {
          if (this.completeLayers || this.elements[i]) {
            this.elements[i].renderFrame()
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  show() {
    if (!this.layerElement) {
      throw new Error(
        `${this.constructor.name}: layerElement is not implemented`
      )
    }
    this.layerElement.style.display = 'block'
  }

  updateContainerSize(_width?: number, _height?: number) {
    throw new Error(
      `${this.constructor.name}: Method updateContainerSize is not implemented`
    )
  }
}
