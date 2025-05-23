import type {
  AnimationDirection,
  ElementInterfaceIntersect,
  Shape,
  Vector2,
  VectorProperty,
} from '@/types'
import type { ValueProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

import { getProjectingAngle, setPoint } from '@/utils'
import { type default as PolynomialBezier, shapeSegment } from '@/utils/PolynomialBezier'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'

function zigZagCorner(
  outputBezier: ShapePath,
  path: ShapePath,
  cur: number,
  amplitude: number,
  frequency: number,
  pointType: number,
  direction: AnimationDirection
) {
  const angle = getProjectingAngle(path, cur),
    point = path.v[cur % path._length],
    prevPoint = path.v[cur === 0 ? path._length - 1 : cur - 1],
    nextPoint = path.v[(cur + 1) % path._length],
    prevDist =
      pointType === 2
        ? Math.sqrt(Math.pow(point[0] - prevPoint[0], 2) +
          Math.pow(point[1] - prevPoint[1], 2))
        : 0,
    nextDist =
      pointType === 2
        ? Math.sqrt(Math.pow(point[0] - nextPoint[0], 2) +
          Math.pow(point[1] - nextPoint[1], 2))
        : 0

  setPoint(
    outputBezier,
    path.v[cur % path._length] || [0, 0],
    angle,
    direction,
    amplitude,
    nextDist / ((frequency + 1) * 2),
    prevDist / ((frequency + 1) * 2)
  )
}

function zigZagSegment(
  outputBezier: ShapePath,
  segment: PolynomialBezier,
  amplitude: number,
  frequency: number,
  pointType: number,
  directionFromProps: AnimationDirection
) {
  let direction = directionFromProps

  for (let i = 0; i < frequency; i++) {
    const t = (i + 1) / (frequency + 1),
      dist =
        pointType === 2
          ? Math.sqrt(Math.pow(segment.points[3][0] - segment.points[0][0], 2) +
            Math.pow(segment.points[3][1] - segment.points[0][1], 2))
          : 0,
      angle = segment.normalAngle(t),
      point = segment.point(t) as Vector2

    setPoint(
      outputBezier,
      point,
      angle,
      direction,
      amplitude,
      dist / ((frequency + 1) * 2),
      dist / ((frequency + 1) * 2)
    )

    direction = -direction as AnimationDirection
  }

  return direction
}
export default class ZigZagModifier extends ShapeModifier {
  amplitude?: ValueProperty
  frequency?: ValueProperty
  pointsType?: ValueProperty

  override initModifierProperties(elem: ElementInterfaceIntersect,
    data: Shape) {
    this.getValue = this.processKeys
    this.amplitude = PropertyFactory.getProp(
      elem,
      data.s,
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.frequency = PropertyFactory.getProp(
      elem,
      data.r as unknown as VectorProperty, // TODO: Fix typing
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.pointsType = PropertyFactory.getProp(
      elem,
      data.pt as unknown as VectorProperty, // TODO: Fix typing
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this._isAnimated =
      this.amplitude.effectsSequence.length > 0 ||
      this.frequency.effectsSequence.length > 0 ||
      this.pointsType.effectsSequence.length > 0
  }

  processPath(
    path: ShapePath,
    amplitude: number,
    frequency: number,
    pointType: number
  ) {
    let count = path._length
    const clonedPath = newElement<ShapePath>()

    clonedPath.c = path.c

    if (!path.c) {
      count -= 1
    }

    if (count === 0) {
      return clonedPath
    }

    let direction: AnimationDirection = -1,
      segment = shapeSegment(path, 0)

    zigZagCorner(
      clonedPath,
      path,
      0,
      amplitude,
      frequency,
      pointType,
      direction
    )

    for (let i = 0; i < count; i++) {
      direction = zigZagSegment(
        clonedPath,
        segment,
        amplitude,
        frequency,
        pointType,
        -direction as AnimationDirection
      )

      if (i === count - 1 && !path.c) {
        segment = null as unknown as PolynomialBezier
      } else {
        segment = shapeSegment(path, (i + 1) % count)
      }

      zigZagCorner(
        clonedPath,
        path,
        i + 1,
        amplitude,
        frequency,
        pointType,
        direction
      )
    }

    return clonedPath
  }

  processShapes(_isFirstFrame: boolean) {
    // if (!this.shapes) {
    //   throw new Error(`${this.constructor.name}: shapes is not initialized`)
    // }

    const amplitude = Number(this.amplitude?.v),
      frequency = Math.max(0, Math.round(Number(this.frequency?.v))),
      pointType = Number(this.pointsType?.v)

    if (amplitude !== 0) {
      let shapeData, localShapeCollection, shapePaths
      const { length } = this.shapes

      for (let i = 0; i < length; i++) {
        shapeData = (this.shapes as unknown as ShapeProperty[])[i]
        localShapeCollection = shapeData.localShapeCollection
        if (!(!shapeData.shape?._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection?.releaseShapes()
          if (shapeData.shape) {
            shapeData.shape._mdf = true
          }

          shapePaths = shapeData.shape?.paths?.shapes ?? []
          const { _length } = shapeData.shape?.paths ?? { _length: 0 }

          for (let j = 0; j < _length; j++) {
            localShapeCollection?.addShape(this.processPath(
              shapePaths[j], amplitude, frequency, pointType
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
