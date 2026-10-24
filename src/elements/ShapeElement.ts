import type { CVShapeData } from '@/elements/helpers/shapes/CVShapeData'
import type { SVGShapeData } from '@/elements/helpers/shapes/SVGShapeData'
import type { ElementInterfaceIntersect, Shape } from '@/types'
import type { ShapeModifierInterface } from '@/utils/shapes/modifiers'

import { RenderableDOMElement } from '@/elements/helpers/RenderableDOMElement'
import { ProcessedElement } from '@/elements/helpers/shapes/ProcessedElement'

export abstract class ShapeElement extends RenderableDOMElement {
  _length?: number
  processedElements: ProcessedElement[] = []
  shapeModifiers: ShapeModifierInterface[] = []
  shapes: (SVGShapeData | CVShapeData)[] = []

  addProcessedElement(elem: ElementInterfaceIntersect, pos: number) {

    const { processedElements } = this
    let i = processedElements.length

    while (i) {
      i--
      const processedElement = processedElements[i]

      if (processedElement.elem === elem) {
        processedElement.pos = pos

        return
      }
    }
    processedElements.push(new ProcessedElement(elem, pos))
  }

  addShapeToModifiers(data: SVGShapeData | CVShapeData) {
    for (let i = 0; i < this.shapeModifiers.length; i++) {
      this.shapeModifiers[i]?.addShape(data)
    }
  }

  isShapeInAnimatedModifiers(data: Shape) {
    let i = 0

    while (i < this.shapeModifiers.length) {
      if (this.shapeModifiers[i]?.isAnimatedWithShape(data)) {
        return true
      }
      i++
    }

    return false
  }

  override prepareFrame(num: number) {
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
  }

  renderModifiers() {
    if (this.shapeModifiers.length === 0) {
      return
    }

    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i]?.sh?.reset()
    }

    let shouldBreakProcess

    for (let i = this.shapeModifiers.length - 1; i >= 0; i--) {
      shouldBreakProcess = this.shapeModifiers[i]?.processShapes(Boolean(this._isFirstFrame))
      // workaround to fix cases where a repeater resets the shape so the following processes get called twice
      // TODO: find a better solution for this
      if (shouldBreakProcess) {
        break
      }
    }
  }

  searchProcessedElement(elem: unknown) {
    const { processedElements } = this,
      { length } = processedElements
    let i = 0

    while (i < length) {
      if (processedElements[i]?.elem === elem) {
        return processedElements[i]?.pos ?? 0
      }
      i++
    }

    return 0
  }
}