import type { LottieLayer, Shape } from '@/types'

import { ShapeType } from '@/utils/enums'

/**
 * Shrinks matte alpha to drop anti-aliased fringe at filled vector matte edges.
 * Not for image mattes (e.g. BlackCat texture).
 */
export function erodeMatteAlpha(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null,
  radius = 1) {
  if (!ctx || radius <= 0) {
    return
  }
  morphMatteAlpha(
    ctx, radius, 'erode'
  )
}

/**
 * Expands matte alpha so stroke-only mattes cover sibling closed fills.
 */
export function dilateMatteAlpha(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null,
  radius = 2) {
  if (!ctx || radius <= 0) {
    return
  }
  morphMatteAlpha(
    ctx, radius, 'dilate'
  )
}

/**
 * Td matte layers that only stroke paths (no fills) — e.g. MenuAnimation comp_2.
 */
export function isStrokeOnlyMatteLayer(layer: LottieLayer) {
  if (layer.td !== 1 || layer.shapes.length === 0) {
    return false
  }
  let hasFill = false,
    hasStroke = false

  const walk = (shapes: Shape[]) => {
    for (const shape of shapes) {
      if (shape.ty === ShapeType.Group && shape.it) {
        walk(shape.it)
      }
      if (shape.ty === ShapeType.Fill || shape.ty === ShapeType.GradientFill) {
        hasFill = true
      }
      if (shape.ty === ShapeType.Stroke || shape.ty === ShapeType.GradientStroke) {
        hasStroke = true
      }
    }
  }

  walk(layer.shapes)

  return hasStroke && !hasFill
}

function morphMatteAlpha(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  radius: number,
  mode: 'dilate' | 'erode'
) {
  const { height, width } = ctx.canvas,
    src = ctx.getImageData(
      0, 0, width, height
    ),
    dst = ctx.createImageData(width, height),
    s = src.data,
    d = dst.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let alpha = mode === 'dilate' ? 0 : 255

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx,
            ny = y + dy

          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            if (mode === 'erode') {
              alpha = 0
            }
            continue
          }
          const sample = s[(ny * width + nx) * 4 + 3]

          if (mode === 'dilate') {
            alpha = Math.max(alpha, sample)
          } else {
            alpha = Math.min(alpha, sample)
          }
        }
      }
      const i = (y * width + x) * 4

      d[i] = 255
      d[i + 1] = 255
      d[i + 2] = 255
      d[i + 3] = alpha
    }
  }
  ctx.putImageData(
    dst, 0, 0
  )
}
