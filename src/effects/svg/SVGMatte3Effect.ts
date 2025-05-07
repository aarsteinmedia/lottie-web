import type { GroupEffect } from '@/effects/EffectsManager'
import type { ElementInterfaceIntersect } from '@/types'

import { createNS } from '@/utils'
import { createElementID } from '@/utils/getterSetter'

const _svgMatteSymbols: ElementInterfaceIntersect[] = []

export default class SVGMatte3Effect {
  elem: ElementInterfaceIntersect
  filterElem: SVGFilterElement
  filterManager: GroupEffect
  initialized?: boolean

  constructor(
    filterElem: SVGFilterElement,
    filterManager: GroupEffect,
    elem: ElementInterfaceIntersect
  ) {
    this.initialized = false
    this.filterManager = filterManager
    this.filterElem = filterElem
    this.elem = elem
    elem.matteElement = createNS<SVGGElement>('g')
    if (elem.layerElement) {
      elem.matteElement.appendChild(elem.layerElement)
    }
    if (elem.transformedElement) {
      elem.matteElement.appendChild(elem.transformedElement)
    }
    elem.baseElement = elem.matteElement
  }
  findSymbol(mask: ElementInterfaceIntersect) {
    let i = 0
    const len = _svgMatteSymbols.length

    while (i < len) {
      if (_svgMatteSymbols[i] === mask) {
        return _svgMatteSymbols[i]
      }
      i++
    }

    return null
  }
  initialize() {
    const ind = this.filterManager.effectElements[0].p.v
    const elements = this.elem.comp?.elements ?? []
    let i = 0
    const { length } = elements

    while (i < length) {
      if (elements[i] && elements[i].data.ind === ind) {
        this.setElementAsMask(this.elem, elements[i])
      }
      i++
    }
    this.initialized = true
  }
  renderFrame() {
    if (!this.initialized) {
      this.initialize()
    }
  }

  replaceInParent(mask: ElementInterfaceIntersect, symbolId: string) {
    const parentNode = mask.layerElement?.parentNode

    if (!parentNode) {
      return
    }
    const { children } = parentNode
    let i = 0
    const len = children.length

    while (i < len) {
      if (children[i] === mask.layerElement) {
        break
      }
      i++
    }
    let nextChild

    if (i <= len - 2) {
      nextChild = children[i + 1]
    }
    const useElem = createNS<SVGUseElement>('use')

    useElem.setAttribute('href', `#${symbolId}`)
    if (nextChild) {
      parentNode.insertBefore(useElem, nextChild)
    } else {
      parentNode.appendChild(useElem)
    }
  }

  setElementAsMask(elem: ElementInterfaceIntersect,
    mask: ElementInterfaceIntersect) {
    if (!this.findSymbol(mask)) {
      const symbolId = createElementID(),
        masker = createNS<SVGMaskElement>('mask')

      masker.setAttribute('id', mask.layerId || '')
      masker.setAttribute('mask-type', 'alpha')
      _svgMatteSymbols.push(mask)
      const { defs } = elem.globalData

      defs.appendChild(masker)
      const symbol = createNS<SVGSymbolElement>('symbol')

      symbol.setAttribute('id', symbolId)
      this.replaceInParent(mask, symbolId)
      if (mask.layerElement) {
        symbol.appendChild(mask.layerElement)
      }

      defs.appendChild(symbol)
      const useElem = createNS<SVGUseElement>('use')

      useElem.setAttribute('href', `#${symbolId}`)
      masker.appendChild(useElem)
      mask.data.hd = false
      mask.show()
    }
    elem.setMatte(mask.layerId || '')
  }
}
