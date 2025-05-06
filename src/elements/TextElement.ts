import type {
  DocumentData,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  Vector3,
} from '@/types'
import type Matrix from '@/utils/Matrix'
import type ShapePath from '@/utils/shapes/ShapePath'

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import { RendererType, ShapeType } from '@/enums'
import { buildShapeString } from '@/utils'
import LetterProps from '@/utils/text/LetterProps'
import TextAnimatorProperty from '@/utils/text/TextAnimatorProperty'
import TextProperty from '@/utils/text/TextProperty'

export default class TextElement extends RenderableDOMElement {
  emptyProp?: LetterProps

  lettersChangedFlag?: boolean

  renderType?: RendererType

  textAnimator?: TextAnimatorProperty
  textProperty?: TextProperty
  applyTextPropertiesToMatrix(
    documentData: DocumentData,
    matrixHelper: Matrix,
    lineNumber: number,
    xPos: number,
    yPos: number
  ) {
    if (documentData.ps) {
      matrixHelper.translate(
        documentData.ps[0],
        documentData.ps[1] + Number(documentData.ascent),
        0
      )
    }
    matrixHelper.translate(
      0, -Number(documentData.ls), 0
    )
    switch (documentData.j) {
      case 1: {
        matrixHelper.translate(
          Number(documentData.justifyOffset) +
            (Number(documentData.boxWidth) -
              Number(documentData.lineWidths[lineNumber])),
          0,
          0
        )
        break
      }
      case 2: {
        matrixHelper.translate(
          Number(documentData.justifyOffset) +
            (Number(documentData.boxWidth) -
              Number(documentData.lineWidths[lineNumber])) /
              2,
          0,
          0
        )
        break
      }
      default: {
        break
      }
    }
    matrixHelper.translate(
      xPos, yPos, 0
    )
  }
  buildColor(colorData: Vector3) {
    return `rgb(${Math.round(colorData[0] * 255)},${Math.round(colorData[1] * 255)},${Math.round(colorData[2] * 255)})`
  }
  buildNewText() {
    throw new Error(`${this.constructor.name}: Method buildNewText it not implemented`)
  }
  canResizeFont(_canResize: boolean) {
    this.textProperty?.canResizeFont(_canResize)
  }

  createPathShape(matrixHelper: Matrix, shapes: Shape[]) {
    let pathNodes: ShapePath,
      shapeStr = ''
    const { length } = shapes

    for (let i = 0; i < length; i++) {
      if (shapes[i].ty !== ShapeType.Path || !shapes[i].ks?.k) {
        continue
      }
      pathNodes = shapes[i].ks?.k as ShapePath
      shapeStr += buildShapeString(
        pathNodes,
        pathNodes.i.length,
        true,
        matrixHelper
      )
    }

    return shapeStr
  }

  override initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    if (!data.t) {
      throw new Error(`${this.constructor.name}: data.t (LottieLayer -> TextData) can't be undefined`)
    }
    this.emptyProp = new LetterProps()
    this.lettersChangedFlag = true
    this.initFrame()
    this.initBaseData(
      data, globalData, comp
    )
    this.textProperty = new TextProperty(this as unknown as ElementInterfaceIntersect,
      data.t)
    this.textAnimator = new TextAnimatorProperty(
      data.t,
      this.renderType || RendererType.SVG,
      this as unknown as ElementInterfaceIntersect
    )
    this.initTransform()
    this.initHierarchy()
    this.initRenderable()
    this.initRendererElement()
    this.createContainerElements()
    this.createRenderableComponents()
    this.createContent()
    this.hide()
    this.textAnimator.searchProperties(this.dynamicProperties)
  }

  override prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
  }

  setMinimumFontSize(_fontSize: number) {
    this.textProperty?.setMinimumFontSize(_fontSize)
  }

  updateDocumentData(newData: DocumentData, index: number) {
    this.textProperty?.updateDocumentData(newData, index)
  }

  validateText() {
    if (!this.textProperty?._mdf && !this.textProperty?._isFirstFrame) {
      return
    }
    this.buildNewText()
    this.textProperty._isFirstFrame = false
    this.textProperty._mdf = false
  }
}
