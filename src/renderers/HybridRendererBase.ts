import type AnimationItem from '@/animation/AnimationItem'
import type {
  AnimationData,
  ElementInterfaceIntersect,
  GlobalData,
  HTMLRendererConfig,
  LottieLayer,
  ThreeDElements,
} from '@/types'

import HCameraElement from '@/elements/html/HCameraElement'
import HImageElement from '@/elements/html/HImageElement'
import HShapeElement from '@/elements/html/HShapeElement'
import HSolidElement from '@/elements/html/HSolidElement'
import HTextElement from '@/elements/html/HTextElement'
import ImageElement from '@/elements/ImageElement'
import ISolidElement from '@/elements/SolidElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'
import SVGTextLottieElement from '@/elements/svg/SVGTextElement'
import BaseRenderer from '@/renderers/BaseRenderer'
import SVGRenderer from '@/renderers/SVGRenderer'
import {
  createNS, createTag, styleDiv
} from '@/utils'
import { RendererType } from '@/utils/enums'

export default class HybridRendererBase extends BaseRenderer {
  camera?: HCameraElement
  destroyed: boolean
  renderConfig: HTMLRendererConfig
  rendererType: RendererType
  resizerElem?: HTMLDivElement
  supports3d: boolean

  threeDElements: ThreeDElements[]

  constructor(animationItem: AnimationItem, config?: HTMLRendererConfig) {
    super()
    this.animationItem = animationItem
    this.layers = null as unknown as LottieLayer[]
    this.renderedFrame = -1
    this.renderConfig = {
      className: config && config.className || '',
      filterSize: {
        height: config?.filterSize.height || '400%',
        width: config?.filterSize.width || '400%',
        x: config?.filterSize.x || '-100%',
        y: config?.filterSize.y || '-100%',
      },
      hideOnTransparent: !(config && config.hideOnTransparent === false),
      imagePreserveAspectRatio:
        config?.imagePreserveAspectRatio || 'xMidYMid slice',
    }
    this.globalData = {
      _mdf: false,
      frameNum: -1,
      renderConfig: this.renderConfig,
    } as GlobalData
    this.pendingElements = []
    this.elements = []
    this.threeDElements = []
    this.destroyed = false
    this.camera = null as unknown as HCameraElement
    this.supports3d = true
    this.rendererType = RendererType.HTML

    const {
      buildItem, createNull, renderFrame
    } = SVGRenderer.prototype

    this.buildItem = buildItem
    this.createNull = createNull
    this.renderFrame = renderFrame
  }

  addTo3dContainer(elem: HTMLElement, pos: number) {
    let i = 0
    const len = this.threeDElements.length

    while (i < len) {
      if (pos <= this.threeDElements[i].endPos) {
        let j = this.threeDElements[i].startPos,
          nextElement

        while (j < pos) {
          nextElement = this.elements[j]?.getBaseElement?.()
          j++
        }
        if (nextElement) {
          this.threeDElements[i].container.insertBefore(elem, nextElement)
        } else {
          this.threeDElements[i].container.appendChild(elem)
        }
        break
      }
      i++
    }
  }

  appendElementInPos(element: ElementInterfaceIntersect, pos: number) {
    const newDOMElement = element.getBaseElement() as HTMLElement | null

    if (!newDOMElement) {
      return
    }
    const layer = this.layers[pos]

    if (!layer.ddd || !this.supports3d) {
      if (this.threeDElements.length > 0) {
        this.addTo3dContainer(newDOMElement, pos)
      } else {
        let i = 0
        let nextDOMElement
        let nextLayer
        let tmpDOMElement

        while (i < pos) {
          if (
            this.elements[i] !==
              (true as unknown as ElementInterfaceIntersect) &&
            Boolean(this.elements[i]?.getBaseElement)
          ) {
            nextLayer = this.elements[i]
            tmpDOMElement = this.layers[i].ddd
              ? this.getThreeDContainerByPos(i)
              : nextLayer.getBaseElement()
            nextDOMElement = tmpDOMElement ?? nextDOMElement
          }
          i++
        }
        if (nextDOMElement) {
          if (!layer.ddd || !this.supports3d) {
            this.layerElement?.insertBefore(newDOMElement, nextDOMElement)
          }
        } else if (!layer.ddd || !this.supports3d) {
          this.layerElement?.appendChild(newDOMElement)
        }
      }
    } else {
      this.addTo3dContainer(newDOMElement, pos)
    }
  }

  build3dContainers() {
    const { length } = this.layers
    let lastThreeDContainerData
    let currentContainer = ''

    for (let i = 0; i < length; i++) {
      if (this.layers[i].ddd && this.layers[i].ty !== 3) {
        if (currentContainer !== '3d') {
          currentContainer = '3d'
          lastThreeDContainerData = this.createThreeDContainer(i, '3d')
        }
        if (!lastThreeDContainerData) {
          continue
        }
        lastThreeDContainerData.endPos = Math.max(lastThreeDContainerData.endPos,
          i)
      } else {
        if (currentContainer !== '2d') {
          currentContainer = '2d'
          lastThreeDContainerData = this.createThreeDContainer(i, '2d')
        }
        if (!lastThreeDContainerData) {
          continue
        }
        lastThreeDContainerData.endPos = Math.max(lastThreeDContainerData.endPos,
          i)
      }
    }
    const { length: len } = this.threeDElements

    for (let i = len - 1; i >= 0; i--) {
      this.resizerElem?.appendChild(this.threeDElements[i].perspectiveElem)
    }
  }

  override checkPendingElements() {
    while (this.pendingElements.length > 0) {
      const element = this.pendingElements.pop()

      element?.checkParenting()
    }
  }

  configAnimation(animData: AnimationData) {
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: animationItem is not implemented`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    const resizerElem = createTag<HTMLDivElement>('div'),
      { wrapper } = this.animationItem,
      { style } = resizerElem

    style.width = `${animData.w}px`
    style.height = `${animData.h}px`
    this.resizerElem = resizerElem
    styleDiv(resizerElem)
    style.transformStyle = 'flat'
    if (this.renderConfig.className) {
      resizerElem.setAttribute('class', this.renderConfig.className)
    }
    wrapper?.appendChild(resizerElem)

    style.overflow = 'hidden'
    const svg = createNS<SVGSVGElement>('svg')

    svg.setAttribute('width', '1')
    svg.setAttribute('height', '1')
    styleDiv(svg)
    this.resizerElem.appendChild(svg)
    const defs = createNS<SVGDefsElement>('defs')

    svg.appendChild(defs)
    this.data = animData as unknown as LottieLayer
    // Mask animation
    this.setupGlobalData(animData, svg)
    this.globalData.defs = defs
    this.layers = animData.layers
    this.layerElement = this.resizerElem
    this.build3dContainers()
    this.updateContainerSize()
  }

  override createCamera(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    this.camera = new HCameraElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )

    return this.camera
  }

  override createImage(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.supports3d) {
      return new ImageElement(
        data,
        this.globalData,
        this as unknown as ElementInterfaceIntersect
      )
    }

    return new HImageElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createShape(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.supports3d) {
      return new SVGShapeElement(
        data,
        this.globalData,
        this as unknown as ElementInterfaceIntersect
      )
    }

    return new HShapeElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createSolid(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.supports3d) {
      return new ISolidElement(
        data,
        this.globalData,
        this as unknown as ElementInterfaceIntersect
      )
    }

    return new HSolidElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override createText(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.supports3d) {
      return new SVGTextLottieElement(
        data,
        this.globalData,
        this as unknown as ElementInterfaceIntersect
      )
    }

    return new HTextElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  createThreeDContainer(pos: number, type: string) {
    const perspectiveElem = createTag<HTMLDivElement>('div')
    let style
    let containerStyle

    styleDiv(perspectiveElem)
    const container = createTag('div')

    styleDiv(container)
    if (type === '3d') {
      style = perspectiveElem.style
      style.width = `${this.globalData?.compSize?.w}px`
      style.height = `${this.globalData?.compSize?.h}px`
      const center = '50% 50%'

      style.transformOrigin = center
      containerStyle = container.style
      const matrix = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'

      containerStyle.transform = matrix
    }

    perspectiveElem.appendChild(container)
    // this.resizerElem.appendChild(perspectiveElem);
    const threeDContainerData = {
      container,
      endPos: pos,
      perspectiveElem,
      startPos: pos,
      type,
    }

    this.threeDElements.push(threeDContainerData)

    return threeDContainerData
  }

  destroy() {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: animationItem is not implemented`)
    }

    if (this.animationItem.wrapper) {
      this.animationItem.wrapper.innerText = ''
    }
    this.animationItem.container = null as any
    this.globalData.defs = null as unknown as SVGDefsElement
    const { length } = this.layers

    for (let i = 0; i < length; i++) {
      this.elements[i].destroy()
    }
    this.elements.length = 0
    this.destroyed = true
    this.animationItem = null as unknown as AnimationItem
  }

  getThreeDContainerByPos(pos: number) {
    let i = 0
    const len = this.threeDElements.length

    while (i < len) {
      if (
        this.threeDElements[i].startPos <= pos &&
        this.threeDElements[i].endPos >= pos
      ) {
        return this.threeDElements[i].perspectiveElem
      }
      i++
    }

    return null
  }

  hide() {
    if (!this.resizerElem) {
      throw new Error(`${this.constructor.name}: resizerElem is not implemented`)
    }
    this.resizerElem.style.display = 'none'
  }

  override initItems() {
    this.buildAllItems()
    if (this.camera) {
      this.camera.setup()
    } else {
      if (!this.globalData?.compSize) {
        throw new Error(`${this.constructor.name}: globalData->compSize is not implemented`)
      }
      const cWidth = this.globalData.compSize.w
      const cHeight = this.globalData.compSize.h
      const { length } = this.threeDElements

      for (let i = 0; i < length; i++) {
        const { style } = this.threeDElements[i].perspectiveElem

        style.perspective = `${Math.sqrt(Math.pow(cWidth, 2) + Math.pow(cHeight, 2))}px`
      }
    }
  }

  renderFrame(_num: number | null) {
    throw new Error(`${this.constructor.name}: Method renderFrame is not implemented`)
  }

  override searchExtraCompositions(assets: LottieLayer[]) {
    if (!this.globalData?.comp) {
      throw new Error(`${this.constructor.name}: globalData->comp is not implemented`)
    }
    const { length } = assets,
      floatingContainer = createTag<HTMLDivElement>('div')

    for (let i = 0; i < length; i++) {
      if (assets[i].xt) {
        const comp = this.createComp(
          assets[i],
          floatingContainer,
          this.globalData.comp,
          null
        )

        comp.initExpressions()
        this.globalData.projectInterface.registerComposition(comp)
      }
    }
  }

  show() {
    if (!this.resizerElem) {
      throw new Error(`${this.constructor.name}: resizerElem is not implemented`)
    }
    this.resizerElem.style.display = 'block'
  }

  updateContainerSize() {
    if (!this.globalData?.compSize) {
      throw new Error(`${this.constructor.name}: compSize is not implemented in globalData`)
    }
    if (!this.animationItem?.wrapper) {
      throw new Error(`${this.constructor.name}: wrapper is not implemented in animationItem`)
    }
    const elementWidth = this.animationItem.wrapper.offsetWidth
    const elementHeight = this.animationItem.wrapper.offsetHeight
    const elementRel = elementWidth / elementHeight
    const animationRel = this.globalData.compSize.w / this.globalData.compSize.h
    let sx
    let sy
    let tx
    let ty

    if (animationRel > elementRel) {
      sx = elementWidth / this.globalData.compSize.w
      sy = elementWidth / this.globalData.compSize.w
      tx = 0
      ty =
        (elementHeight -
          this.globalData.compSize.h *
            (elementWidth / this.globalData.compSize.w)) /
        2
    } else {
      sx = elementHeight / this.globalData.compSize.h
      sy = elementHeight / this.globalData.compSize.h
      tx =
        (elementWidth -
          this.globalData.compSize.w *
            (elementHeight / this.globalData.compSize.h)) /
        2
      ty = 0
    }
    if (this.resizerElem) {
      const { style } = this.resizerElem

      style.transform = `matrix3d(${sx},0,0,0,0,${sy},0,0,0,0,1,0,${tx},${
        ty
      },0,1)`
    }
  }
}
