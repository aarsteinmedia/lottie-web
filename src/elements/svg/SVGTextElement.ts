
import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  SourceRect,
  TextSpan,
  Vector3,
} from '@/types'
import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGCompElement from '@/elements/svg/SVGCompElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'
import TextElement from '@/elements/TextElement'
import { RendererType } from '@/utils/enums'
import { createSizedArray } from '@/utils/helpers/arrays'
import createNS from '@/utils/helpers/svgElements'

const emptyShapeData = { shapes: [] } as unknown as LottieLayer

export default class SVGTextLottieElement extends TextElement {
  _sizeChanged?: boolean
  bbox?: {
    height: number
    left: number
    top: number
    width: number
  }
  override createContainerElements = SVGBaseElement.prototype.createContainerElements
  override createRenderableComponents = SVGBaseElement.prototype.createRenderableComponents
  override destroyBaseElement = SVGBaseElement.prototype.destroyBaseElement
  override getBaseElement = SVGBaseElement.prototype.getBaseElement
  getMatte = SVGBaseElement.prototype.getMatte
  override initRendererElement = SVGBaseElement.prototype.initRendererElement
  renderedFrame?: number
  renderedLetters: string[] = []
  override renderElement = SVGBaseElement.prototype.renderElement
  setMatte = SVGBaseElement.prototype.setMatte
  textContainer?: SVGTextElement
  textSpans: TextSpan[]

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.textSpans = []
    this.renderType = RendererType.SVG

    this.initElement(
      data, globalData, comp
    )
  }

  override buildNewText() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }

    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    if (!this.layerElement) {
      throw new Error(`${this.constructor.name}: layerElement is not implemented`)
    }

    if (!this.textProperty?.currentData) {
      throw new Error(`${this.constructor.name}: DocumentData is not implemented`)
    }

    this.addDynamicProperty(this as unknown as DynamicPropertyContainer)
    let i, len

    const documentData = this.textProperty.currentData

    this.renderedLetters = createSizedArray(documentData.l.length || 0)
    if (documentData.fc) {
      this.layerElement.setAttribute('fill',
        this.buildColor(documentData.fc as Vector3))
    } else {
      this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)')
    }
    if (documentData.sc) {
      this.layerElement.setAttribute('stroke', this.buildColor(documentData.sc))
      this.layerElement.setAttribute('stroke-width', `${documentData.sw || 0}`)
    }
    this.layerElement.setAttribute('font-size',
      `${documentData.finalSize || 0}`)
    const fontData = this.globalData.fontManager?.getFontByName(documentData.f)

    if (fontData?.fClass) {
      this.layerElement.classList.add(fontData.fClass)
    } else {
      if (fontData?.fFamily) {
        this.layerElement.setAttribute('font-family', fontData.fFamily)
      }
      const { fWeight } = documentData,
        { fStyle } = documentData

      this.layerElement.setAttribute('font-style', fStyle)
      this.layerElement.setAttribute('font-weight', fWeight)
    }
    this.layerElement.ariaLabel = `${documentData.t}`

    const letters = documentData.l,
      hasGlyphs = Boolean(this.globalData.fontManager?.chars)

    len = letters.length

    let tSpan: SVGTextElement | SVGGElement | null = null
    const matrixHelper = this.mHelper,
      shapeStr = '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { singleShape } = this.data
    let xPos = 0,
      yPos = 0,
      isFirstLine = true
    const trackingOffset =
      documentData.tr * 0.001 * Number(documentData.finalSize)

    if (singleShape && !hasGlyphs && !documentData.sz) {
      const tElement = this.textContainer

      let justify

      switch (documentData.j) {
        case 1: {
          justify = 'end'
          break
        }
        case 2: {
          justify = 'middle'
          break
        }
        default: {
          justify = 'start'
          break
        }
      }
      tElement?.setAttribute('text-anchor', justify)
      tElement?.setAttribute('letter-spacing', `${trackingOffset}`)
      const textContent = this.buildTextContents(documentData.finalText)

      len = textContent.length
      yPos = documentData.ps
        ? documentData.ps[1] + Number(documentData.ascent)
        : 0
      for (i = 0; i < len; i++) {

        tSpan = this.textSpans[i]?.span ?? createNS<SVGTSpanElement>('tspan')
        tSpan.textContent = textContent[i]
        tSpan.setAttribute('x', '0')
        tSpan.setAttribute('y', `${yPos}`)
        tSpan.style.display = 'inherit'
        tElement?.appendChild(tSpan)
        if (!this.textSpans[i]) {
          this.textSpans[i] = {
            glyph: null,
            span: null,
          } as any
        }
        this.textSpans[i].span = tSpan
        yPos += Number(documentData.finalLineHeight)
      }

      if (tElement) {
        this.layerElement.appendChild(tElement)
      }
    } else {
      const cachedSpansLength = this.textSpans.length
      let charData

      for (i = 0; i < len; i++) {
        if (!this.textSpans[i]) {
          this.textSpans[i] = {
            childSpan: null,
            glyph: null,
            span: null,
          } as any
        }
        if (!hasGlyphs || !singleShape || i === 0) {
          tSpan =
            cachedSpansLength > i
              ? this.textSpans[i]?.span
              : createNS<SVGGElement | SVGTextElement>(hasGlyphs ? 'g' : 'text')

          if (!tSpan) {
            throw new Error('Could not create tSpan')
          }

          if (cachedSpansLength <= i) {
            tSpan.setAttribute('stroke-linecap', 'butt')
            tSpan.setAttribute('stroke-linejoin', 'round')
            tSpan.setAttribute('stroke-miterlimit', '4')
            if (this.textSpans[i]) {
              this.textSpans[i].span = tSpan
            }

            if (hasGlyphs) {
              const childSpan = createNS<SVGGElement>('g')

              tSpan.appendChild(childSpan)

              if (this.textSpans[i]) {
                this.textSpans[i].childSpan = childSpan
              }

            }

            if (this.textSpans[i]) {
              this.textSpans[i].span = tSpan
            }

            this.layerElement.appendChild(tSpan)
          }
          tSpan.style.display = 'inherit'
        }

        matrixHelper.reset()
        if (singleShape) {
          if (letters[i].n) {
            xPos = -trackingOffset
            yPos += Number(documentData.yOffset)
            yPos += isFirstLine ? 1 : 0
            isFirstLine = false
          }
          this.applyTextPropertiesToMatrix(
            documentData,
            matrixHelper,
            letters[i].line,
            xPos,
            yPos
          )
          xPos += letters[i].l || 0
          // xPos += letters[i].val === ' ' ? 0 : trackingOffset;
          xPos += trackingOffset
        }
        if (hasGlyphs) {
          charData = this.globalData.fontManager?.getCharData(
            documentData.finalText[i],
            fontData?.fStyle,
            this.globalData.fontManager.getFontByName(documentData.f).fFamily
          )
          let glyphElement: SVGCompElement | SVGShapeElement

          // t === 1 means the character has been replaced with an animated shaped
          if (charData?.t === 1) {
            glyphElement = new SVGCompElement(
              charData.data as LottieLayer,
              this.globalData,
              this as unknown as ElementInterfaceIntersect
            )
          } else {
            let data = emptyShapeData

            if (charData?.data?.shapes) {
              data = this.buildShapeData(charData.data,
                Number(documentData.finalSize))
            }
            glyphElement = new SVGShapeElement(
              data,
              this.globalData,
              this as unknown as ElementInterfaceIntersect
            )
          }
          if (this.textSpans[i]) {
            const { glyph } = this.textSpans[i]

            if (glyph) {
              if (glyph.layerElement) {
                this.textSpans[i]?.childSpan?.removeChild(glyph.layerElement)
              }

              glyph.destroy()
            }


            this.textSpans[i].glyph = glyphElement
          }
          glyphElement._debug = true
          glyphElement.prepareFrame(0)
          glyphElement.renderFrame()
          if (glyphElement.layerElement) {
            this.textSpans[i]?.childSpan?.appendChild(glyphElement.layerElement)
          }


          // when using animated shapes, the layer will be scaled instead of replacing the internal scale
          // this might have issues with strokes and might need a different solution
          if (charData?.t === 1) {
            this.textSpans[i]?.childSpan?.setAttribute('transform',
              `scale(${Number(documentData.finalSize) / 100},${Number(documentData.finalSize) / 100
              })`)
          }

          continue
        }
        if (tSpan) {
          if (singleShape) {
            tSpan.setAttribute('transform',
              `translate(${matrixHelper.props[12]},${matrixHelper.props[13]})`)
          }

          tSpan.textContent = letters[i].val
          tSpan.style.whiteSpace = 'preserve'

          // tSpan.setAttributeNS(
          //   namespaceXML,
          //   'xml:space',
          //   'preserve'
          // )
        }
      }
      if (singleShape) {
        tSpan?.setAttribute('d', shapeStr)
      }
    }
    const span = this.textSpans[i]?.span

    if (span) {
      while (i < this.textSpans.length) {
        span.style.display = 'none'

        i++
      }
    }


    this._sizeChanged = true
  }

  buildShapeData(data: LottieLayer, scale: number) {
    // data should probably be cloned to apply scale separately to each instance of a text on different layers
    // but since text internal content gets only rendered once and then it's never rerendered,
    // it's probably safe not to clone data and reuse always the same instance even if the object is mutated.
    // Avoiding cloning is preferred since cloning each character shape data is expensive
    if (data.shapes.length > 0) {
      const shape = data.shapes[0]

      if (shape.it) {
        const shapeItem = shape.it[shape.it.length - 1]

        if (shapeItem.s) {
          shapeItem.s.k[0] = scale
          shapeItem.s.k[1] = scale
        }
      }
    }

    return data
  }

  buildTextContents(textArray: string[]) {
    let i = 0
    const { length } = textArray,
      textContents = []
    let currentTextContent = ''

    while (i < length) {
      if (
        textArray[i] === String.fromCharCode(13) ||
        textArray[i] === String.fromCharCode(3)
      ) {
        textContents.push(currentTextContent)
        currentTextContent = ''
      } else {
        currentTextContent += textArray[i]
      }
      i++
    }
    textContents.push(currentTextContent)

    return textContents
  }

  override createContent() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (this.data.singleShape && !this.globalData.fontManager?.chars) {
      this.textContainer = createNS<SVGTextElement>('text')
    }
  }

  getValue() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    const { length } = this.textSpans
    let glyphElement

    this.renderedFrame = this.comp?.renderedFrame
    for (let i = 0; i < length; i++) {
      glyphElement = this.textSpans[i].glyph
      if (glyphElement) {
        glyphElement.prepareFrame(Number(this.comp?.renderedFrame) - Number(this.data.st))
        if (glyphElement._mdf) {
          this._mdf = true
        }
      }
    }
  }

  override renderInnerContent() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    this.validateText()
    if (this.data.singleShape && !this._mdf) {
      return
    }
    if (!this.textProperty) {
      throw new Error(`${this.constructor.name}: textProperty is not initialized`)
    }
    this.textAnimator?.getMeasures(this.textProperty.currentData,
      this.lettersChangedFlag)
    if (this.lettersChangedFlag || this.textAnimator?.lettersChangedFlag) {
      this._sizeChanged = true
      const renderedLetters = this.textAnimator?.renderedLetters,
        letters = this.textProperty.currentData.l,
        { length } = letters
      let renderedLetter, textSpan, glyphElement

      for (let i = 0; i < length; i++) {
        if (letters[i].n) {
          continue
        }
        renderedLetter = renderedLetters?.[i]
        textSpan = this.textSpans[i].span
        glyphElement = this.textSpans[i].glyph
        if (glyphElement) {
          glyphElement.renderFrame()
        }
        if (renderedLetter?._mdf.m) {
          textSpan?.setAttribute('transform', renderedLetter.m as string)
        }
        if (renderedLetter?._mdf.o) {
          textSpan?.setAttribute('opacity', `${renderedLetter.o ?? 1}`)
        }
        if (renderedLetter?._mdf.sw) {
          textSpan?.setAttribute('stroke-width', `${renderedLetter.sw || 0}`)
        }
        if (renderedLetter?._mdf.sc) {
          textSpan?.setAttribute('stroke', renderedLetter.sc as string)
        }
        if (renderedLetter?._mdf.fc) {
          textSpan?.setAttribute('fill', renderedLetter.fc as string)
        }
      }
    }
  }

  override sourceRectAtTime(): SourceRect | null {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.comp) {
      throw new Error(`${this.constructor.name}: comp (ElementInterface) is not implemented`)
    }
    if (!this.layerElement) {
      throw new Error(`${this.constructor.name}: layerElement is not implemented`)
    }
    this.prepareFrame(Number(this.comp.renderedFrame) - Number(this.data.st))
    this.renderInnerContent()
    if (this._sizeChanged) {
      this._sizeChanged = false
      const textBox = (this.layerElement as SVGGElement).getBBox()

      this.bbox = {
        height: textBox.height,
        left: textBox.x,
        top: textBox.y,
        width: textBox.width,
      }

      return this.bbox
    }

    return null
  }
}