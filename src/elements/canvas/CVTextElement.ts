import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  TextSpan,
  Vector3,
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'
import type LetterProps from '@/utils/text/LetterProps'

import CVBaseElement from '@/elements/canvas/CVBaseElement'
import TextElement from '@/elements/TextElement'
import { RendererType, ShapeType } from '@/utils/enums'
import { createSizedArray } from '@/utils/helpers/arrays'
import createTag from '@/utils/helpers/htmlElements'

const transparent = 'rgba(0,0,0,0)'

export default class CVTextElement extends TextElement {

  canvasContext?: CanvasRenderingContext2D
  clearCanvas = CVBaseElement.prototype.clearCanvas
  override createContainerElements = CVBaseElement.prototype.createContainerElements
  override createContent = CVBaseElement.prototype.createContent
  createElements = CVBaseElement.prototype.createElements
  override createRenderableComponents = CVBaseElement.prototype.createRenderableComponents
  currentRender: unknown
  override destroy = CVBaseElement.prototype.destroy
  exitLayer = CVBaseElement.prototype.exitLayer
  fill?: boolean
  fillColorAnim: boolean
  override hide = CVBaseElement.prototype.hide
  hideElement = CVBaseElement.prototype.hideElement
  override initRendererElement = CVBaseElement.prototype.initRendererElement
  justifyOffset: number
  prepareLayer = CVBaseElement.prototype.prepareLayer
  renderedLetters: LetterProps[] = []
  override renderFrame = CVBaseElement.prototype.renderFrame
  override renderLocalTransform = CVBaseElement.prototype.renderLocalTransform
  override renderRenderable = CVBaseElement.prototype.renderRenderable
  override searchEffectTransforms = CVBaseElement.prototype.searchEffectTransforms
  override setBlendMode = CVBaseElement.prototype.setBlendMode
  override show = CVBaseElement.prototype.show
  showElement = CVBaseElement.prototype.showElement
  stroke?: boolean
  strokeColorAnim: boolean
  strokeWidthAnim: boolean
  textSpans: TextSpan[]
  tHelper = createTag<HTMLCanvasElement>('canvas').getContext('2d')
  values: {
    fill: string
    fValue: string
    stroke: string
    sWidth: number
  }
  yOffset: number

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.textSpans = []
    this.yOffset = 0
    this.fillColorAnim = false
    this.strokeColorAnim = false
    this.strokeWidthAnim = false
    this.stroke = false
    this.fill = false
    this.justifyOffset = 0
    this.currentRender = null
    this.renderType = RendererType.Canvas
    this.values = {
      fill: transparent,
      fValue: '',
      stroke: transparent,
      sWidth: 0,
    }

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
    if (!this.globalData.fontManager) {
      throw new Error(`${this.constructor.name}: fontManager is not implemented in globalData`)
    }
    if (!this.textProperty) {
      throw new Error(`${this.constructor.name}: textProperty is not implemented`)
    }

    const documentData = this.textProperty.currentData

    this.renderedLetters = createSizedArray(documentData.l.length || 0)

    let hasFill = false

    if (documentData.fc) {
      hasFill = true
      this.values.fill = this.buildColor(documentData.fc as Vector3)
    } else {
      this.values.fill = 'rgba(0,0,0,0)'
    }
    this.fill = hasFill
    let hasStroke = false

    if (documentData.sc) {
      hasStroke = true
      this.values.stroke = this.buildColor(documentData.sc)
      this.values.sWidth = Number(documentData.sw)
    }
    const fontData = this.globalData.fontManager.getFontByName(documentData.f),
      letters = documentData.l,
      matrixHelper = this.mHelper

    this.stroke = hasStroke
    this.values.fValue = `${documentData.finalSize}px ${this.globalData.fontManager.getFontByName(documentData.f).fFamily
    }`

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { singleShape } = this.data,
      trackingOffset = documentData.tr * 0.001 * Number(documentData.finalSize)
    let k,
      xPos = 0,
      yPos = 0,
      isFirstLine = true,
      cnt = 0
    const { length } = documentData.finalText

    for (let i = 0; i < length; i++) {
      const charData = this.globalData.fontManager.getCharData(
        documentData.finalText[i],
        fontData.fStyle,
        this.globalData.fontManager.getFontByName(documentData.f).fFamily
      )
      const shapeData = charData.data ?? {} as Partial<LottieLayer>

      matrixHelper.reset()
      if (singleShape && letters[i].n) {
        xPos = -trackingOffset
        yPos += Number(documentData.yOffset)
        yPos += isFirstLine ? 1 : 0
        isFirstLine = false
      }
      const shapes = shapeData.shapes?.[0].it ?? []

      matrixHelper.scale(Number(documentData.finalSize) / 100,
        Number(documentData.finalSize) / 100)
      if (singleShape) {
        this.applyTextPropertiesToMatrix(
          documentData,
          matrixHelper,
          letters[i].line,
          xPos,
          yPos
        )
      }
      const { length: jLen } = shapes,
        commands = createSizedArray(jLen - 1)
      let commandsCounter = 0

      for (let j = 0; j < jLen; j++) {
        if (shapes[j].ty !== ShapeType.Path) {
          continue
        }
        const { length: kLen } = (shapes[j].ks?.k as ShapePath).i,
          pathNodes = shapes[j].ks?.k as ShapePath,
          pathArr = []

        for (k = 1; k < kLen; k++) {
          if (k === 1) {
            pathArr.push(matrixHelper.applyToX(
              pathNodes.v[0][0], pathNodes.v[0][1], 0
            ),
            matrixHelper.applyToY(
              pathNodes.v[0][0], pathNodes.v[0][1], 0
            ))
          }
          pathArr.push(
            matrixHelper.applyToX(
              pathNodes.o[k - 1][0],
              pathNodes.o[k - 1][1],
              0
            ),
            matrixHelper.applyToY(
              pathNodes.o[k - 1][0],
              pathNodes.o[k - 1][1],
              0
            ),
            matrixHelper.applyToX(
              pathNodes.i[k][0], pathNodes.i[k][1], 0
            ),
            matrixHelper.applyToY(
              pathNodes.i[k][0], pathNodes.i[k][1], 0
            ),
            matrixHelper.applyToX(
              pathNodes.v[k][0], pathNodes.v[k][1], 0
            ),
            matrixHelper.applyToY(
              pathNodes.v[k][0], pathNodes.v[k][1], 0
            )
          )
        }
        pathArr.push(
          matrixHelper.applyToX(
            pathNodes.o[k - 1][0],
            pathNodes.o[k - 1][1],
            0
          ),
          matrixHelper.applyToY(
            pathNodes.o[k - 1][0],
            pathNodes.o[k - 1][1],
            0
          ),
          matrixHelper.applyToX(
            pathNodes.i[0][0], pathNodes.i[0][1], 0
          ),
          matrixHelper.applyToY(
            pathNodes.i[0][0], pathNodes.i[0][1], 0
          ),
          matrixHelper.applyToX(
            pathNodes.v[0][0], pathNodes.v[0][1], 0
          ),
          matrixHelper.applyToY(
            pathNodes.v[0][0], pathNodes.v[0][1], 0
          )
        )
        commands[commandsCounter] = pathArr
        commandsCounter++
      }
      if (singleShape) {
        xPos += letters[i].l
        xPos += trackingOffset
      }
      if (this.textSpans[cnt]) {
        this.textSpans[cnt].elem = commands as number[][]
      } else {
        this.textSpans[cnt] = { elem: commands } as TextSpan
      }
      cnt++
    }
  }

  override renderInnerContent() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.textAnimator) {
      throw new Error(`${this.constructor.name}: textAnimator is not implemented`)
    }
    if (!this.textProperty) {
      throw new Error(`${this.constructor.name}: textProperty is not implemented`)
    }
    if (!this.canvasContext) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }

    this.validateText()
    const ctx = this.canvasContext

    ctx.font = this.values.fValue
    ; (this.globalData.renderer as CanvasRenderer | undefined)?.ctxLineCap('butt')
    // ctx.lineCap = 'butt';
    ; (this.globalData.renderer as CanvasRenderer | undefined)?.ctxLineJoin('miter')
    // ctx.lineJoin = 'miter';
    ; (this.globalData.renderer as CanvasRenderer | undefined)?.ctxMiterLimit(4)
    // ctx.miterLimit = 4;

    if (!this.data.singleShape) {
      this.textAnimator.getMeasures(this.textProperty.currentData,
        this.lettersChangedFlag)
    }

    let j,
      jLen: number,
      k,
      kLen
    const { renderedLetters } = this.textAnimator

    const letters = this.textProperty.currentData.l

    let renderedLetter,
      lastFill = null,
      lastStroke = null,
      lastStrokeW = null,
      commands: number[][],
      pathArr
    const renderer = this.globalData.renderer as CanvasRenderer,
      { length } = letters

    for (let i = 0; i < length; i++) {
      if (letters[i].n) {
        continue
      }
      renderedLetter = renderedLetters[i]
      renderer.save()
      renderer.ctxTransform(renderedLetter.p as unknown as Float32Array)
      renderer.ctxOpacity(renderedLetter.o)
      if (this.fill) {
        if (renderedLetter.fc) {
          if (lastFill !== renderedLetter.fc) {
            renderer.ctxFillStyle(renderedLetter.fc as string)
            lastFill = renderedLetter.fc
            // ctx.fillStyle = renderedLetter.fc;
          }
        } else if (lastFill !== this.values.fill) {
          lastFill = this.values.fill
          renderer.ctxFillStyle(this.values.fill)
          // ctx.fillStyle = this.values.fill;
        }
        commands = this.textSpans[i].elem ?? []
        const { length: lLen } = commands

        this.globalData.canvasContext?.beginPath()
        for (j = 0; j < lLen; j++) {
          pathArr = commands[j] || []
          const { length: mLen } = pathArr

          this.globalData.canvasContext?.moveTo(pathArr[0], pathArr[1])
          for (k = 2; k < mLen; k += 6) {
            this.globalData.canvasContext?.bezierCurveTo(
              pathArr[k],
              pathArr[k + 1],
              pathArr[k + 2],
              pathArr[k + 3],
              pathArr[k + 4],
              pathArr[k + 5]
            )
          }
        }
        this.globalData.canvasContext?.closePath()
        renderer.ctxFill()
        // this.globalData.canvasContext.fill();
        // / ctx.fillText(this.textSpans[i].val,0,0);
      }
      if (this.stroke) {
        if (renderedLetter.sw) {
          if (lastStrokeW !== renderedLetter.sw) {
            lastStrokeW = renderedLetter.sw
            renderer.ctxLineWidth(renderedLetter.sw)
            // ctx.lineWidth = renderedLetter.sw;
          }
        } else if (lastStrokeW !== this.values.sWidth) {
          lastStrokeW = this.values.sWidth
          renderer.ctxLineWidth(this.values.sWidth)
          // ctx.lineWidth = this.values.sWidth;
        }
        if (renderedLetter.sc) {
          if (lastStroke !== renderedLetter.sc) {
            lastStroke = renderedLetter.sc
            renderer.ctxStrokeStyle(renderedLetter.sc as string)
            // ctx.strokeStyle = renderedLetter.sc;
          }
        } else if (lastStroke !== this.values.stroke) {
          lastStroke = this.values.stroke
          renderer.ctxStrokeStyle(this.values.stroke)
          // ctx.strokeStyle = this.values.stroke;
        }
        commands = this.textSpans[i].elem ?? []
        jLen = commands.length
        this.globalData.canvasContext?.beginPath()
        for (j = 0; j < jLen; j++) {
          pathArr = commands[j]
          kLen = pathArr.length
          this.globalData.canvasContext?.moveTo(pathArr[0], pathArr[1])
          for (k = 2; k < kLen; k += 6) {
            this.globalData.canvasContext?.bezierCurveTo(
              pathArr[k],
              pathArr[k + 1],
              pathArr[k + 2],
              pathArr[k + 3],
              pathArr[k + 4],
              pathArr[k + 5]
            )
          }
        }
        this.globalData.canvasContext?.closePath()
        renderer.ctxStroke()
        // this.globalData.canvasContext.stroke();
        // / ctx.strokeText(letters[i].val,0,0);
      }
      ; (this.globalData.renderer as CanvasRenderer | undefined)?.restore()
    }
  }
}