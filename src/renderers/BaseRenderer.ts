import type AnimationItem from '@/animation/AnimationItem'
import type CVCompElement from '@/elements/canvas/CVCompElement'
import type CVImageElement from '@/elements/canvas/CVImageElement'
import type CVShapeElement from '@/elements/canvas/CVShapeElement'
import type CVSolidElement from '@/elements/canvas/CVSolidElement'
import type CVTextElement from '@/elements/canvas/CVTextElement'
import type HierarchyElement from '@/elements/helpers/HierarchyElement'
import type HCameraElement from '@/elements/html/HCameraElement'
import type HCompElement from '@/elements/html/HCompElement'
import type HImageElement from '@/elements/html/HImageElement'
import type HShapeElement from '@/elements/html/HShapeElement'
import type HTextElement from '@/elements/html/HTextElement'
import type ImageElement from '@/elements/ImageElement'
import type NullElement from '@/elements/NullElement'
import type SolidElement from '@/elements/SolidElement'
import type SVGCompElement from '@/elements/svg/SVGCompElement'
import type SVGShapeElement from '@/elements/svg/SVGShapeElement'
import type SVGTextLottieElement from '@/elements/svg/SVGTextElement'
import type {
  AnimationData,
  CompElementInterface,
  ElementInterfaceIntersect,
  LottieLayer,
} from '@/types'
import type ProjectInterface from '@/utils/expressions/ProjectInterface'

import AudioElement from '@/elements/AudioElement'
import FootageElement from '@/elements/FootageElement'
import FrameElement from '@/elements/helpers/FrameElement'
import FontManager from '@/utils/FontManager'
import slotFactory from '@/utils/SlotManager'

export default abstract class BaseRenderer extends FrameElement {
  animationItem?: AnimationItem
  completeLayers?: boolean
  currentFrame = 0
  elements: ElementInterfaceIntersect[] = []
  layers: LottieLayer[] = []
  pendingElements: ElementInterfaceIntersect[] = []
  renderedFrame = -1

  addPendingElement(element: ElementInterfaceIntersect) {
    this.pendingElements.push(element)
  }

  override buildAllItems() {
    const { length } = this.layers

    for (let i = 0; i < length; i++) {
      this.buildItem(i)
    }
    this.checkPendingElements()
  }

  buildElementParenting(
    element: ElementInterfaceIntersect,
    parentName?: number,
    hierarchy: ElementInterfaceIntersect[] = []
  ) {
    const { elements, layers } = this,
      { length } = layers
    let i = 0

    while (i < length) {
      if (layers[i].ind !== parentName) {
        i++
        continue
      }
      if (
        !elements[i] ||
        elements[i] === (true as unknown as ElementInterfaceIntersect)
      ) {
        this.buildItem(i)

        // if (!this.addPendingElement) {
        //   throw new Error(`${this.constructor.name}: Method addPendingElement is not initialized`)
        // }
        this.addPendingElement(element)
        i++
        continue
      }
      hierarchy.push(elements[i])
      ;(elements[i] as HierarchyElement).setAsParent()
      if (layers[i].parent === undefined) {
        element.setHierarchy(hierarchy)
        i++
        continue
      }
      this.buildElementParenting(
        element, layers[i].parent, hierarchy
      )
      i++
    }
  }

  buildItem(_val: number) {
    throw new Error(`${this.constructor.name}: Method buildItem not yet implemented`)
  }

  override checkLayers(val?: number) {
    this.completeLayers = true
    const { length } = this.layers

    for (let i = length - 1; i >= 0; i--) {
      if (!this.elements[i] &&
        (this.layers[i].ip - this.layers[i].st <=
          Number(val) - this.layers[i].st &&
          this.layers[i].op - this.layers[i].st >
          Number(val) - this.layers[i].st)
      ) {
        this.buildItem(i)
      }
      this.completeLayers = this.elements[i] ? this.completeLayers : false
    }
    this.checkPendingElements()
  }

  checkPendingElements() {
    throw new Error(`${this.constructor.name}: Method checkPendingElements not yet implemented`)
  }

  createAudio(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }

    return new AudioElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  createCamera(_data: LottieLayer): HCameraElement {
    throw new Error('You\'re using a 3d camera. Try the html renderer.')
  }

  createComp(
    _data: LottieLayer,
    _container?: HTMLElement,
    _comp?: CompElementInterface,
    _?: unknown
  ): SVGCompElement | CVCompElement | HCompElement {
    throw new Error(`${this.constructor.name}: Method createComp not yet implemented`)
  }

  createFootage(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }

    return new FootageElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  createImage(_layer: LottieLayer): CVImageElement | ImageElement | HImageElement {
    throw new Error(`${this.constructor.name}: Method createImage is not implemented`)
  }

  createItem(layer: LottieLayer) {
    switch (layer.ty) {
      case 2: {
        return this.createImage(layer)
      }
      case 0: {
        return this.createComp(layer)
      }
      case 1: {
        return this.createSolid(layer)
      }
      case 3: {
        return this.createNull(layer)
      }
      case 4: {
        return this.createShape(layer)
      }
      case 5: {
        return this.createText(layer)
      }
      case 6: {
        return this.createAudio(layer)
      }
      case 13: {
        return this.createCamera(layer)
      }
      case 15: {
        return this.createFootage(layer)
      }
      default: {
        return this.createNull(layer)
      }
    }
  }

  createNull(_layer: LottieLayer): NullElement {
    throw new Error(`${this.constructor.name}: Method createNull not implemented`)
  }

  createShape(_layer: LottieLayer): CVShapeElement | SVGShapeElement | HShapeElement {
    throw new Error(`${this.constructor.name}: Method createShape not implemented`)
  }

  createSolid(_layer: LottieLayer): CVSolidElement | SolidElement {
    throw new Error(`${this.constructor.name}: Method createSolid not implemented`)
  }

  createText(_layer: LottieLayer): SVGTextLottieElement | CVTextElement | HTextElement {
    throw new Error(`${this.constructor.name}: Method createText not implemented`)
  }

  getElementById(ind: number): null | ElementInterfaceIntersect {
    const { length } = this.elements

    for (let i = 0; i < length; i++) {
      if (this.elements[i].data.ind === ind) {
        return this.elements[i]
      }
    }

    return null
  }

  getElementByPath(path: unknown[]): ElementInterfaceIntersect | undefined {
    const pathValue = path.shift()
    let element

    if (typeof pathValue === 'number') {
      element = this.elements[pathValue]
    } else {
      const { length } = this.elements

      for (let i = 0; i < length; i++) {
        if (this.elements[i].data.nm === pathValue) {
          element = this.elements[i]
          break
        }
      }
    }
    if (path.length === 0) {
      return element
    }

    return element?.getElementByPath(path)
  }

  includeLayers(newLayers: LottieLayer[]) {
    this.completeLayers = false
    const { length } = newLayers,
      { length: jLen } = this.layers

    for (let i = 0; i < length; i++) {
      let j = 0

      while (j < jLen) {
        if (this.layers[j].id === newLayers[i].id) {
          this.layers[j] = newLayers[i]
          break
        }
        j++
      }
    }
  }

  initItems() {
    if (!this.globalData?.progressiveLoad) {
      this.buildAllItems()
    }
  }

  prepareFrame(_num: number) {
    throw new Error(`${this.constructor.name}: Method prepareFrame not yet implemented`)
  }

  searchExtraCompositions(assets: LottieLayer[]) {
    const { length } = assets

    for (let i = 0; i < length; i++) {
      if (assets[i].xt) {
        const comp = this.createComp(assets[i])

        comp.initExpressions()
        this.globalData?.projectInterface.registerComposition(comp)
      }
    }
  }

  setProjectInterface(pInterface: ProjectInterface | null) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!pInterface) {
      return
    }
    this.globalData.projectInterface = pInterface
  }

  setupGlobalData(animData: AnimationData,
    fontsContainer: HTMLElement | SVGDefsElement) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.animationItem) {
      throw new Error(`${this.constructor.name}: animationItem is not implemented`)
    }
    this.globalData.fontManager = new FontManager()
    this.globalData.slotManager = slotFactory(animData as unknown as LottieLayer)
    this.globalData.fontManager.addChars(animData.chars)
    this.globalData.fontManager.addFonts(animData.fonts, fontsContainer)
    this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem)
    this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem)

    this.globalData.imageLoader = this.animationItem.imagePreloader
    this.globalData.audioController = this.animationItem.audioController
    this.globalData.frameId = 0
    this.globalData.frameRate = animData.fr || 60
    this.globalData.nm = animData.nm
    this.globalData.compSize = {
      h: Number(animData.h),
      w: Number(animData.w),
    }
  }
}
