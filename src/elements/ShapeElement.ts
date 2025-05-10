import type CVShapeData from '@/elements/helpers/shapes/CVShapeData'
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type { ElementInterfaceIntersect, Shape } from '@/types'
import type { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers'

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import ProcessedElement from '@/elements/helpers/shapes/ProcessedElement'

export default abstract class ShapeElement extends RenderableDOMElement {
  _length?: number

  processedElements: ProcessedElement[] = []

  shapeModifiers: ShapeModifierInterface[] = []

  shapes: (SVGShapeData | CVShapeData)[] = []

  addProcessedElement(elem: ElementInterfaceIntersect, pos: number) {
    const { processedElements } = this
    let i = processedElements.length

    while (i) {
      i--
      if (processedElements[i].elem === elem) {
        processedElements[i].pos = pos

        return
      }
    }
    processedElements.push(new ProcessedElement(elem, pos))
  }

  addShapeToModifiers(data: SVGShapeData | CVShapeData) {
    const { length } = this.shapeModifiers

    for (let i = 0; i < length; i++) {
      this.shapeModifiers[i].addShape(data)
    }
  }

  isShapeInAnimatedModifiers(data: Shape) {
    let i = 0
    const { length } = this.shapeModifiers

    while (i < length) {
      if (this.shapeModifiers[i].isAnimatedWithShape(data)) {
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
    const { length } = this.shapes

    for (let i = 0; i < length; i++) {
      this.shapes[i].sh?.reset()
    }

    const { length: len } = this.shapeModifiers
    let shouldBreakProcess

    for (let i = len - 1; i >= 0; i--) {
      shouldBreakProcess = this.shapeModifiers[i].processShapes(Boolean(this._isFirstFrame))
      // workaround to fix cases where a repeater resets the shape so the following processes get called twice
      // TODO: find a better solution for this
      if (shouldBreakProcess) {
        break
      }
    }
  }
  searchProcessedElement(elem: unknown) {
    const { processedElements } = this
    let i = 0
    const { length } = processedElements

    while (i < length) {
      if (processedElements[i].elem === elem) {
        return processedElements[i].pos
      }
      i++
    }

    return 0
  }
}
