/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DocumentData,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Vector3,
} from '@/types'

import TextElement from '@/elements/TextElement'
import {
  createNS, createTag, styleDiv
} from '@/utils'
import {
  lineCapEnum, lineJoinEnum, RendererType
} from '@/utils/enums'
import { createSizedArray } from '@/utils/helpers/arrays'

export default class HTextElement extends TextElement {
  compH?: number
  compW?: number
  // extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, TextElement], HTextElement);

  currentBBox?: {
    w: number
    h: number
    x: number
    y: number
  }
  isMasked?: boolean
  maskedElement?: SVGGElement | HTMLElement
  renderedLetters: string[] = []
  svgElement?: SVGSVGElement

  textPaths: SVGPathElement[]

  textSpans: HTMLElement[]

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.textSpans = []
    this.textPaths = []
    this.currentBBox = {
      h: 0,
      w: 0,
      x: 999999,
      y: -999999,
    }
    this.renderType = RendererType.SVG
    this.isMasked = false
    this.initElement(
      data, globalData, comp
    )
  }

  override buildNewText() {
    const documentData = this.textProperty?.currentData

    this.renderedLetters = createSizedArray(documentData?.l.length || 0)
    const innerElemStyle = this.innerElem?.style,
      textColor = documentData?.fc
        ? this.buildColor(documentData.fc as Vector3)
        : 'rgba(0,0,0,0)'

    if (innerElemStyle) {
      innerElemStyle.fill = textColor
      innerElemStyle.color = textColor

      if (documentData?.sc) {
        innerElemStyle.stroke = this.buildColor(documentData.sc)
        innerElemStyle.strokeWidth = `${documentData.sw}px`
      }
    }

    const fontData = this.globalData?.fontManager?.getFontByName(documentData?.f)

    if (innerElemStyle && !this.globalData?.fontManager?.chars) {
      innerElemStyle.fontSize = `${documentData?.finalSize || 0}px`
      innerElemStyle.lineHeight = `${documentData?.finalSize || 0}px`
      if (this.innerElem && fontData?.fClass) {
        ;(this.innerElem as HTMLElement).className = fontData.fClass
      } else {
        if (fontData) {
          innerElemStyle.fontFamily = fontData.fFamily
        }

        if (documentData) {
          const { fWeight } = documentData
          const { fStyle } = documentData

          innerElemStyle.fontStyle = fStyle
          innerElemStyle.fontWeight = fWeight
        }
      }
    }

    const letters = documentData?.l ?? []
    let tSpan: SVGElement | HTMLElement,
      tParent: null | HTMLElement = null,
      tCont: null | HTMLElement | SVGSVGElement = null
    const matrixHelper = this.mHelper
    let shapes,
      shapeStr,
      cnt = 0
    const { length } = letters

    for (let i = 0; i < length; i++) {
      if (this.globalData?.fontManager?.chars) {
        if (this.textPaths[cnt]) {
          tSpan = this.textPaths[cnt]
        } else {
          tSpan = createNS('path')
          tSpan.setAttribute('stroke-linecap', lineCapEnum[1])
          tSpan.setAttribute('stroke-linejoin', lineJoinEnum[2])
          tSpan.setAttribute('stroke-miterlimit', '4')
        }
        if (!this.isMasked) {
          if (this.textSpans[cnt]) {
            tParent = this.textSpans[cnt]
            tCont = tParent.children[0] as HTMLElement
          } else {
            tParent = createTag('div')
            tParent.style.lineHeight = '0'
            tCont = createNS<SVGSVGElement>('svg')
            tCont.appendChild(tSpan)
            styleDiv(tParent)
          }
        }
      } else if (this.isMasked) {
        tSpan = this.textPaths[cnt] ?? createNS<SVGTextElement>('text')
      } else if (this.textSpans[cnt]) {
        tParent = this.textSpans[cnt]
        tSpan = this.textPaths[cnt]
      } else {
        tParent = createTag('span')
        styleDiv(tParent)
        tSpan = createTag('span')
        styleDiv(tSpan)
        tParent.appendChild(tSpan)
      }
      // tSpan.setAttribute('visibility', 'hidden');
      if (this.globalData?.fontManager?.chars) {
        const charData = this.globalData.fontManager.getCharData(
          documentData?.finalText[i] as string,
          fontData?.fStyle,
          this.globalData.fontManager.getFontByName(documentData?.f).fFamily
        )
        let shapeData

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (charData) {
          shapeData = charData.data
        } else {
          shapeData = null
        }
        matrixHelper.reset()
        if (shapeData?.shapes && shapeData.shapes.length > 0) {
          shapes = shapeData.shapes[0].it ?? []
          matrixHelper.scale((documentData?.finalSize || 0) / 100,
            (documentData?.finalSize || 0) / 100)
          shapeStr = this.createPathShape(matrixHelper, shapes)
          tSpan.setAttribute('d', shapeStr)
        }
        if (this.isMasked) {
          this.innerElem?.appendChild(tSpan)
        } else if (tParent && tCont) {
          this.innerElem?.appendChild(tParent)
          if (shapeData?.shapes) {
            // document.body.appendChild is needed to get exact measure of shape
            document.body.appendChild(tCont)
            const boundingBox = (tCont as SVGSVGElement).getBBox()

            tCont.setAttribute('width', `${boundingBox.width + 2}`)
            tCont.setAttribute('height', `${boundingBox.height + 2}`)
            tCont.setAttribute('viewBox',
              `${boundingBox.x - 1} ${boundingBox.y - 1} ${
                boundingBox.width + 2
              } ${boundingBox.height + 2}`)
            const tContStyle = tCont.style
            const tContTranslation = `translate(${boundingBox.x - 1}px,${
              boundingBox.y - 1
            }px)`

            tContStyle.transform = tContTranslation

            letters[i].yOffset = boundingBox.y - 1
          } else {
            tCont.setAttribute('width', '1')
            tCont.setAttribute('height', '1')
          }
          tParent.appendChild(tCont)
        }
      } else {
        tSpan.textContent = letters[i].val
        tSpan.setAttributeNS(
          'http://www.w3.org/XML/1998/namespace',
          'xml:space',
          'preserve'
        )
        if (this.isMasked) {
          this.innerElem?.appendChild(tSpan)
        } else {
          if (tParent) {
            this.innerElem?.appendChild(tParent)
          }

          const tStyle = tSpan.style,
            tSpanTranslation = `translate3d(0,${-(documentData?.finalSize || 0) / 1.2}px,0)`

          tStyle.transform = tSpanTranslation
        }
      }
      //
      if (this.isMasked) {
        this.textSpans[cnt] = tSpan as HTMLElement
      } else {
        this.textSpans[cnt] = tParent as HTMLElement
      }
      this.textSpans[cnt].style.display = 'block'
      this.textPaths[cnt] = tSpan as SVGPathElement
      cnt++
    }
    while (cnt < this.textSpans.length) {
      this.textSpans[cnt].style.display = 'none'
      cnt++
    }
  }

  override createContent() {
    this.isMasked = this.checkMasks()
    if (this.isMasked) {
      this.renderType = RendererType.SVG
      this.compW = this.comp?.data?.w
      this.compH = this.comp?.data?.h
      this.svgElement?.setAttribute('width', `${this.compW}`)
      this.svgElement?.setAttribute('height', `${this.compH}`)
      const g = createNS<SVGGElement>('g')

      this.maskedElement?.appendChild(g)
      this.innerElem = g
    } else {
      this.renderType = RendererType.HTML
      this.innerElem = this.layerElement
    }

    this.checkParenting()
  }
  override renderInnerContent() {
    this.validateText()
    let svgStyle

    if (this.data?.singleShape) {
      if (!this._isFirstFrame && !this.lettersChangedFlag) {
        return
      }
      if (this.isMasked && this.finalTransform?._matMdf) {
        // Todo Benchmark if using this is better than getBBox
        this.svgElement?.setAttribute('viewBox',
          `${-(this.finalTransform.mProp.p?.v as any[])[0]} ${-(
            this.finalTransform.mProp.p?.v as any[]
          )[1].v[1]} ${this.compW} ${this.compH}`)
        svgStyle = this.svgElement?.style
        const translation = `translate(${-(this.finalTransform.mProp.p as any)
          ?.v[0]}px,${-(this.finalTransform.mProp.p as any)?.v[1]}px)`

        if (svgStyle) {
          svgStyle.transform = translation
        }
      }
    }

    this.textAnimator?.getMeasures(this.textProperty?.currentData as DocumentData,
      this.lettersChangedFlag)
    if (!this.lettersChangedFlag && !this.textAnimator?.lettersChangedFlag) {
      return
    }
    let count = 0
    const renderedLetters = this.textAnimator?.renderedLetters ?? [],
      letters = this.textProperty?.currentData.l ?? []

    const { length } = letters
    let renderedLetter
    let textSpan
    let textPath

    for (let i = 0; i < length; i++) {
      if (letters[i].n) {
        count++
        continue
      }
      textSpan = this.textSpans[i]
      textPath = this.textPaths[i]
      renderedLetter = renderedLetters[count]
      count++
      if (renderedLetter._mdf.m) {
        if (this.isMasked) {
          textSpan.setAttribute('transform', renderedLetter.m as string)
        } else {
          textSpan.style.transform = renderedLetter.m as string
        }
      }
      // / /textSpan.setAttribute('opacity',renderedLetter.o);
      textSpan.style.opacity = `${renderedLetter.o ?? 1}`
      if (renderedLetter.sw && renderedLetter._mdf.sw) {
        textPath.setAttribute('stroke-width', `${renderedLetter.sw}`)
      }
      if (renderedLetter.sc && renderedLetter._mdf.sc) {
        textPath.setAttribute('stroke', renderedLetter.sc as string)
      }
      if (renderedLetter.fc && renderedLetter._mdf.fc) {
        textPath.setAttribute('fill', renderedLetter.fc as string)
        textPath.style.color = renderedLetter.fc as string
      }
    }

    if (
      (this.innerElem as SVGGraphicsElement | undefined)?.getBBox &&
      !this.hidden &&
      (this._isFirstFrame || this._mdf)
    ) {
      const boundingBox = (this.innerElem as SVGGraphicsElement).getBBox()

      if (this.currentBBox && this.currentBBox.w !== boundingBox.width) {
        this.currentBBox.w = boundingBox.width
        this.svgElement?.setAttribute('width', `${boundingBox.width}`)
      }
      if (this.currentBBox && this.currentBBox.h !== boundingBox.height) {
        this.currentBBox.h = boundingBox.height
        this.svgElement?.setAttribute('height', `${boundingBox.height}`)
      }

      const margin = 1

      if (
        this.currentBBox &&
        (this.currentBBox.w !== boundingBox.width + margin * 2 ||
          this.currentBBox.h !== boundingBox.height + margin * 2 ||
          this.currentBBox.x !== boundingBox.x - margin ||
          this.currentBBox.y !== boundingBox.y - margin)
      ) {
        this.currentBBox.w = boundingBox.width + margin * 2
        this.currentBBox.h = boundingBox.height + margin * 2
        this.currentBBox.x = boundingBox.x - margin
        this.currentBBox.y = boundingBox.y - margin

        this.svgElement?.setAttribute('viewBox',
          `${this.currentBBox.x} ${this.currentBBox.y} ${this.currentBBox.w} ${
            this.currentBBox.h
          }`)
        if (this.svgElement) {
          svgStyle = this.svgElement.style
          const svgTransform = `translate(${this.currentBBox.x}px,${
            this.currentBBox.y
          }px)`

          svgStyle.transform = svgTransform
        }
      }
    }
  }
}
