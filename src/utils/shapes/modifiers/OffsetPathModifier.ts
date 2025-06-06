import type {
  ElementInterfaceIntersect, Shape, Vector2, VectorProperty
} from '@/types'
import type ValueProperty from '@/utils/properties/ValueProperty'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'
import type ShapePath from '@/utils/shapes/ShapePath'

import {
  floatEqual,
  floatZero,
  pointEqual,
} from '@/utils'
import { roundCorner } from '@/utils/helpers/constants'
import PolynomialBezier, {
  shapeSegment,
  shapeSegmentInverted,
} from '@/utils/PolynomialBezier'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/modifiers/ShapeModifier'

const crossProduct = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],

  polarOffset = (
    p: Vector2, angle: number, length: number
  ): Vector2 => [
    p[0] + Math.cos(angle) * length, p[1] - Math.sin(angle) * length,
  ],

  linearOffset = (
    p1: Vector2, p2: Vector2, amount: number
  ): Vector2[] => {
    const angle = Math.atan2(p2[0] - p1[0], p2[1] - p1[1])

    return [polarOffset(
      p1, angle, amount
    ), polarOffset(
      p2, angle, amount
    )]
  },

  lineIntersection = (
    start1: Vector2,
    end1: Vector2,
    start2: Vector2,
    end2: Vector2
  ): Vector2 | null => {
    const v1 = [start1[0],
        start1[1],
        1],
      v2 = [end1[0],
        end1[1],
        1],
      v3 = [start2[0],
        start2[1],
        1],
      v4 = [end2[0],
        end2[1],
        1],
      /**
       *
       */
      r = crossProduct(crossProduct(v1, v2), crossProduct(v3, v4))

    if (floatZero(r[2])) {
      return null
    }

    return [r[0] / r[2], r[1] / r[2]]
  },

  pointDistance = (p1: Vector2, p2: Vector2) =>
    Math.hypot(p1[0] - p2[0], p1[1] - p2[1]),

  joinLines = (
    outputBezier: ShapePath,
    seg1: PolynomialBezier,
    seg2: PolynomialBezier,
    lineJoin: number,
    miterLimit: number
  ) => {
    const p0: Vector2 = seg1.points[3],
      p1: Vector2 = seg2.points[0]

    // Bevel
    if (lineJoin === 3) {
      return p0
    }

    // Connected, they don't need a joint
    if (pointEqual(p0, p1)) {
      return p0
    }

    // Round
    if (lineJoin === 2) {
      const angleOut = -seg1.tangentAngle(1),
        angleIn = -seg2.tangentAngle(0) + Math.PI,
        center = lineIntersection(
          p0,
          polarOffset(
            p0, angleOut + Math.PI / 2, 100
          ),
          p1,
          polarOffset(
            p1, angleOut + Math.PI / 2, 100
          )
        ),
        radius = center ? pointDistance(center, p0) : pointDistance(p0, p1) / 2

      let tan = polarOffset(
        p0, angleOut, 2 * radius * roundCorner
      )

      outputBezier.setXYAt(
        tan[0], tan[1], 'o', outputBezier.length() - 1
      )

      tan = polarOffset(
        p1, angleIn, 2 * radius * roundCorner
      )
      outputBezier.setTripleAt(
        p1[0],
        p1[1],
        p1[0],
        p1[1],
        tan[0],
        tan[1],
        outputBezier.length()
      )

      return p1
    }

    // Miter
    const t0 = pointEqual(p0, seg1.points[2]) ? seg1.points[0] : seg1.points[2],
      t1 = pointEqual(p1, seg2.points[1]) ? seg2.points[3] : seg2.points[1],
      intersection = lineIntersection(
        t0, p0, p1, t1
      )

    if (intersection && pointDistance(intersection, p0) < miterLimit) {
      outputBezier.setTripleAt(
        intersection[0],
        intersection[1],
        intersection[0],
        intersection[1],
        intersection[0],
        intersection[1],
        outputBezier.length()
      )

      return intersection
    }

    return p0
  },

  offsetSegment = (segment: { points: Vector2[] }, amount: number) => {
    let e: Vector2[]

    e = linearOffset(
      segment.points[0], segment.points[1], amount
    )
    const p0: Vector2 = e[0],
      p1a = e[1]

    e = linearOffset(
      segment.points[1], segment.points[2], amount
    )
    const p1b = e[0],
      p2b = e[1]

    e = linearOffset(
      segment.points[2], segment.points[3], amount
    )
    const p2a = e[0],
      p3 = e[1]
    let p1 = lineIntersection(
      p0,
      p1a,
      p1b,
      p2b
    )

    p1 = p1 ?? p1a
    let p2 = lineIntersection(
      p2a,
      p3,
      p1b,
      p2b
    )

    p2 = p2 ?? p2a

    return new PolynomialBezier(
      p0, p1, p2, p3
    )
  },

  offsetSegmentSplit = (segment: PolynomialBezier, amount: number) => {
    /*
    We split each bezier segment into smaller pieces based
    on inflection points, this ensures the control point
    polygon is convex.

    (A cubic bezier can have none, one, or two inflection points)
  */
    const flex = segment.inflectionPoints()
    let left: PolynomialBezier,
      right: PolynomialBezier,
      split: PolynomialBezier[]

    if (flex.length === 0) {
      return [offsetSegment(segment, amount)]
    }

    if (flex.length === 1 || floatEqual(flex[1], 1)) {
      split = segment.split(flex[0])
      left = split[0]
      right = split[1]

      return [offsetSegment(left, amount), offsetSegment(right, amount)]
    }

    split = segment.split(flex[0])
    left = split[0]
    const t = (flex[1] - flex[0]) / (1 - flex[0])

    split = split[1].split(t)
    const mid = split[0]

    right = split[1]

    return [
      offsetSegment(left, amount),
      offsetSegment(mid, amount),
      offsetSegment(right, amount),
    ]
  },
  getIntersection = (a: PolynomialBezier, b: PolynomialBezier) => {
    const intersect = a.intersections(b)

    if (intersect.length > 0 && floatEqual(intersect[0][0], 1)) {
      intersect.shift()
    }

    if (intersect.length > 0) {
      return intersect[0]
    }

    return null
  },
  pruneSegmentIntersection = (a: PolynomialBezier[], b: PolynomialBezier[]) => {
    const outa = [...a],
      outb = [...b]
    let intersect = getIntersection(a[a.length - 1], b[0])

    if (intersect) {
      outa[a.length - 1] = a[a.length - 1].split(intersect[0])[0]
      outb[0] = b[0].split(intersect[1])[1]
    }
    if (a.length > 1 && b.length > 1) {
      intersect = getIntersection(a[0], b[b.length - 1])
      if (intersect) {
        return [
          [a[0].split(intersect[0])[0]], [b[b.length - 1].split(intersect[1])[1]],
        ]
      }
    }

    return [outa, outb]
  },
  pruneIntersections = (segments: PolynomialBezier[][]) => {
    let e

    for (let i = 1; i < segments.length; i++) {
      e = pruneSegmentIntersection(segments[i - 1], segments[i])
      segments[i - 1] = e[0]
      segments[i] = e[1]
    }

    if (segments.length > 1) {
      e = pruneSegmentIntersection(segments[segments.length - 1], segments[0])
      segments[segments.length - 1] = e[0]
      segments[0] = e[1]
    }

    return segments
  }

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
    const outputBezier = newElement() as ShapePath

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