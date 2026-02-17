// @ts-nocheck
import type { SegmentLength, Vector2 } from '@/types'
import type { ShapePath } from '@/utils/shapes/ShapePath'

import Bezier from '@/utils/Bezier'
import expressionHelpers from '@/utils/expressions/expressionHelpers'
import { createSizedArray } from '@/utils/helpers/arrays'
import { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'

export abstract class ShapeExpressions extends ShapeProperty {
  _segmentsLength?: SegmentLength
  override getValueAtTime = expressionHelpers.getStaticValueAtTime
  override setGroupProperty = expressionHelpers.setGroupProperty

  inTangents(time: number) {
    return this.vertices('i', time)
  }

  isClosed() {
    return Boolean(this.v?.c)
  }

  normalOnPath(perc: number, time: number) {
    return this.vectorOnPath(
      perc, time, 'normal'
    )
  }

  outTangents(time: number) {
    return this.vertices('o', time)
  }

  pointOnPath(perc: number, time?: number) {
    let shapePath = this.v

    if (time !== undefined) {
      shapePath = this.getValueAtTime(time, 0) as ShapePath
    }
    if (!this._segmentsLength && shapePath) {
      this._segmentsLength = Bezier.getSegmentsLength(shapePath)
    }

    const segmentsLength = this._segmentsLength,
      { lengths } = segmentsLength ?? { lengths: [] },
      lengthPos = (segmentsLength?.totalLength ?? 0) * perc

    let i = 0
    const len = lengths.length
    let accumulatedLength = 0
    let pt

    while (i < len) {
      if (accumulatedLength + lengths[i].addedLength > lengthPos) {
        const initIndex = i
        const endIndex = shapePath?.c && i === len - 1 ? 0 : i + 1
        const segmentPerc = (lengthPos - accumulatedLength) / lengths[i].addedLength

        if (shapePath) {
          pt = Bezier.getPointInSegment(
            shapePath.v[initIndex], shapePath.v[endIndex], shapePath.o[initIndex], shapePath.i[endIndex], segmentPerc, lengths[i]
          )
        }

        break
      }
      accumulatedLength += lengths[i].addedLength
      i++
    }
    if (shapePath) {
      pt = pt ?? (shapePath.c ? [shapePath.v[0][0], shapePath.v[0][1]] : [shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1]])
    }

    return pt
  }

  points(time: number) {
    return this.vertices('v', time)
  }

  tangentOnPath(perc: number, time: number) {
    return this.vectorOnPath(
      perc, time, 'tangent'
    )
  }

  vectorOnPath(
    percFromProps: number, time: number, vectorType: string
  ) {
    let perc = percFromProps

    // perc doesn't use triple equality because it can be a Number object as well as a primitive.
    if (perc == 1) { // eslint-disable-line eqeqeq
      perc = Number(this.v?.c)
    } else if (perc == 0) { // eslint-disable-line eqeqeq
      perc = 0.999
    }
    const pt1 = this.pointOnPath(perc, time) ?? []
    const pt2 = this.pointOnPath(perc + 0.001, time) ?? []
    const xLength = pt2[0] - pt1[0]
    const yLength = pt2[1] - pt1[1]
    const magnitude = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2))

    if (magnitude === 0) {
      return [0, 0]
    }
    const unitVector = vectorType === 'tangent' ? [xLength / magnitude, yLength / magnitude] : [-yLength / magnitude, xLength / magnitude]

    return unitVector
  }

  vertices(prop: keyof ShapePath, time?: number) {
    if (this.k) {
      this.getValue()
    }
    let shapePath = this.v

    if (time !== undefined) {
      shapePath = this.getValueAtTime(time, 0) as ShapePath
    }

    const len = shapePath?._length ?? 0
    const vertices = shapePath?.[prop] as Vector2[]
    const points = shapePath?.v as Vector2[]
    const arr = createSizedArray(len)

    for (let i = 0; i < len; i += 1) {
      if (prop === 'i' || prop === 'o') {
        arr[i] = [vertices[i][0] - points[i][0], vertices[i][1] - points[i][1]]
      } else {
        arr[i] = [vertices[i][0], vertices[i][1]]
      }
    }

    return arr
  }
}