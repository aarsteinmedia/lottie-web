import type {
  IntersectData, SVGGeometry, Vector2
} from '@/types'
import type { ShapePath } from '@/utils/shapes/ShapePath'

import {
  floatZero,
  pointEqual,
} from '@/utils'

const quadRoots = (
    a: number, b: number, c: number
  ) => {
  // no root
    if (a === 0) {
      return []
    }
    const s = b * b - 4 * a * c

    // Complex roots
    if (s < 0) {
      return []
    }
    const singleRoot = -b / (2 * a)

    // 1 root
    if (s === 0) {
      return [singleRoot]
    }
    const delta = Math.sqrt(s) / (2 * a)

    // 2 roots
    return [singleRoot - delta, singleRoot + delta]
  },

  polynomialCoefficients = (
    p0: number, p1: number, p2: number, p3: number
  ) => [
    -p0 + 3 * p1 - 3 * p2 + p3,
    3 * p0 - 6 * p1 + 3 * p2,
    -3 * p0 + 3 * p1,
    p0,
  ],

  lerp = (
    p0: number, p1: number, amount: number
  ) =>
    p0 * (1 - amount) + p1 * amount,

  lerpPoint = (
    p0: Vector2, p1: Vector2, amount: number
  ): Vector2 => [
    lerp(
      p0[0], p1[0], amount
    ), lerp(
      p0[1], p1[1], amount
    ),
  ],

  boxIntersect = (b1: SVGGeometry, b2: SVGGeometry) =>
    Math.abs(b1.cx - b2.cx) * 2 < b1.width + b2.width &&
    Math.abs(b1.cy - b2.cy) * 2 < b1.height + b2.height,

  intersectData = (
    bez: PolynomialBezier,
    t1: number,
    t2: number
  ): IntersectData => {
    const box = bez.boundingBox()

    return {
      bez,
      cx: box.cx,
      cy: box.cy,
      height: box.height,
      t: (t1 + t2) / 2,
      t1,
      t2,
      width: box.width,
    }
  },

  splitData = (data: IntersectData) => {
    const split = data.bez.split(0.5)

    if (!split[0] || !split[1]) {
      throw new Error('Could not set PolynomialBezier')
    }

    return [
      intersectData(
        split[0], data.t1, data.t
      ), intersectData(
        split[1], data.t, data.t2
      ),
    ]
  },

  intersectsImpl = (
    d1: IntersectData,
    d2: IntersectData,
    depth: number,
    tolerance: number,
    intersections: unknown[],
    maxRecursion: number
  ) => {
    if (!boxIntersect(d1, d2)) {
      return
    }
    if (
      depth >= maxRecursion ||
      d1.width <= tolerance &&
      d1.height <= tolerance &&
      d2.width <= tolerance &&
      d2.height <= tolerance
    ) {
      intersections.push([d1.t, d2.t])

      return
    }
    const d1s = splitData(d1),
      d2s = splitData(d2)

    if (!d1s[0] || !d1s[1] || !d2s[0] || !d2s[1]) {
      throw new Error('Could not set IntersectData')
    }

    intersectsImpl(
      d1s[0],
      d2s[0],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
    intersectsImpl(
      d1s[0],
      d2s[1],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
    intersectsImpl(
      d1s[1],
      d2s[0],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
    intersectsImpl(
      d1s[1],
      d2s[1],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
  },
  singlePoint = (p: Vector2) => new PolynomialBezier(
    p, p, p, p, false
  )

export class PolynomialBezier {
  a: Vector2
  b: Vector2
  c: Vector2
  d: Vector2
  points: [Vector2, Vector2, Vector2, Vector2]
  constructor(
    p0: Vector2,
    p1FromProps: Vector2,
    p2FromProps: Vector2,
    p3: Vector2,
    linearize?: boolean
  ) {
    let p1 = p1FromProps,
      p2 = p2FromProps

    if (linearize && pointEqual(p0, p1)) {
      p1 = lerpPoint(
        p0, p3, 1 / 3
      )
    }
    if (linearize && pointEqual(p2, p3)) {
      p2 = lerpPoint(
        p0, p3, 2 / 3
      )
    }
    const coeffx = polynomialCoefficients(
        p0[0], p1[0], p2[0], p3[0]
      ),
      coeffy = polynomialCoefficients(
        p0[1], p1[1], p2[1], p3[1]
      )

    this.a = [coeffx[0] as number, coeffy[0] as number]
    this.b = [coeffx[1] as number, coeffy[1] as number]
    this.c = [coeffx[2] as number, coeffy[2] as number]
    this.d = [coeffx[3] as number, coeffy[3] as number]
    this.points = [p0,
      p1,
      p2,
      p3]
  }

  boundingBox() {
    const bounds = this.bounds()

    return {
      bottom: bounds.y.max,
      cx: (bounds.x.max + bounds.x.min) / 2,
      cy: (bounds.y.max + bounds.y.min) / 2,
      height: bounds.y.max - bounds.y.min,
      left: bounds.x.min,
      right: bounds.x.max,
      top: bounds.y.min,
      width: bounds.x.max - bounds.x.min,
    }
  }

  bounds() {
    return {
      x: this._extrema(this, 0),
      y: this._extrema(this, 1),
    }
  }

  derivative(t: number) {
    return [
      (3 * t * this.a[0] + 2 * this.b[0]) * t + this.c[0], (3 * t * this.a[1] + 2 * this.b[1]) * t + this.c[1],
    ]
  }

  inflectionPoints() {
    const denom = this.a[1] * this.b[0] - this.a[0] * this.b[1]

    if (floatZero(denom)) {
      return []
    }
    const tcusp =
      -0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1]) / denom,
      square =
        tcusp * tcusp -
        1 / 3 * (this.b[1] * this.c[0] - this.b[0] * this.c[1]) / denom

    if (square < 0) {
      return []
    }
    const root = Math.sqrt(square)

    if (floatZero(root)) {
      if (root > 0 && root < 1) {
        return [tcusp]
      }

      return []
    }

    return [tcusp - root, tcusp + root].filter((r) => r > 0 && r < 1)
  }

  intersections(
    other: PolynomialBezier,
    toleranceFromProps?: number,
    maxRecursionFromProps?: number
  ) {
    let tolerance = toleranceFromProps,
      maxRecursion = maxRecursionFromProps

    tolerance = tolerance ?? 2
    maxRecursion = maxRecursion ?? 7
    const intersections: number[][] = []

    intersectsImpl(
      intersectData(
        this, 0, 1
      ),
      intersectData(
        other, 0, 1
      ),
      0,
      tolerance,
      intersections,
      maxRecursion
    )

    return intersections
  }

  normalAngle(t: number) {
    const p = this.derivative(t)

    return Math.atan2(p[0] ?? 0, p[1] ?? 0)
  }

  point(t: number) {
    return [
      ((this.a[0] * t + this.b[0]) * t + this.c[0]) * t + this.d[0], ((this.a[1] * t + this.b[1]) * t + this.c[1]) * t + this.d[1],
    ]
  }

  split(t: number) {
    if (t <= 0) {
      return [singlePoint(this.points[0]), this]
    }
    if (t >= 1) {
      return [this, singlePoint(this.points[this.points.length - 1] as Vector2)]
    }
    const p10 = lerpPoint(
        this.points[0], this.points[1], t
      ),
      p11 = lerpPoint(
        this.points[1], this.points[2], t
      ),
      p12 = lerpPoint(
        this.points[2], this.points[3], t
      ),
      p20 = lerpPoint(
        p10, p11, t
      ),
      p21 = lerpPoint(
        p11, p12, t
      ),
      p3 = lerpPoint(
        p20, p21, t
      )

    return [
      new PolynomialBezier(
        this.points[0], p10, p20, p3, true
      ), new PolynomialBezier(
        p3, p21, p12, this.points[3], true
      ),
    ]
  }

  tangentAngle(t: number) {
    const p = this.derivative(t)

    return Math.atan2(p[1] ?? 0, p[0] ?? 0)
  }

  private _extrema(bez: PolynomialBezier, comp: number) {
    let min = bez.points[0][comp] ?? 0,
      max = bez.points[bez.points.length - 1]?.[comp] ?? 0

    if (min > max) {
      const e = max

      max = min
      min = e
    }
    // Derivative roots to find min/max
    const f = quadRoots(
        3 * (bez.a[comp] ?? 0), 2 * (bez.b[comp] ?? 0), bez.c[comp] ?? 0
      ),
      { length } = f

    for (let i = 0; i < length; i++) {
      if ((f[i] ?? 0) <= 0 || (f[i] ?? 0) >= 1) {
        continue
      }
      const val = bez.point(f[i] ?? 0)[comp] ?? 0

      if (val < min) {
        min = val
        continue
      }

      if (val > max) {
        max = val
      }
    }

    return {
      max,
      min,
    }
  }
}

export function shapeSegment(shapePath: ShapePath, index: number) {
  const nextIndex = (index + 1) % shapePath.length()

  return new PolynomialBezier(
    shapePath.v[index] as Vector2,
    shapePath.o[index] as Vector2,
    shapePath.i[nextIndex] as Vector2,
    shapePath.v[nextIndex] as Vector2,
    true
  )
}

export function shapeSegmentInverted(shapePath: ShapePath, index: number) {
  const nextIndex = (index + 1) % shapePath.length()

  return new PolynomialBezier(
    shapePath.v[nextIndex] as Vector2,
    shapePath.i[nextIndex] as Vector2,
    shapePath.o[index] as Vector2,
    shapePath.v[index] as Vector2,
    true
  )
}
