import type { Matrix } from '@/utils/Matrix'
import type { ShapePath } from '@/utils/shapes/ShapePath'

export function buildShapeString(
  pathNodes: ShapePath,
  length: number,
  closed: boolean,
  mat: Matrix
) {
  if (length === 0) {
    return ''
  }
  const _o = pathNodes.o,
    _i = pathNodes.i,
    _v = pathNodes.v
  let i,
    shapeString = ` M${mat.applyToPointStringified(_v[0]?.[0] ?? 0, _v[0]?.[1] ?? 0)}`

  for (i = 1; i < length; i++) {
    shapeString += ` C${mat.applyToPointStringified(_o[i - 1]?.[0] ?? 0,
      _o[i - 1]?.[1] ?? 0)} ${mat.applyToPointStringified(_i[i]?.[0] ?? 0,
      _i[i]?.[1] ?? 0)} ${mat.applyToPointStringified(_v[i]?.[0] ?? 0, _v[i]?.[1] ?? 0)}`
  }
  if (closed && length) {
    shapeString += ` C${mat.applyToPointStringified(_o[i - 1]?.[0] ?? 0,
      _o[i - 1]?.[1] ?? 0)} ${mat.applyToPointStringified(_i[0]?.[0] ?? 0,
      _i[0]?.[1] ?? 0)} ${mat.applyToPointStringified(_v[0]?.[0] ?? 0, _v[0]?.[1] ?? 0)}`
    shapeString += 'z'
  }

  return shapeString
}