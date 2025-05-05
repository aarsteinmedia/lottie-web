import type { GroupEffect } from '@/effects/EffectsManager'
import type { ElementInterfaceIntersect } from '@/types'

import { createNS } from '@/utils'

export default class SVGProLevelsFilter {
  feFuncA?: SVGFEFuncAElement
  feFuncB?: SVGFEFuncBElement
  feFuncBComposed?: SVGFEFuncBElement
  feFuncG?: SVGFEFuncGElement
  feFuncGComposed?: SVGFEFuncGElement
  feFuncR?: SVGFEFuncRElement
  feFuncRComposed?: SVGFEFuncRElement
  filterManager: GroupEffect
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string
  ) {
    this.filterManager = filterManager
    const { effectElements } = this.filterManager

    // if (!effectElements) {
    //   throw new Error(`${this.constructor.name}: Missing Effect Elements`)
    // }

    let feComponentTransfer = createNS<SVGFEComponentTransferElement>('feComponentTransfer')

    // Red
    if (
      effectElements[10].p.k ||
      effectElements[10].p.v !== 0 ||
      effectElements[11].p.k ||
      effectElements[11].p.v !== 1 ||
      effectElements[12].p.k ||
      effectElements[12].p.v !== 1 ||
      effectElements[13].p.k ||
      effectElements[13].p.v !== 0 ||
      effectElements[14].p.k ||
      effectElements[14].p.v !== 1
    ) {
      this.feFuncR = this.createFeFunc('feFuncR', feComponentTransfer)
    }
    // Green
    if (
      effectElements[17].p.k ||
      effectElements[17].p.v !== 0 ||
      effectElements[18].p.k ||
      effectElements[18].p.v !== 1 ||
      effectElements[19].p.k ||
      effectElements[19].p.v !== 1 ||
      effectElements[20].p.k ||
      effectElements[20].p.v !== 0 ||
      effectElements[21].p.k ||
      effectElements[21].p.v !== 1
    ) {
      this.feFuncG = this.createFeFunc('feFuncG', feComponentTransfer)
    }
    // Blue
    if (
      effectElements[24].p.k ||
      effectElements[24].p.v !== 0 ||
      effectElements[25].p.k ||
      effectElements[25].p.v !== 1 ||
      effectElements[26].p.k ||
      effectElements[26].p.v !== 1 ||
      effectElements[27].p.k ||
      effectElements[27].p.v !== 0 ||
      effectElements[28].p.k ||
      effectElements[28].p.v !== 1
    ) {
      this.feFuncB = this.createFeFunc('feFuncB', feComponentTransfer)
    }
    // Alpha
    if (
      effectElements[31].p.k ||
      effectElements[31].p.v !== 0 ||
      effectElements[32].p.k ||
      effectElements[32].p.v !== 1 ||
      effectElements[33].p.k ||
      effectElements[33].p.v !== 1 ||
      effectElements[34].p.k ||
      effectElements[34].p.v !== 0 ||
      effectElements[35].p.k ||
      effectElements[35].p.v !== 1
    ) {
      this.feFuncA = this.createFeFunc('feFuncA', feComponentTransfer)
    }
    // RGB
    if (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) {
      feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB')
      filter.appendChild(feComponentTransfer)
    }

    if (
      effectElements[3].p.k ||
      effectElements[3].p.v !== 0 ||
      effectElements[4].p.k ||
      effectElements[4].p.v !== 1 ||
      effectElements[5].p.k ||
      effectElements[5].p.v !== 1 ||
      effectElements[6].p.k ||
      effectElements[6].p.v !== 0 ||
      effectElements[7].p.k ||
      effectElements[7].p.v !== 1
    ) {
      feComponentTransfer = createNS<SVGFEComponentTransferElement>('feComponentTransfer')
      feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB')
      feComponentTransfer.setAttribute('result', id)
      filter.appendChild(feComponentTransfer)
      this.feFuncRComposed = this.createFeFunc('feFuncR', feComponentTransfer)
      this.feFuncGComposed = this.createFeFunc('feFuncG', feComponentTransfer)
      this.feFuncBComposed = this.createFeFunc('feFuncB', feComponentTransfer)
    }
  }

  createFeFunc<T extends SVGElement>(type: string,
    feComponentTransfer: SVGFEComponentTransferElement) {
    const feFunc = createNS<T>(type)

    feFunc.setAttribute('type', 'table')
    feComponentTransfer.appendChild(feFunc)

    return feFunc
  }

  getTableValue(
    inputBlack: number,
    inputWhite: number,
    gamma: number,
    outputBlack: number,
    outputWhite: number
  ) {
    let cnt = 0
    const segments = 256
    let perc
    const min = Math.min(inputBlack, inputWhite),
      max = Math.max(inputBlack, inputWhite),
      table = Array.call(null, { length: segments })
    let colorValue,
      pos = 0
    const outputDelta = outputWhite - outputBlack,
      inputDelta = inputWhite - inputBlack

    while (cnt <= 256) {
      perc = cnt / 256
      if (perc <= min) {
        colorValue = inputDelta < 0 ? outputWhite : outputBlack
      } else if (perc >= max) {
        colorValue = inputDelta < 0 ? outputBlack : outputWhite
      } else {
        colorValue =
          outputBlack +
          outputDelta * Math.pow((perc - inputBlack) / inputDelta, 1 / gamma)
      }
      table[pos] = colorValue
      pos++
      cnt += 256 / (segments - 1)
    }

    return table.join(' ')
  }

  renderFrame(forceRender?: boolean) {
    if (
      !forceRender && !this.filterManager._mdf ||
      !this.filterManager.effectElements
    ) {
      return
    }
    let val
    const { effectElements } = this.filterManager

    if (
      this.feFuncRComposed &&
      (forceRender ||
        effectElements[3].p._mdf ||
        effectElements[4].p._mdf ||
        effectElements[5].p._mdf ||
        effectElements[6].p._mdf ||
        effectElements[7].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[3].p.v as number,
        effectElements[4].p.v as number,
        effectElements[5].p.v as number,
        effectElements[6].p.v as number,
        effectElements[7].p.v as number
      )
      this.feFuncRComposed.setAttribute('tableValues', val)
      this.feFuncGComposed?.setAttribute('tableValues', val)
      this.feFuncBComposed?.setAttribute('tableValues', val)
    }

    if (
      this.feFuncR &&
      (forceRender ||
        effectElements[10].p._mdf ||
        effectElements[11].p._mdf ||
        effectElements[12].p._mdf ||
        effectElements[13].p._mdf ||
        effectElements[14].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[10].p.v as number,
        effectElements[11].p.v as number,
        effectElements[12].p.v as number,
        effectElements[13].p.v as number,
        effectElements[14].p.v as number
      )
      this.feFuncR.setAttribute('tableValues', val)
    }

    if (
      this.feFuncG &&
      (forceRender ||
        effectElements[17].p._mdf ||
        effectElements[18].p._mdf ||
        effectElements[19].p._mdf ||
        effectElements[20].p._mdf ||
        effectElements[21].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[17].p.v as number,
        effectElements[18].p.v as number,
        effectElements[19].p.v as number,
        effectElements[20].p.v as number,
        effectElements[21].p.v as number
      )
      this.feFuncG.setAttribute('tableValues', val)
    }

    if (
      this.feFuncB &&
      (forceRender ||
        effectElements[24].p._mdf ||
        effectElements[25].p._mdf ||
        effectElements[26].p._mdf ||
        effectElements[27].p._mdf ||
        effectElements[28].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[24].p.v as number,
        effectElements[25].p.v as number,
        effectElements[26].p.v as number,
        effectElements[27].p.v as number,
        effectElements[28].p.v as number
      )
      this.feFuncB.setAttribute('tableValues', val)
    }

    if (
      this.feFuncA &&
      (forceRender ||
        effectElements[31].p._mdf ||
        effectElements[32].p._mdf ||
        effectElements[33].p._mdf ||
        effectElements[34].p._mdf ||
        effectElements[35].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[31].p.v as number,
        effectElements[32].p.v as number,
        effectElements[33].p.v as number,
        effectElements[34].p.v as number,
        effectElements[35].p.v as number
      )
      this.feFuncA.setAttribute('tableValues', val)
    }
  }
}
