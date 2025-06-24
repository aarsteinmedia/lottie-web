/* eslint-disable @typescript-eslint/naming-convention */
import type {
  Characacter, DocumentData, FontList, LottieLayer
} from '@/types'

import { RendererType } from '@/utils/enums'
import getFontProperties from '@/utils/getFontProperties'
import { isServer } from '@/utils/helpers/constants'
import createTag from '@/utils/helpers/htmlElements'
import createNS from '@/utils/helpers/svgElements'

const A_TAG_CODE_POINT = 917601,
  BLACK_FLAG_CODE_POINT = 127988,
  CANCEL_TAG_CODE_POINT = 917631,
  combinedCharacters: number[] = [
    // Hindi characters
    2304,
    2305,
    2306,
    2307,
    2362,
    2363,
    2364,
    2364,
    2366,
    2367,
    2368,
    2369,
    2370,
    2371,
    2372,
    2373,
    2374,
    2375,
    2376,
    2377,
    2378,
    2379,
    2380,
    2381,
    2382,
    2383,
    2387,
    2388,
    2389,
    2390,
    2391,
    2402,
    2403,
  ],
  emptyChar = {
    data: { shapes: [] } as unknown as LottieLayer,
    shapes: [],
    size: 0,
    w: 0,
  } as unknown as Characacter,
  maxWaitingTime = 5000,
  REGIONAL_CHARACTER_A_CODE_POINT = 127462,
  REGIONAL_CHARACTER_Z_CODE_POINT = 127487,
  surrogateModifiers = [
    'd83cdffb',
    'd83cdffc',
    'd83cdffd',
    'd83cdffe',
    'd83cdfff',
  ],
  VARIATION_SELECTOR_16_CODE_POINT = 65039,
  Z_TAG_CODE_POINT = 917626,
  ZERO_WIDTH_JOINER_CODE_POINT = 8205

export function isCombinedCharacter(char: number): boolean {
  return combinedCharacters.includes(char)
}

export function isFlagEmoji(string: string): boolean {
  return (
    isRegionalCode(string.slice(0, 2)) &&
    isRegionalCode(string.slice(2, 2))
  )
}

export function isModifier(firstCharCode: number,
  secondCharCode: number): boolean {
  const sum = firstCharCode.toString(16) + secondCharCode.toString(16)

  return surrogateModifiers.includes(sum)
}

export function isRegionalCode(string: string): boolean {
  const codePoint = getCodePoint(string)

  return (
    codePoint >= REGIONAL_CHARACTER_A_CODE_POINT &&
    codePoint <= REGIONAL_CHARACTER_Z_CODE_POINT
  )
}

export function isRegionalFlag(text: string, indexFromProps: number): boolean {
  let index = indexFromProps,
    codePoint = getCodePoint(text.slice(index, 2))

  if (codePoint !== BLACK_FLAG_CODE_POINT) {
    return false
  }
  let count = 0

  index += 2
  while (count < 5) {
    codePoint = getCodePoint(text.slice(index, 2))
    if (codePoint < A_TAG_CODE_POINT || codePoint > Z_TAG_CODE_POINT) {
      return false
    }
    count++
    index += 2
  }

  return getCodePoint(text.slice(index, 2)) === CANCEL_TAG_CODE_POINT
}

export function isVariationSelector(charCode: number): boolean {
  return charCode === VARIATION_SELECTOR_16_CODE_POINT
}

export function isZeroWidthJoiner(charCode: number): boolean {
  return charCode === ZERO_WIDTH_JOINER_CODE_POINT
}

function getCodePoint(string: string): number {
  let codePoint = 0
  const first = string.charCodeAt(0)

  if (first >= 0xd800 && first <= 0xdbff) {
    const second = string.charCodeAt(1)

    if (second >= 0xdc00 && second <= 0xdfff) {
      codePoint = (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000
    }
  }

  return codePoint
}

function setUpNode(font: string,
  family: string): {
    node: HTMLElement;
    parent: HTMLElement;
    w: number
  } | undefined {
  if (isServer) {
    return
  }
  const parentNode = createTag('span')

  parentNode.setAttribute('aria-hidden', 'true')
  parentNode.style.fontFamily = family
  const node = createTag('span')

  node.innerText = 'giItT1WQy@!-/#'
  parentNode.style.position = 'absolute'
  parentNode.style.left = '-10000px'
  parentNode.style.top = '-10000px'
  parentNode.style.fontSize = '300px'
  parentNode.style.fontVariant = 'normal'
  parentNode.style.fontStyle = 'normal'
  parentNode.style.fontWeight = 'normal'
  parentNode.style.letterSpacing = '0'
  parentNode.appendChild(node)
  document.body.appendChild(parentNode)

  const width = node.offsetWidth

  node.style.fontFamily = `${trimFontOptions(font)}, ${family}`

  return {
    node,
    parent: parentNode,
    w: width
  }
}

function trimFontOptions(font: string): string {
  const familyArray = font.split(','),
    { length } = familyArray,
    enabledFamilies = []

  for (let i = 0; i < length; i++) {
    if (familyArray[i] !== 'sans-serif' && familyArray[i] !== 'monospace') {
      enabledFamilies.push(familyArray[i])
    }
  }

  return enabledFamilies.join(',')
}

export default class FontManager {
  public chars: Characacter[] | null = null
  public fonts: DocumentData[] = []
  public isLoaded = false
  public typekitLoaded = 0
  private _warned = false
  private checkLoadedFontsBinded: () => void
  private initTime = Date.now()
  private setIsLoadedBinded: () => void

  constructor() {
    this.setIsLoadedBinded = this.setIsLoaded.bind(this)
    this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this)
  }

  public addChars(chars?: null | Characacter[]): void {
    if (!chars) {
      return
    }
    this.chars = this.chars ?? []
    const { length } = chars
    let j,
      { length: jLen } = this.chars,
      found: boolean

    for (let i = 0; i < length; i++) {
      j = 0
      found = false
      while (j < jLen) {
        if (
          this.chars[j]?.style === chars[i]?.style &&
          this.chars[j]?.fFamily === chars[i]?.fFamily &&
          this.chars[j]?.ch === chars[i]?.ch
        ) {
          found = true
        }
        j++
      }
      if (!found) {
        this.chars.push(chars[i] as Characacter)
        jLen++
      }
    }
  }

  public addFonts(fontData?: { list: DocumentData[] },
    defs?: HTMLElement | SVGDefsElement): void {
    if (!fontData) {
      this.isLoaded = true

      return
    }
    if (this.chars) {
      this.isLoaded = true
      this.fonts = fontData.list

      return
    }
    const { length } = fontData.list

    if (!isServer) {
      this.isLoaded = true

      for (let i = 0; i < length; i++) {
        ; (fontData.list[i] as DocumentData).helper = this.createHelper(fontData.list[i] as FontList)
        ; (fontData.list[i] as DocumentData).cache = {}
      }
      this.fonts = fontData.list

      return
    }

    let _pendingFonts = length

    for (let i = 0; i < _pendingFonts; i++) {
      let shouldLoadFont = true,
        loadedSelector

      fontData.list[i].loaded = false
      fontData.list[i].monoCase = setUpNode(fontData.list[i]?.fFamily ?? '',
        'monospace')
      fontData.list[i].sansCase = setUpNode(fontData.list[i]?.fFamily ?? '',
        'sans-serif')
      if (!fontData.list[i]?.fPath) {
        fontData.list[i].loaded = true
        _pendingFonts -= 1
      } else if (
        fontData.list[i]?.fOrigin === 'p' || fontData.list[i]?.origin === 3
      ) {
        loadedSelector = document.querySelectorAll(`style[f-forigin="p"][f-family="${fontData.list[i]?.fFamily}"], style[f-origin="3"][f-family="${fontData.list[i]?.fFamily}"]`)

        if (loadedSelector.length > 0) {
          shouldLoadFont = false
        }

        if (shouldLoadFont) {
          const s: HTMLStyleElement = createTag<HTMLStyleElement>('style')

          s.setAttribute('f-forigin', fontData.list[i]?.fOrigin ?? '')
          s.setAttribute('f-origin', `${fontData.list[i]?.origin}`)
          s.setAttribute('f-family', fontData.list[i]?.fFamily ?? '')
          s.innerText = `@font-face {font-family: ${fontData.list[i]?.fFamily}; font-style: normal; src: url('${fontData.list[i]?.fPath}');}`
          defs?.appendChild(s)
        }
      } else if (
        fontData.list[i]?.fOrigin === 'g' || fontData.list[i]?.origin === 1
      ) {
        loadedSelector = document.querySelectorAll<HTMLLinkElement>('link[f-forigin="g"], link[f-origin="1"]')

        const { length: len } = loadedSelector

        for (i = 0; i < len; i++) {
          if (loadedSelector[i]?.href.includes(fontData.list[i]?.fPath ?? '')) {
            shouldLoadFont = false
          }
        }

        if (shouldLoadFont) {
          const link = createTag<HTMLLinkElement>('link')

          link.setAttribute('f-forigin', fontData.list[i]?.fOrigin ?? '')
          link.setAttribute('f-origin', `${fontData.list[i]?.origin}`)
          link.type = 'text/css'
          link.rel = 'stylesheet'
          link.href = fontData.list[i]?.fPath ?? ''
          document.body.appendChild(link)
        }
      } else if (
        fontData.list[i]?.fOrigin === 't' || fontData.list[i]?.origin === 2
      ) {
        loadedSelector = document.querySelectorAll<HTMLScriptElement>('script[f-forigin="t"], script[f-origin="2"]')

        const { length: len } = loadedSelector

        for (i = 0; i < len; i++) {
          if (fontData.list[i]?.fPath === loadedSelector[i]?.src) {
            shouldLoadFont = false
          }
        }

        if (shouldLoadFont) {
          const sc = createTag<HTMLLinkElement>('link')

          sc.setAttribute('f-forigin', fontData.list[i]?.fOrigin ?? '')
          sc.setAttribute('f-origin', `${fontData.list[i]?.origin}`)
          sc.rel = 'stylesheet'
          sc.href = fontData.list[i]?.fPath ?? ''
          defs?.appendChild(sc)
        }
      }
      fontData.list[i].helper = this.createHelper(fontData.list[i] as FontList, defs)
      fontData.list[i].cache = {}
      this.fonts.push(fontData.list[i] as DocumentData)
    }
    if (_pendingFonts === 0) {
      this.isLoaded = true
    } else {
      setTimeout(this.checkLoadedFonts.bind(this), 100)
    }
  }

  public getCharData(
    char: Characacter | string,
    style?: string,
    font?: string
  ): Characacter {
    let i = 0
    const { length } = this.chars ?? []

    while (i < length) {
      if (
        this.chars?.[i]?.ch === char &&
        this.chars[i]?.style === style &&
        this.chars[i]?.fFamily === font
      ) {
        return this.chars[i] as Characacter
      }
      i++
    }
    if (
      (typeof char === 'string' && char.charCodeAt(0) !== 13 || !char) &&
      !this._warned
    ) {
      this._warned = true
      console.warn(
        'Missing character from exported characters list: ',
        char,
        style,
        font
      )
    }

    return emptyChar
  }

  public getFontByName(name?: string): DocumentData {
    let i = 0
    const { length } = this.fonts

    while (i < length) {
      if (this.fonts[i]?.fName === name) {
        return this.fonts[i] as DocumentData
      }
      i++
    }

    return this.fonts[0] as DocumentData
  }

  public measureText(
    char: string, fontName?: string, size?: number
  ): number {
    const fontData = this.getFontByName(fontName),
      index = char

    if (fontData.cache && !fontData.cache[index]) {
      const tHelper = fontData.helper

      if (char === ' ') {
        const doubleSize = Number(tHelper?.measureText(`|${char}|`)),
          singleSize = Number(tHelper?.measureText('||'))

        fontData.cache[index] = (doubleSize - singleSize) / 100
      } else {
        fontData.cache[index] = Number(tHelper?.measureText(char)) / 100
      }
    }

    return Number(fontData.cache?.[index]) * Number(size)
  }

  private checkLoadedFonts(): void {
    let node: HTMLElement | undefined
    let w: number
    let loadedCount = this.fonts.length

    for (let i = 0; i < loadedCount; i++) {
      if (this.fonts[i]?.loaded) {
        loadedCount -= 1
        continue
      }

      if (this.fonts[i]?.fOrigin === 'n' || this.fonts[i]?.origin === 0) {
        this.fonts[i].loaded = true
        continue
      }
      node = this.fonts[i]?.monoCase?.node
      w = this.fonts[i]?.monoCase?.w || 0
      if (node?.offsetWidth === w) {
        node = this.fonts[i]?.sansCase?.node
        w = this.fonts[i]?.sansCase?.w || 0
        if (node?.offsetWidth !== w) {
          loadedCount -= 1
          this.fonts[i].loaded = true
        }
      } else {
        loadedCount -= 1
        this.fonts[i].loaded = true
      }
      if (!this.fonts[i]?.loaded) {
        continue
      }

      const { monoCase, sansCase } = this.fonts[i] ?? {}

      if (sansCase) {
        this.fonts[i]?.sansCase?.parent.parentNode?.removeChild(sansCase.parent)
      }
      if (monoCase) {
        this.fonts[i]?.monoCase?.parent.parentNode?.removeChild(monoCase.parent)
      }

    }

    if (loadedCount !== 0 && Date.now() - this.initTime < maxWaitingTime) {
      setTimeout(this.checkLoadedFontsBinded, 20)

      return
    }

    setTimeout(this.setIsLoadedBinded, 10)
  }

  private createHelper(fontData: FontList,
    def?: HTMLElement | SVGDefsElement): { measureText: (text: string) => number } | undefined {
    if (isServer) {
      return
    }
    const engine = def ? RendererType.SVG : RendererType.Canvas
    let helper: SVGTextElement | OffscreenCanvasRenderingContext2D
    const fontProps = getFontProperties(fontData)

    if (engine === RendererType.SVG) {
      const tHelper = createNS<SVGTextElement>('text')

      tHelper.style.fontSize = '100px'
      tHelper.setAttribute('font-family', fontData.fFamily)
      tHelper.setAttribute('font-style', fontProps.style)
      tHelper.setAttribute('font-weight', fontProps.weight)
      tHelper.textContent = '1'
      if (fontData.fClass) {
        tHelper.style.fontFamily = 'inherit'
        tHelper.classList.add(fontData.fClass)
      } else {
        tHelper.style.fontFamily = fontData.fFamily
      }
      def?.appendChild(tHelper)
      helper = tHelper
    } else {
      const tCanvasHelper = new OffscreenCanvas(500, 500).getContext('2d')

      if (tCanvasHelper) {
        tCanvasHelper.font = `${fontProps.style} ${fontProps.weight} 100px ${fontData.fFamily}`
        helper = tCanvasHelper
      }
    }

    return {
      measureText: (text: string) => {
        if (engine === RendererType.SVG) {
          ; (helper as SVGTextElement).textContent = text

          return (helper as SVGTextElement).getComputedTextLength()
        }

        return (helper as OffscreenCanvasRenderingContext2D).measureText(text).width
      },
    }
  }

  private setIsLoaded(): void {
    this.isLoaded = true
  }
}
