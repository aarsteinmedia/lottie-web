/* eslint-disable @typescript-eslint/naming-convention */
import type {
  BezierLength, SegmentLength, Vector2
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import { ArrayType } from '@/enums'
import { getDefaultCurveSegments } from '@/utils/getterSetter'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'
import { bezierLengthPool, segmentsLengthPool } from '@/utils/pooling'

const bezierSegmentPoints = createTypedArray(ArrayType.Float32, 8)

export function buildBezierData(
  pt1: Vector2,
  pt2: Vector2,
  pt3: Vector2,
  pt4: Vector2
) {
  const storedData: { [key: string]: BezierData | undefined } = {},
    bezierName = `${pt1[0]}_${pt1[1]}_${pt2[0]}_${pt2[1]}_${pt3[0]}_${
      pt3[1]
    }_${pt4[0]}_${pt4[1]}`.replaceAll('.', 'p')

  if (!storedData[bezierName]) {
    let curveSegments = getDefaultCurveSegments(),
      ptCoord,
      perc,
      addedLength = 0,
      ptDistance,
      point,
      lastPoint = null

    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      pt1.length === 2 &&
      (pt1[0] !== pt2[0] || pt1[1] !== pt2[1]) &&
      pointOnLine2D(
        pt1[0],
        pt1[1],
        pt2[0],
        pt2[1],
        pt1[0] + pt3[0],
        pt1[1] + pt3[1]
      ) &&
      pointOnLine2D(
        pt1[0],
        pt1[1],
        pt2[0],
        pt2[1],
        pt2[0] + pt4[0],
        pt2[1] + pt4[1]
      )
    ) {
      curveSegments = 2
    }
    const bezierData = new BezierData(curveSegments),
      { length } = pt3

    for (let k = 0; k < curveSegments; k++) {
      point = createSizedArray(length) as Vector2
      perc = k / (curveSegments - 1)
      ptDistance = 0
      for (let i = 0; i < length; i++) {
        ptCoord =
          Math.pow(1 - perc, 3) * pt1[i] +
          3 * Math.pow(1 - perc, 2) * perc * (pt1[i] + pt3[i]) +
          3 * (1 - perc) * Math.pow(perc, 2) * (pt2[i] + pt4[i]) +
          Math.pow(perc, 3) * pt2[i]
        point[i] = ptCoord
        if (lastPoint !== null) {
          ptDistance += Math.pow(Number(point[i]) - Number(lastPoint[i]), 2)
        }
      }
      ptDistance = Math.sqrt(ptDistance)
      addedLength += ptDistance
      bezierData.points[k] = new PointData(ptDistance, point)
      lastPoint = point
    }
    bezierData.segmentLength = addedLength
    storedData[bezierName] = bezierData
  }

  return storedData[bezierName]
}

export function getNewSegment(
  pt1: number[],
  pt2: number[],
  pt3: number[],
  pt4: number[],
  startPercFromProps: number,
  endPercFromProps: number,
  bezierData: ReturnType<typeof getBezierLength>
) {
  let startPerc = startPercFromProps,
    endPerc = endPercFromProps

  if (startPerc < 0) {
    startPerc = 0
  } else if (startPerc > 1) {
    startPerc = 1
  }
  const t0 = getDistancePerc(startPerc, bezierData)

  endPerc = endPerc > 1 ? 1 : endPerc
  const t1 = getDistancePerc(endPerc, bezierData),
    u0 = 1 - t0,
    u1 = 1 - t1,
    u0u0u0 = u0 * u0 * u0,
    t0u0u0_3 = t0 * u0 * u0 * 3,
    t0t0u0_3 = t0 * t0 * u0 * 3,
    t0t0t0 = t0 * t0 * t0,
    /**
     *
     */
    u0u0u1 = u0 * u0 * u1,
    t0u0u1_3 = t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1,
    t0t0u1_3 = t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1,
    t0t0t1 = t0 * t0 * t1,
    /**
     *
     */
    u0u1u1 = u0 * u1 * u1,
    t0u1u1_3 = t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1,
    t0t1u1_3 = t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1,
    t0t1t1 = t0 * t1 * t1,
    /**
     *
     */
    u1u1u1 = u1 * u1 * u1,
    t1u1u1_3 = t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1,
    t1t1u1_3 = t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1,
    t1t1t1 = t1 * t1 * t1,
    { length } = pt1

  for (let i = 0; i < length; i++) {
    bezierSegmentPoints[i * 4] =
      Math.round((u0u0u0 * pt1[i] +
          t0u0u0_3 * pt3[i] +
          t0t0u0_3 * pt4[i] +
          t0t0t0 * pt2[i]) *
          1000) / 1000
    bezierSegmentPoints[i * 4 + 1] =
      Math.round((u0u0u1 * pt1[i] +
          t0u0u1_3 * pt3[i] +
          t0t0u1_3 * pt4[i] +
          t0t0t1 * pt2[i]) *
          1000) / 1000
    bezierSegmentPoints[i * 4 + 2] =
      Math.round((u0u1u1 * pt1[i] +
          t0u1u1_3 * pt3[i] +
          t0t1u1_3 * pt4[i] +
          t0t1t1 * pt2[i]) *
          1000) / 1000
    bezierSegmentPoints[i * 4 + 3] =
      Math.round((u1u1u1 * pt1[i] +
          t1u1u1_3 * pt3[i] +
          t1t1u1_3 * pt4[i] +
          t1t1t1 * pt2[i]) *
          1000) / 1000
  }

  return bezierSegmentPoints
}

export function getPointInSegment(
  pt1: Vector2,
  pt2: Vector2,
  pt3: Vector2,
  pt4: Vector2,
  percent: number,
  bezierData: ReturnType<typeof getBezierLength>
): Vector2 {
  const t1 = getDistancePerc(percent, bezierData),
    u1 = 1 - t1,
    ptX =
      Math.round((u1 * u1 * u1 * pt1[0] +
          (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[0] +
          (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[0] +
          t1 * t1 * t1 * pt2[0]) *
          1000) / 1000,
    ptY =
      Math.round((u1 * u1 * u1 * pt1[1] +
          (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[1] +
          (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[1] +
          t1 * t1 * t1 * pt2[1]) *
          1000) / 1000

  return [ptX, ptY]
}

export function getSegmentsLength(shapeData: ShapePath): SegmentLength {
  const segmentsLength: {
      lengths: BezierLength[]
      totalLength: number
    } = segmentsLengthPool.newElement(),
    isClosed = shapeData.c,
    pathV = shapeData.v,
    pathO = shapeData.o,
    pathI = shapeData.i
  let i
  const len = shapeData._length || 0,
    { lengths } = segmentsLength
  let totalLength = 0

  for (i = 0; i < len - 1; i++) {
    lengths[i] = getBezierLength(
      pathV[i],
      pathV[i + 1],
      pathO[i],
      pathI[i + 1]
    )
    totalLength += lengths[i].addedLength
  }
  if (isClosed && len) {
    lengths[i] = getBezierLength(
      pathV[i],
      pathV[0],
      pathO[i],
      pathI[0]
    )
    totalLength += lengths[i].addedLength
  }
  segmentsLength.totalLength = totalLength

  return segmentsLength
}

export function pointOnLine2D(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  const det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1

  return det1 > -0.001 && det1 < 0.001
}

export function pointOnLine3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
  x3: number,
  y3: number,
  z3: number
) {
  if (z1 === 0 && z2 === 0 && z3 === 0) {
    return pointOnLine2D(
      x1, y1, x2, y2, x3, y3
    )
  }
  const dist1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)),
    dist2 = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2)),
    dist3 = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2))
  let diffDist: number

  if (dist1 > dist2) {
    if (dist1 > dist3) {
      diffDist = dist1 - dist2 - dist3
    } else {
      diffDist = dist3 - dist2 - dist1
    }
  } else if (dist3 > dist2) {
    diffDist = dist3 - dist2 - dist1
  } else {
    diffDist = dist2 - dist1 - dist3
  }

  return diffDist > -0.0001 && diffDist < 0.0001
}

function getBezierLength(
  pt1: Vector2,
  pt2: Vector2,
  pt3: Vector2,
  pt4: Vector2
): BezierLength {
  const curveSegments = getDefaultCurveSegments()
  let ptCoord,
    perc,
    addedLength = 0,
    ptDistance
  const point = [],
    lastPoint: (number | null)[] = [],
    lengthData: {
      percents: number[]
      lengths: number[]
      addedLength: number
    } = bezierLengthPool.newElement(),
    len = pt3.length

  for (let k = 0; k < curveSegments; k++) {
    perc = k / (curveSegments - 1)
    ptDistance = 0
    for (let i = 0; i < len; i++) {
      ptCoord =
        Math.pow(1 - perc, 3) * pt1[i] +
        3 * Math.pow(1 - perc, 2) * perc * pt3[i] +
        3 * (1 - perc) * Math.pow(perc, 2) * pt4[i] +
        Math.pow(perc, 3) * pt2[i]
      point[i] = ptCoord
      if (lastPoint[i] !== null) {
        ptDistance += Math.pow(point[i] - (lastPoint[i] || 0), 2)
      }
      lastPoint[i] = point[i]
    }
    if (ptDistance) {
      ptDistance = Math.sqrt(ptDistance)
      addedLength += ptDistance
    }
    lengthData.percents[k] = perc
    lengthData.lengths[k] = addedLength
  }
  lengthData.addedLength = addedLength

  return lengthData
}

function getDistancePerc(perc: number,
  {
    addedLength, lengths, percents
  }: ReturnType<typeof getBezierLength>) {
  const { length } = percents
  let initPos = Math.floor((length - 1) * perc)
  const lengthPos = perc * addedLength
  let lPerc = 0

  if (
    initPos === length - 1 ||
    initPos === 0 ||
    lengthPos === lengths[initPos]
  ) {
    return percents[initPos]
  }
  const dir = lengths[initPos] > lengthPos ? -1 : 1
  let shouldIterate = true

  while (shouldIterate) {
    if (lengths[initPos] <= lengthPos && lengths[initPos + 1] > lengthPos) {
      lPerc =
        (lengthPos - lengths[initPos]) /
        (lengths[initPos + 1] - lengths[initPos])
      shouldIterate = false
    } else {
      initPos += dir
    }
    if (initPos < 0 || initPos >= length - 1) {
      // FIX for TypedArrays that don't store floating point values with enough accuracy
      if (initPos === length - 1) {
        return percents[initPos]
      }
      shouldIterate = false
    }
  }

  return percents[initPos] + (percents[initPos + 1] - percents[initPos]) * lPerc
}

export class BezierData {
  points: {
    point: number[];
    partialLength: number
  }[]
  segmentLength: number
  constructor(length: number) {
    this.segmentLength = 0
    this.points = Array.from({ length })
  }
}

class PointData {
  partialLength: number
  point: Vector2
  constructor(partial: number, point: Vector2) {
    this.partialLength = partial
    this.point = point
  }
}
