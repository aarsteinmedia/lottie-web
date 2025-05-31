import type {
  DocumentData,
  Letter,
  TextData,
  Vector2,
  ElementInterfaceIntersect,
  TextEffectFunction,
} from '@/types'
import type LetterProps from '@/utils/text/LetterProps'

import {
  getFontProperties,
  isCombinedCharacter,
  isFlagEmoji,
  isModifier,
  isRegionalFlag,
  isVariationSelector,
  isZeroWidthJoiner,
} from '@/utils/FontManager'
import { initialDefaultFrame } from '@/utils/getterSetter'
import { BaseProperty } from '@/utils/Properties'

import type DynamicPropertyContainer from '../helpers/DynamicPropertyContainer'

export default class TextProperty extends BaseProperty {
  _frameId: number
  canResize: boolean
  currentData: DocumentData
  override data: TextData
  defaultBoxWidth: Vector2 = [0, 0]
  override effectsSequence: TextEffectFunction[]
  override elem: ElementInterfaceIntersect
  keysIndex: number
  minimumFontSize: number
  override pv: DocumentData | string
  override v: DocumentData | string

  constructor(elem: ElementInterfaceIntersect, data: TextData) {
    super()
    this._frameId = initialDefaultFrame
    this.pv = ''
    this.v = ''
    this.kf = false
    this._isFirstFrame = true
    this._mdf = false
    if (data.d?.sid) {
      data.d = elem.globalData.slotManager?.getProp(data.d)
    }
    this.data = data
    this.elem = elem
    this.comp = this.elem.comp
    this.keysIndex = 0
    this.canResize = false
    this.minimumFontSize = 1
    this.effectsSequence = []
    this.currentData = {
      __complete: false,
      ascent: 0,
      boxWidth: this.defaultBoxWidth,
      f: '',
      fc: '',
      fillColorAnim: false,
      finalLineHeight: 0,
      finalSize: 0,
      finalText: [],
      fStyle: '',
      fWeight: '',
      justifyOffset: 0,
      l: [],
      lh: 0,
      lineWidths: [],
      ls: 0,
      of: '',
      ps: null,
      s: 0,
      sc: '',
      strokeColorAnim: false,
      strokeWidthAnim: false,
      sw: 0,
      t: 0,
      tr: 0,
      yOffset: 0,
    } as unknown as DocumentData

    const newData = this.data.d?.k[0].s

    if (newData) {
      this.copyData(this.currentData, newData)
    }


    if (!this.searchProperty()) {
      this.completeTextData(this.currentData)
    }
  }

  override addEffect(effectFunction: TextEffectFunction) {
    this.effectsSequence.push(effectFunction)
    this.elem.addDynamicProperty(this)
  }

  buildFinalText(text: string) {
    const charactersArray = []
    let i = 0
    const len = text.length
    let charCode,
      secondCharCode,
      shouldCombine,
      shouldCombineNext = false,
      currentChars

    while (i < len) {
      shouldCombine = shouldCombineNext
      shouldCombineNext = false
      charCode = text.charCodeAt(i)
      currentChars = text.charAt(i)
      if (isCombinedCharacter(charCode)) {
        shouldCombine = true
        // It's a potential surrogate pair (this is the High surrogate)
      } else if (charCode >= 0xd800 && charCode <= 0xdbff) {
        if (isRegionalFlag(text, i)) {
          currentChars = text.slice(i, 14)
        } else {
          secondCharCode = text.charCodeAt(i + 1)
          // It's a surrogate pair (this is the Low surrogate)
          if (secondCharCode >= 0xdc00 && secondCharCode <= 0xdfff) {

            if (isModifier(charCode, secondCharCode)) {
              currentChars = text.slice(i, 2)
              shouldCombine = true
            } else if (isFlagEmoji(text.slice(i, 4))) {
              currentChars = text.slice(i, 4)
            } else {
              currentChars = text.slice(i, 2)
            }
          }
        }
      } else if (charCode > 0xdbff) {
        // secondCharCode = text.charCodeAt(i + 1)
        if (isVariationSelector(charCode)) {
          shouldCombine = true
        }
      } else if (isZeroWidthJoiner(charCode)) {
        shouldCombine = true
        shouldCombineNext = true
      }
      if (shouldCombine) {
        charactersArray[charactersArray.length - 1] += currentChars
        // shouldCombine = false
      } else {
        charactersArray.push(currentChars)
      }
      i += currentChars.length
    }

    return charactersArray
  }

  calculateExpression(_text: string): number {
    throw new Error(`${this.constructor.name}: Method calculateExpression is not implemented`)
  }

  canResizeFont(_canResize: boolean) {
    this.canResize = _canResize
    this.recalculate(this.keysIndex)
    this.elem.addDynamicProperty(this as unknown as DynamicPropertyContainer)
  }

  completeTextData(documentData: DocumentData) {
    documentData.__complete = true
    const { fontManager } = this.elem.globalData

    if (!fontManager) {
      throw new Error(`${this.constructor.name}: FontManager not loaded to globalData`)
    }
    const {
      canResize, data, minimumFontSize
    } = this
    const letters: Letter[] = []
    let len: number,
      newLineFlag,
      index = 0,
      val
    const anchorGrouping = data.m?.g
    let currentSize = 0,
      currentPos = 0,
      currentLine = 0
    const lineWidths = []
    let lineWidth,
      maxLineWidth = 0
    const fontData = fontManager.getFontByName(documentData.f)
    let charData,
      cLength

    const fontProps = getFontProperties(fontData)

    documentData.fWeight = fontProps.weight
    documentData.fStyle = fontProps.style
    documentData.finalSize = documentData.s
    documentData.finalText = this.buildFinalText(`${documentData.t}`)
    len = documentData.finalText.length || 0
    documentData.finalLineHeight = documentData.lh
    let trackingOffset = documentData.tr / 1000 * documentData.finalSize
    let charCode

    if (documentData.sz) {
      let shouldComplete = true
      const [boxWidth, boxHeight] = documentData.sz
      let currentHeight
      let finalText

      while (shouldComplete) {
        finalText = this.buildFinalText(`${documentData.t}`)
        currentHeight = 0
        lineWidth = 0
        len = finalText.length
        trackingOffset = documentData.tr / 1000 * documentData.finalSize
        let lastSpaceIndex = -1

        for (let i = 0; i < len; i++) {
          charCode = finalText[i].charCodeAt(0)
          newLineFlag = false
          if (finalText[i] === ' ') {
            lastSpaceIndex = i
          } else if (charCode === 13 || charCode === 3) {
            lineWidth = 0
            newLineFlag = true
            currentHeight +=
              documentData.finalLineHeight || documentData.finalSize * 1.2
          }
          if (fontManager.chars) {
            charData = fontManager.getCharData(
              finalText[i],
              fontData.fStyle,
              fontData.fFamily
            )
            cLength = newLineFlag
              ? 0
              : charData.w * documentData.finalSize / 100
          } else {
            cLength =
              fontManager.measureText(
                finalText[i],
                documentData.f,
                documentData.finalSize
              ) || 0
          }
          if (lineWidth + cLength > boxWidth && finalText[i] !== ' ') {
            if (lastSpaceIndex === -1) {
              len++
            } else {
              i = lastSpaceIndex
            }
            currentHeight +=
              documentData.finalLineHeight || documentData.finalSize * 1.2
            finalText.splice(
              i, lastSpaceIndex === i ? 1 : 0, '\r'
            )
            lastSpaceIndex = -1
            lineWidth = 0
          } else {
            lineWidth += cLength
            lineWidth += trackingOffset
          }
        }
        currentHeight +=
          Number(fontData.ascent) * documentData.finalSize / 100
        if (
          canResize &&
          documentData.finalSize > minimumFontSize &&
          boxHeight < currentHeight
        ) {
          documentData.finalSize -= 1
          documentData.finalLineHeight =
            documentData.finalSize * documentData.lh / documentData.s
        } else {
          documentData.finalText = finalText
          len = documentData.finalText.length
          shouldComplete = false
        }
      }
    }
    lineWidth = -trackingOffset
    let uncollapsedSpaces = 0,
      currentChar

    for (let i = 0; i < len; i++) {
      newLineFlag = false
      currentChar = documentData.finalText[i]
      charCode = currentChar.charCodeAt(0)
      if (charCode === 13 || charCode === 3) {
        uncollapsedSpaces = 0
        lineWidths.push(lineWidth)
        maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth
        lineWidth = -2 * trackingOffset
        val = ''
        newLineFlag = true
        currentLine++
      } else {
        val = currentChar
      }
      if (fontManager.chars) {
        charData = fontManager.getCharData(
          currentChar,
          fontData.fStyle,
          fontManager.getFontByName(documentData.f).fFamily
        )
        cLength = newLineFlag ? 0 : charData.w * documentData.finalSize / 100
      } else {
        cLength = fontManager.measureText(
          val,
          documentData.f,
          documentData.finalSize
        )
      }

      //
      if (currentChar === ' ') {
        uncollapsedSpaces += cLength + trackingOffset
      } else {
        lineWidth += cLength + trackingOffset + uncollapsedSpaces
        uncollapsedSpaces = 0
      }
      letters.push({
        add: currentSize,
        an: cLength,
        animatorJustifyOffset: 0,
        anIndexes: [],
        l: cLength,
        line: currentLine,
        n: newLineFlag,
        val,
      } as unknown as Letter)
      if (anchorGrouping === 2) {
        currentSize += cLength
        if (val === '' || val === ' ' || i === len - 1) {
          if (val === '' || val === ' ') {
            currentSize -= cLength
          }
          while (currentPos <= i) {
            letters[currentPos].an = currentSize
            letters[currentPos].ind = index
            letters[currentPos].extra = cLength
            currentPos++
          }
          index++
          currentSize = 0
        }
      } else if (anchorGrouping === 3) {
        currentSize += cLength
        if (val === '' || i === len - 1) {
          if (val === '') {
            currentSize -= cLength
          }
          while (currentPos <= i) {
            letters[currentPos].an = currentSize
            letters[currentPos].ind = index
            letters[currentPos].extra = cLength
            currentPos++
          }
          currentSize = 0
          index++
        }
      } else {
        letters[index].ind = index
        letters[index].extra = 0
        index++
      }
    }
    documentData.l = letters
    maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth
    lineWidths.push(lineWidth)
    if (documentData.sz) {
      documentData.boxWidth = documentData.sz[0]
      documentData.justifyOffset = 0
    } else {
      documentData.boxWidth = maxLineWidth
      switch (documentData.j) {
        case 1: {
          documentData.justifyOffset = -documentData.boxWidth
          break
        }
        case 2: {
          documentData.justifyOffset = -documentData.boxWidth / 2
          break
        }
        case undefined:
        default: {
          documentData.justifyOffset = 0
        }
      }
    }
    documentData.lineWidths = lineWidths

    const animators = data.a
    let animatorData, letterData
    const { length: jLen } = animators ?? []
    let based, ind
    const indexes = []

    for (let j = 0; j < jLen; j++) {
      animatorData = animators?.[j]
      if (!animatorData) {
        continue
      }
      if (animatorData.a?.sc) {
        documentData.strokeColorAnim = true
      }
      if (animatorData.a?.sw) {
        documentData.strokeWidthAnim = true
      }
      if (
        animatorData.a?.fc ||
        animatorData.a?.fh ||
        animatorData.a?.fs ||
        animatorData.a?.fb
      ) {
        documentData.fillColorAnim = true
      }
      ind = 0
      based = Number(animatorData.s?.b)
      for (let i = 0; i < len; i++) {
        letterData = letters[i]
        letterData.anIndexes[j] = ind
        if (
          based === 1 && letterData.val !== '' ||
          based === 2 && letterData.val !== '' && letterData.val !== ' ' ||
          based === 3 &&
          (letterData.n || letterData.val === ' ' || i === len - 1) ||
          based === 4 && (letterData.n || i === len - 1)
        ) {
          if (Number(animatorData.s?.rn) === 1) {
            indexes.push(ind)
          }
          ind++
        }
      }
      const textSelectorProperty = data.a?.[j].s

      if (textSelectorProperty) {
        textSelectorProperty.totalChars = ind
      }
      let currentInd = -1,
        newInd

      if (animatorData.s?.rn === 1) {
        for (let i = 0; i < len; i++) {
          letterData = letters[i]
          if (currentInd !== Number(letterData.anIndexes[j])) {
            currentInd = letterData.anIndexes[j]
            newInd = indexes.splice(Math.floor(Math.random() * indexes.length),
              1)[0]
          }
          if (newInd) {
            letterData.anIndexes[j] = newInd
          }
        }
      }
    }
    documentData.yOffset =
      documentData.finalLineHeight || documentData.finalSize * 1.2
    documentData.ls = documentData.ls || 0
    documentData.ascent =
      Number(fontData.ascent) * documentData.finalSize / 100
  }

  copyData(obj: DocumentData, data: DocumentData | LetterProps) {
    const keys = Object.keys(data),
      { length } = keys

    for (let i = 0; i < length; i++) {
      if (Object.hasOwn(data, keys[i])) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (obj as any)[keys[i]] = data[keys[i] as keyof typeof data]
      }
    }

    return obj
  }

  getExpressionValue(_currentValue: DocumentData, _text: string) {
    throw new Error(`${this.constructor.name}: Method getExpressionValue is not implemented`)
  }

  getKeyframeValue() {
    // if (!this.data) {
    //   throw new Error(`${this.constructor.name}: data (Shape) is not implemented`)
    // }

    const textKeys = this.data.d?.k ?? [],
      frameNum = Number(this.elem.comp?.renderedFrame)
    let i = 0
    const len = textKeys.length

    while (i <= len - 1) {
      if (i === len - 1 || Number(textKeys[i + 1].t) > frameNum) {
        break
      }
      i++
    }
    if (this.keysIndex !== i) {
      this.keysIndex = i
    }

    return this.data.d?.k[this.keysIndex].s
  }

  override getValue(_finalValue?: unknown) {
    // if (!this.data) {
    //   throw new Error(`${this.constructor.name}: data (TextData) is not implemented`)
    // }

    if (
      (this.elem.globalData.frameId === this.frameId ||
        this.effectsSequence.length === 0) &&
        !_finalValue
    ) {
      return
    }
    const tValue = this.data.d?.k[this.keysIndex].s.t

    if (tValue) {
      this.currentData.t = tValue
    }
    const currentValue = this.currentData,
      currentIndex = this.keysIndex

    if (this.lock) {
      this.setCurrentData(this.currentData)

      return
    }
    this.lock = true
    this._mdf = false
    const { length } = this.effectsSequence
    let finalValue =
      (_finalValue as DocumentData | undefined) ?? this.data.d?.k[this.keysIndex].s

    for (let i = 0; i < length; i++) {
      // Checking if index changed to prevent creating a new object every time the expression updates.
      if (currentIndex === this.keysIndex) {
        finalValue = this.effectsSequence[i](this.currentData,
          finalValue?.t as string)
      } else {
        finalValue = this.effectsSequence[i](finalValue as DocumentData,
          finalValue?.t as string)
      }
    }
    if (currentValue !== finalValue) {
      this.setCurrentData(finalValue as DocumentData)
    }
    this.v = this.currentData
    this.pv = this.v
    this.lock = false
    this.frameId = this.elem.globalData.frameId
  }

  recalculate(index: number) {
    if (!this.data.d) {
      throw new Error(`${this.constructor.name}: data.k (TextData -> DocumentData) is not implemented`)
    }

    const dData = this.data.d.k[index].s

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (dData) {
      dData.__complete = false
    }

    this.keysIndex = 0
    this._isFirstFrame = true
    this.getValue(dData)
  }

  searchExpressions(): boolean | null {
    throw new Error(`${this.constructor.name}: Method searchExpressions is not implemented`)
  }

  searchKeyframes() {
    if (!this.data.d) {
      throw new Error(`${this.constructor.name}: data.k (TextData -> DocumentData) is not implemented`)
    }

    this.kf = this.data.d.k.length > 1
    if (this.kf) {
      this.addEffect(this.getKeyframeValue.bind(this) as TextEffectFunction)
    }

    return this.kf
  }

  searchProperty() {
    return this.searchKeyframes()
  }

  setCurrentData(data: DocumentData) {
    if (!data.__complete) {
      this.completeTextData(data)
    }
    this.currentData = data
    this.currentData.boxWidth =
      this.currentData.boxWidth || this.defaultBoxWidth
    this._mdf = true
  }

  setMinimumFontSize(_fontValue: number) {
    this.minimumFontSize = Math.floor(_fontValue) || 1
    this.recalculate(this.keysIndex)
    this.elem.addDynamicProperty(this)
  }

  updateDocumentData(newData: DocumentData, indexFromProps?: number) {
    if (!this.data.d) {
      throw new Error(`${this.constructor.name}: data.k (TextData -> DocumentData) is not implemented`)
    }
    let index = indexFromProps

    index = index ?? this.keysIndex
    let dData = this.copyData({} as DocumentData, this.data.d.k[index].s)

    dData = this.copyData(dData, newData)

    this.data.d.k[index].s = dData
    this.recalculate(index)
    this.setCurrentData(dData)
    this.elem.addDynamicProperty(this)
  }
}
