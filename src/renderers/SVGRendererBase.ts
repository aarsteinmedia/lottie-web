import type AnimationItem from '@/animation/AnimationItem'
import type {
  AnimationData,
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
import { createElementID } from '@/utils'
import { getExpressionsPlugin } from '@/utils/expressions'
import { createSizedArray } from '@/utils/helpers/arrays'
import { namespaceSVG } from '@/utils/helpers/constants'
import { getLocationHref } from '@/utils/helpers/locationHref'
import createNS from '@/utils/helpers/svgElements'

export default abstract class SVGRendererBase extends BaseRenderer {
  destroyed?: boolean
  renderConfig?: SVGRendererConfig
  svgElement?: SVGSVGElement

  appendElementInPos(element: ElementInterfaceIntersect, pos: number) {
    const newElement = element.getBaseElement()

    if (!newElement) {
      return
    }
    let i = 0,
      nextElement

    while (i < pos) {
      if (this.elements[i] !== (true as unknown as ElementInterfaceIntersect) && this.elements[i]?.getBaseElement()) {
        nextElement = this.elements[i].getBaseElement()
      }
      i++
    }
    if (nextElement) {
      this.layerElement?.insertBefore(newElement, nextElement)

      return
    }
    this.layerElement?.appendChild(newElement)
  }

  override buildItem(pos: number) {

    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData it not implemented`)
    }

    const {
      elements, globalData, layers
    } = this

    if (elements[pos] || layers[pos].ty === 99) {
      return
    }

    elements[pos] = true as unknown as ElementInterfaceIntersect

    const element = this.createItem(layers[pos]) as ElementInterfaceIntersect

    elements[pos] = element
    if (getExpressionsPlugin()) {
      if (layers[pos].ty === 0) {
        globalData.projectInterface.registerComposition(element)
      }
      element.initExpressions()
    }
    this.appendElementInPos(element, pos)
    if (layers[pos].tt) {
      const elementIndex =
        'tp' in layers[pos]
          ? this.findIndexByInd(layers[pos].tp)
          : pos - 1

      if (elementIndex === -1) {
        return
      }
      if (
        !elements[elementIndex] ||
        elements[elementIndex] ===
        (true as unknown as ElementInterfaceIntersect)
      ) {
        this.buildItem(elementIndex)
        this.addPendingElement(element)

        return
      }
      const matteElement = elements[elementIndex],
        matteMask = matteElement.getMatte(layers[pos].tt)

      element.setMatte(matteMask)
    }
  }

  override checkPendingElements() {
    while (this.pendingElements.length > 0) {
      const element = this.pendingElements.pop()

      element?.checkParenting()

      if (element?.data.tt) {

        let i = 0

        const { length } = this.elements

        while (i < length) {
          if (this.elements[i] !== element) {
            i++
            continue
          }
          const elementIndex = 'tp' in element.data
              ? this.findIndexByInd(element.data.tp)
              : i - 1,
            matteMask = this.elements[elementIndex].getMatte(this.layers[i].tt)

          element.setMatte(matteMask)
          break
        }
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

      this.svgElement.setAttribute('xmlns', namespaceSVG)
      // this.svgElement.setAttribute('xmlns:xlink',
      //   namespaceXlink)
      if (this.renderConfig.viewBoxSize) {
        this.svgElement.setAttribute('viewBox',
          this.renderConfig.viewBoxSize)
      } else {
        this.svgElement.setAttribute('viewBox', `0 0 ${animData.w} ${animData.h}`)
      }

      if (!this.renderConfig.viewBoxOnly) {
        this.svgElement.setAttribute('width', `${animData.w}`)
        this.svgElement.setAttribute('height', `${animData.h}`)
        this.svgElement.style.width = '100%'
        this.svgElement.style.height = '100%'
        this.svgElement.style.transform = 'translate3d(0,0,0)'
        if (this.renderConfig.contentVisibility) {
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
        this.svgElement.classList.add(this.renderConfig.className)
      }
      if (this.renderConfig.id) {
        this.svgElement.id = this.renderConfig.id
      }
      if (this.renderConfig.focusable !== undefined) {
        this.svgElement.setAttribute('focusable',
          `${this.renderConfig.focusable}`)
      }
      if (this.renderConfig.preserveAspectRatio) {
        this.svgElement.setAttribute('preserveAspectRatio',
          this.renderConfig.preserveAspectRatio)
      }

      this.animationItem.wrapper?.appendChild(this.svgElement)
      // Mask animation
      const { defs } = this.globalData

      this.setupGlobalData(animData, defs)
      this.globalData.progressiveLoad = this.renderConfig.progressiveLoad
      this.data = animData as unknown as LottieLayer

      const maskElement = createNS<SVGClipPathElement>('clipPath'),
        rect = createNS<SVGRectElement>('rect')

      rect.width.baseVal.value = animData.w
      rect.height.baseVal.value = animData.h
      rect.x.baseVal.value = 0
      rect.y.baseVal.value = 0
      const maskId = createElementID()

      maskElement.id = maskId
      maskElement.appendChild(rect)
      this.layerElement?.setAttribute('clip-path',
        `url(${getLocationHref()}#${maskId})`)

      defs.appendChild(maskElement)
      this.layers = animData.layers
      this.elements = createSizedArray(animData.layers.length)
    } catch (error) {
      console.error(`${this.constructor.name}:\n`, error)
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

  override destroy() {
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
      this.elements[i]?.destroy()
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
    if (!this.layerElement) {
      throw new Error(`${this.constructor.name}: layerElement is not implemented`)
    }
    this.layerElement.style.display = 'none'
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
        if (typeof this.elements[i] === 'boolean') {
          continue
        }

        if (this.completeLayers || this.elements[i]) {
          this.elements[i]?.prepareFrame(Number(num) - this.layers[i].st)
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.globalData._mdf) {
        for (let i = 0; i < length; i++) {
          if (typeof this.elements[i] === 'boolean') {
            continue
          }

          if (this.completeLayers || this.elements[i]) {
            this.elements[i]?.renderFrame()
          }
        }
      }
    } catch (error) {
      console.error(this.constructor.name, error)
    }
  }

  show() {
    if (!this.layerElement) {
      throw new Error(`${this.constructor.name}: layerElement is not implemented`)
    }
    this.layerElement.style.display = 'block'
  }

  updateContainerSize(_width?: number, _height?: number) {
    throw new Error(`${this.constructor.name}: Method updateContainerSize is not implemented`)
  }
}
