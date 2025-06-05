import type {
  ElementInterfaceIntersect, Shape, VectorProperty
} from '@/types'
import type { ValueProperty } from '@/utils/Properties'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'
import type ShapePath from '@/utils/shapes/ShapePath'

import {
  joinLines,
  offsetSegmentSplit,
  pointEqual,
  pruneIntersections,
} from '@/utils'
import {
  type default as PolynomialBezier,
  shapeSegment,
  shapeSegmentInverted,
} from '@/utils/PolynomialBezier'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/modifiers/ShapeModifier'

export default class OffsetPathModifier extends ShapeModifier {
  amount?: ValueProperty
  lineJoin?: number
  miterLimit?: ValueProperty
  override initModifierProperties(elem: ElementInterfaceIntersect,
    data: Shape) {
    this.getValue = this.processKeys
    this.amount = PropertyFactory.getProp(
      elem,
      data.a,
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.miterLimit = PropertyFactory.getProp(
      elem,
      data.ml as unknown as VectorProperty, // TODO: Find if typing is wrong
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.lineJoin = data.lj
    this._isAnimated = this.amount.effectsSequence.length > 0
  }

  processPath(
    inputBezier: ShapePath,
    amount: number,
    lineJoin: number,
    miterLimit: number
  ) {
    const outputBezier = newElement<ShapePath>()

    outputBezier.c = inputBezier.c
    let count = inputBezier.length()

    if (!inputBezier.c) {
      count -= 1
    }
    let segment: PolynomialBezier,
      multiSegments: PolynomialBezier[][] = []

    for (let i = 0; i < count; i++) {
      segment = shapeSegment(inputBezier, i)
      multiSegments.push(offsetSegmentSplit(segment, amount))
    }

    if (!inputBezier.c) {
      for (let i = count - 1; i >= 0; i--) {
        segment = shapeSegmentInverted(inputBezier, i)
        multiSegments.push(offsetSegmentSplit(segment, amount))
      }
    }

    multiSegments = pruneIntersections(multiSegments)

    // Add bezier segments to the output and apply line joints
    let lastPoint = null,
      lastSeg = null

    const { length } = multiSegments

    for (let i = 0; i < length; i++) {
      const multiSegment = multiSegments[i]

      if (lastSeg) {
        lastPoint = joinLines(
          outputBezier,
          lastSeg,
          multiSegment[0],
          lineJoin,
          miterLimit
        )
      }

      lastSeg = multiSegment[multiSegment.length - 1]

      const { length: mLength } = multiSegment

      for (let j = 0; j < mLength; j++) {
        segment = multiSegment[j]

        if (lastPoint && pointEqual(segment.points[0], lastPoint)) {
          outputBezier.setXYAt(
            segment.points[1][0],
            segment.points[1][1],
            'o',
            outputBezier.length() - 1
          )
        } else {
          outputBezier.setTripleAt(
            segment.points[0][0],
            segment.points[0][1],
            segment.points[1][0],
            segment.points[1][1],
            segment.points[0][0],
            segment.points[0][1],
            outputBezier.length()
          )
        }

        outputBezier.setTripleAt(
          segment.points[3][0],
          segment.points[3][1],
          segment.points[3][0],
          segment.points[3][1],
          segment.points[2][0],
          segment.points[2][1],
          outputBezier.length()
        )

        lastPoint = segment.points[3]
      }
    }

    if (length > 0 && lastSeg) {
      joinLines(
        outputBezier,
        lastSeg,
        multiSegments[0][0],
        lineJoin,
        miterLimit
      )
    }

    return outputBezier
  }

  processShapes(_isFirstFrame: boolean) {
    const { length } = this.shapes,
      amount = Number(this.amount?.v),
      miterLimit = Number(this.miterLimit?.v),
      lineJoin = Number(this.lineJoin)

    if (amount !== 0) {
      let shapePaths, shapeData, localShapeCollection

      for (let i = 0; i < length; i++) {
        shapeData = this.shapes[i] as unknown as ShapeProperty
        localShapeCollection = shapeData.localShapeCollection
        if (!(!shapeData.shape?._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection?.releaseShapes()
          if (shapeData.shape) {
            shapeData.shape._mdf = true
          }

          shapePaths = shapeData.shape?.paths?.shapes
          const jLen = shapeData.shape?.paths?._length || 0

          for (let j = 0; j < jLen; j++) {
            const shapePath = shapePaths?.[j]

            if (!shapePath) {
              continue
            }

            localShapeCollection?.addShape(this.processPath(
              shapePath, amount, lineJoin, miterLimit
            ))
          }
        }

        if (shapeData.shape) {
          shapeData.shape.paths = shapeData.localShapeCollection
        }


      }
    }
    if (this.dynamicProperties.length === 0) {
      this._mdf = false
    }
  }
}
