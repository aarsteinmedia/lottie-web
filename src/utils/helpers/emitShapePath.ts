import type { ShapePath } from '@/utils/shapes/ShapePath'

/**
 * Emit a ShapePath onto a canvas context in local coordinates
 * (v/o/i are absolute, matching buildShapeString).
 */
export function emitShapePath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  path: ShapePath) {
  const len = path._length

  if (len === 0) {
    return
  }

  const {
      i, o, v
    } = path,
    { c: isClosed } = path

  ctx.moveTo(v[0][0], v[0][1])

  for (let j = 1; j < len; j++) {
    ctx.bezierCurveTo(
      o[j - 1][0],
      o[j - 1][1],
      i[j][0],
      i[j][1],
      v[j][0],
      v[j][1]
    )
  }

  if (isClosed) {
    ctx.bezierCurveTo(
      o[len - 1][0],
      o[len - 1][1],
      i[0][0],
      i[0][1],
      v[0][0],
      v[0][1]
    )
    ctx.closePath()
  }
}
