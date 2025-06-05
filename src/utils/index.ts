import type {
  AnimationDirection,
  Constructor,
  IntersectData,
  SVGGeometry,
  Vector2,
  Vector3,
  Vector4,
} from '@/types'
import type Matrix from '@/utils/Matrix'
import type ShapePath from '@/utils/shapes/ShapePath'

import { roundCorner } from '@/utils/helpers/constants'
import { getIDPrefix } from '@/utils/helpers/prefix'
import PolynomialBezier from '@/utils/PolynomialBezier'

/**
 * Exported functions that are also used locally.
 */
export const degToRads = Math.PI / 180,
  hueToRGB = (
    p: number, q: number, tFromProps: number
  ) => {
    let t = tFromProps

    if (t < 0) {
      t++
    }
    if (t > 1) {
      t -= 1
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
      return q
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6
    }

    return p
  },
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
  floatEqual = (a: number, b: number) =>
    Math.abs(a - b) * 100000 <= Math.min(Math.abs(a), Math.abs(b)),
  floatZero = (f: number) => Math.abs(f) <= 0.00001,
  isServer = () => !(typeof window !== 'undefined' && window.document),
  parsePayloadLines = (payload: string) => {
    const lines = payload.split('\r\n'),
      keys: Record<string, string> = {},
      { length } = lines
    let keysCount = 0

    for (let i = 0; i < length; i++) {
      const line = lines[i].split(':')

      if (line.length === 2) {
        keys[line[0]] = line[1].trim()
        keysCount++
      }
    }
    if (keysCount === 0) {
      throw new Error('Could not parse markers')
    }

    return keys
  },
  pointEqual = (p1: Vector2, p2: Vector2) =>
    floatEqual(p1[0], p2[0]) && floatEqual(p1[1], p2[1]),
  polarOffset = (
    p: Vector2, angle: number, length: number
  ): Vector2 => [
    p[0] + Math.cos(angle) * length, p[1] - Math.sin(angle) * length,
  ]

/**
 * Functions that are only used locally.
 */
const boxIntersect = (b1: SVGGeometry, b2: SVGGeometry) =>
    Math.abs(b1.cx - b2.cx) * 2 < b1.width + b2.width &&
    Math.abs(b1.cy - b2.cy) * 2 < b1.height + b2.height,
  crossProduct = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],
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
  getPerpendicularVector = (pt1: Vector2, pt2: Vector2) => {
    const vector = [pt2[0] - pt1[0], pt2[1] - pt1[1]],
      rot = -Math.PI * 0.5,
      rotatedVector = [
        Math.cos(rot) * vector[0] - Math.sin(rot) * vector[1], Math.sin(rot) * vector[0] + Math.cos(rot) * vector[1],
      ]

    return rotatedVector
  },
  HSVtoRGB = (
    h: number, s: number, v: number
  ): Vector3 => {
    let r = 0,
      g = 0,
      b = 0
    const i = Math.floor(h * 6),
      f = h * 6 - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0: {
        r = v
        g = t
        b = p
        break
      }
      case 1: {
        r = q
        g = v
        b = p
        break
      }
      case 2: {
        r = p
        g = v
        b = t
        break
      }
      case 3: {
        r = p
        g = q
        b = v
        break
      }
      case 4: {
        r = t
        g = p
        b = v
        break
      }
      case 5: {
        r = v
        g = p
        b = q
        break
      }
      default: {
        break
      }
    }

    return [r,
      g,
      b]
  },
  lerp = (
    p0: number, p1: number, amount: number
  ) =>
    p0 * (1 - amount) + p1 * amount,
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
  offsetSegment = (segment: { points: Vector2[] }, amount: number) => {
    let e: Vector2[]

    e = linearOffset(
      segment.points[0], segment.points[1], amount
    )
    const p0: Vector2 = e[0]
    const p1a = e[1]

    e = linearOffset(
      segment.points[1], segment.points[2], amount
    )
    const p1b = e[0]
    const p2b = e[1]

    e = linearOffset(
      segment.points[2], segment.points[3], amount
    )
    const p2a = e[0]
    const p3 = e[1]
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
  pointDistance = (p1: Vector2, p2: Vector2) =>
    Math.hypot(p1[0] - p2[0], p1[1] - p2[1]),
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
  rgbToHSV = (
    r: number, g: number, b: number
  ): Vector3 => {
    const max = Math.max(
        r, g, b
      ),
      min = Math.min(
        r, g, b
      ),
      d = max - min
    let h = 0
    const s = max === 0 ? 0 : d / max,
      v = max / 255

    switch (max) {
      case min: {
        h = 0
        break
      }
      case r: {
        h = g - b + d * (g < b ? 6 : 0)
        h /= 6 * d
        break
      }
      case g: {
        h = b - r + d * 2
        h /= 6 * d
        break
      }
      case b: {
        h = r - g + d * 4
        h /= 6 * d
        break
      }
      default: {
        break
      }
    }

    return [h,
      s,
      v]
  },
  splitData = (data: IntersectData) => {
    const split = data.bez.split(0.5)

    return [
      intersectData(
        split[0], data.t1, data.t
      ), intersectData(
        split[1], data.t, data.t2
      ),
    ]
  }

/**
 * Exported functions.
 */
export const addBrightnessToRGB = (color: Vector3, offset: number) => {
    const hsv = rgbToHSV(
      color[0] * 255, color[1] * 255, color[2] * 255
    )

    hsv[2] += offset
    if (hsv[2] > 1) {
      hsv[2] = 1
    } else if (hsv[2] < 0) {
      hsv[2] = 0
    }

    return HSVtoRGB(
      hsv[0], hsv[1], hsv[2]
    )
  },
  addHueToRGB = (color: Vector3, offset: number): Vector3 => {
    const hsv = rgbToHSV(
      color[0] * 255, color[1] * 255, color[2] * 255
    )

    hsv[0] += offset / 360
    if (hsv[0] > 1) {
      hsv[0] -= 1
    } else if (hsv[0] < 0) {
      hsv[0]++
    }

    return HSVtoRGB(
      hsv[0], hsv[1], hsv[2]
    )
  },
  addSaturationToRGB = (color: Vector3, offset: number) => {
    const hsv = rgbToHSV(
      color[0] * 255, color[1] * 255, color[2] * 255
    )

    hsv[1] += offset
    if (hsv[1] > 1) {
      hsv[1] = 1
    } else if (hsv[1] <= 0) {
      hsv[1] = 0
    }

    return HSVtoRGB(
      hsv[0], hsv[1], hsv[2]
    )
  },
  buildShapeString = (
    pathNodes: ShapePath,
    length: number,
    closed: boolean,
    mat: Matrix
  ) => {
    if (length === 0) {
      return ''
    }
    const _o = pathNodes.o,
      _i = pathNodes.i,
      _v = pathNodes.v
    let i,
      shapeString = ` M${mat.applyToPointStringified(_v[0][0], _v[0][1])}`

    for (i = 1; i < length; i++) {
      shapeString += ` C${mat.applyToPointStringified(_o[i - 1][0],
        _o[i - 1][1])} ${mat.applyToPointStringified(_i[i][0],
        _i[i][1])} ${mat.applyToPointStringified(_v[i][0], _v[i][1])}`
    }
    if (closed && length) {
      shapeString += ` C${mat.applyToPointStringified(_o[i - 1][0],
        _o[i - 1][1])} ${mat.applyToPointStringified(_i[0][0],
        _i[0][1])} ${mat.applyToPointStringified(_v[0][0], _v[0][1])}`
      shapeString += 'z'
    }

    return shapeString
  },
  createElementID = (function () {
    let _count = 0

    return () => {
      _count++

      return `${getIDPrefix()}__lottie_element_${_count}`
    }
  }()),
  clamp = (
    n: number, minFromProps = 0, maxFromProps = 100
  ) => {
    let min = minFromProps,
      max = maxFromProps

    if (min > max) {
      const mm = max

      max = min
      min = mm
    }

    return Math.min(Math.max(n, min), max)
  },
  createQuaternion = (values: Vector3): Vector4 => {
    const heading = values[0] * degToRads,
      attitude = values[1] * degToRads,
      bank = values[2] * degToRads,
      c1 = Math.cos(heading / 2),
      c2 = Math.cos(attitude / 2),
      c3 = Math.cos(bank / 2),
      s1 = Math.sin(heading / 2),
      s2 = Math.sin(attitude / 2),
      s3 = Math.sin(bank / 2),
      w = c1 * c2 * c3 - s1 * s2 * s3,
      x = s1 * s2 * c3 + c1 * c2 * s3,
      y = s1 * c2 * c3 + c1 * s2 * s3,
      z = c1 * s2 * c3 - s1 * c2 * s3

    return [x,
      y,
      z,
      w]
  },
  extendPrototype = (sources: Constructor[], destination: Constructor) => {
    const { length } = sources
    let sourcePrototype: Record<string, unknown>

    for (let i = 0; i < length; i++) {
      sourcePrototype = sources[i].prototype
      const properties = Object.getOwnPropertyNames(sourcePrototype),
        { length: jLen } = properties

      for (let j = 0; j < jLen; j++) {
        if (properties[j] === 'constructor') {
          continue
        }
        if (Object.hasOwn(sourcePrototype, properties[j])) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          destination.prototype[properties[j]] = sourcePrototype[properties[j]]
        }
      }
    }
  },
  getDescriptor = (object: unknown, prop: PropertyKey) => {
    return Object.getOwnPropertyDescriptor(object, prop)
  },
  getProjectingAngle = (path: ShapePath, cur: number) => {
    const prevIndex = cur === 0 ? path.length() - 1 : cur - 1,
      nextIndex = (cur + 1) % path.length(),
      prevPoint = path.v[prevIndex],
      nextPoint = path.v[nextIndex],
      pVector = getPerpendicularVector(prevPoint, nextPoint)

    return Math.atan2(0, 1) - Math.atan2(pVector[1], pVector[0])
  },
  hslToRgb = (val: number[]): Vector4 => {
    const h = val[0],
      s = val[1],
      l = val[2]

    let r, g, b

    if (s === 0) {
      r = l // achromatic
      b = l // achromatic
      g = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hueToRGB(
        p, q, h + 1 / 3
      )
      g = hueToRGB(
        p, q, h
      )
      b = hueToRGB(
        p, q, h - 1 / 3
      )
    }

    return [r,
      g,
      b,
      val[3]]
  },
  inBrowser = () => typeof navigator !== 'undefined',
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
    const d1s = splitData(d1)
    const d2s = splitData(d2)

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
  isArray = <T>(input: unknown): input is T[] => {
    return Symbol.iterator in Object(input) && (input as unknown[]).length > 0
  },
  /** Check if value is array. Made to work with typed arrays as well as regular. */
  isArrayOfNum = (input: unknown): input is number[] => {
    return isArray(input) &&
      typeof input[0] === 'number'
  },
  isDeclaration = (str: string) => {
    return str === 'var' || str === 'let' || str === 'const'
  },
  isSafari = (): boolean => {
    const isTrue = inBrowser()
      ? /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent)
      : false

    return isTrue
  },
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
  lerpPoint = (
    p0: Vector2, p1: Vector2, amount: number
  ): Vector2 => [
    lerp(
      p0[0], p1[0], amount
    ), lerp(
      p0[1], p1[1], amount
    ),
  ],
  logPrototype = (sources: Constructor[], destination?: Constructor) => {
    const combinedPrototypes: {
        name: string
        prop: string
      }[] = [],
      { length } = sources

    let sourcePrototype: Record<string, unknown>

    const destinationProperties = Object.getOwnPropertyNames(destination?.prototype as Record<string, unknown> | undefined ?? {})

    for (let i = length - 1; i >= 0; i--) {
      sourcePrototype = sources[i].prototype

      const { name } = sources[i],
        properties = Object.getOwnPropertyNames(sourcePrototype),
        { length: jLen } = properties

      for (let j = 0; j < jLen; j++) {
        if (
          properties[j] === 'constructor' ||
          combinedPrototypes.some(({ prop }) => prop === properties[j]) ||
          destinationProperties.includes(properties[j])
        ) {
          continue
        }
        combinedPrototypes.push({
          name,
          prop: properties[j]
        })
      }
    }

    console.debug(combinedPrototypes)
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
  polynomialCoefficients = (
    p0: number, p1: number, p2: number, p3: number
  ) => [
    -p0 + 3 * p1 - 3 * p2 + p3,
    3 * p0 - 6 * p1 + 3 * p2,
    -3 * p0 + 3 * p1,
    p0,
  ],
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
  },
  quadRoots = (
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
  quaternionToEuler = (out: Vector3, quat: Vector4) => {
    const qx = quat[0],
      qy = quat[1],
      qz = quat[2],
      qw = quat[3],
      heading = Math.atan2(2 * qy * qw - 2 * qx * qz,
        1 - 2 * qy * qy - 2 * qz * qz),
      attitude = Math.asin(2 * qx * qy + 2 * qz * qw),
      bank = Math.atan2(2 * qx * qw - 2 * qy * qz,
        1 - 2 * qx * qx - 2 * qz * qz)

    out[0] = heading / degToRads
    out[1] = attitude / degToRads
    out[2] = bank / degToRads
  },
  rgbToHex = (
    rVal: number, gVal: number, bVal: number
  ) => {
    const colorMap: string[] = []
    let hex

    for (let i = 0; i < 256; i++) {
      hex = i.toString(16)
      colorMap[i] = hex.length === 1 ? `0${hex}` : hex
    }

    let r = rVal,
      g = gVal,
      b = bVal

    if (rVal < 0) {
      r = 0
    }
    if (gVal < 0) {
      g = 0
    }
    if (bVal < 0) {
      b = 0
    }

    return `#${colorMap[r]}${colorMap[g]}${colorMap[b]}`
  },
  rgbToHsl = (val: Vector4) => {
    const r = val[0],
      g = val[1],
      b = val[2],
      max = Math.max(
        r, g, b
      ),
      min = Math.min(
        r, g, b
      )
    let h = 0,
      s
    const l = (max + min) / 2

    if (max === min) {
      h = 0 // achromatic
      s = 0 // achromatic
    } else {
      const d = max - min

      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: {
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        }
        case g: {
          h = (b - r) / d + 2
          break
        }
        case b: {
          h = (r - g) / d + 4
          break
        }
        default: {
          break
        }
      }
      h /= 6
    }

    return [h,
      s,
      l,
      val[3]]
  },
  setPoint = (
    outputBezier: ShapePath,
    point: Vector2,
    angle: number,
    direction: AnimationDirection,
    amplitude: number,
    outAmplitude: number,
    inAmplitude: number
  ) => {
    const angO = angle - Math.PI / 2
    const angI = angle + Math.PI / 2
    const px = point[0] + Math.cos(angle) * direction * amplitude
    const py = point[1] - Math.sin(angle) * direction * amplitude

    outputBezier.setTripleAt(
      px,
      py,
      px + Math.cos(angO) * outAmplitude,
      py - Math.sin(angO) * outAmplitude,
      px + Math.cos(angI) * inAmplitude,
      py - Math.sin(angI) * inAmplitude,
      outputBezier.length()
    )
  },
  singlePoint = (p: Vector2) => new PolynomialBezier(
    p, p, p, p, false
  ),
  /**
   * Based on Toji's https://github.com/toji/gl-matrix/.
   */
  slerp = (
    a: Vector4, b: Vector4, t: number
  ): Vector4 => {
    const out: Vector4 = [0,
        0,
        0,
        0],
      ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3]
    let bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3],
      /**
       *
       */
      omega,
      cosom: number,
      sinom,
      scale0,
      scale1

    cosom = ax * bx + ay * by + az * bz + aw * bw
    if (cosom < 0.0) {
      cosom = -cosom
      bx = -bx
      by = -by
      bz = -bz
      bw = -bw
    }
    if (1.0 - cosom > 0.000001) {
      omega = Math.acos(cosom)
      sinom = Math.sin(omega)
      scale0 = Math.sin((1.0 - t) * omega) / sinom
      scale1 = Math.sin(t * omega) / sinom
    } else {
      scale0 = 1.0 - t
      scale1 = t
    }
    out[0] = scale0 * ax + scale1 * bx
    out[1] = scale0 * ay + scale1 * by
    out[2] = scale0 * az + scale1 * bz
    out[3] = scale0 * aw + scale1 * bw

    return out
  },
  styleDiv = (element: HTMLElement | SVGSVGElement) => {
    element.style.position = 'absolute'
    element.style.top = '0'
    element.style.left = '0'
    element.style.display = 'block'
    element.style.transformOrigin = '0 0'
    element.style.backfaceVisibility = 'visible'
    element.style.transformStyle = 'preserve-3d'
  }
