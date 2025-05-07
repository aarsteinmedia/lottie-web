import type ShapeElement from '@/elements/helpers/shapes/ShapeElement'
import type SVGFillStyleData from '@/elements/helpers/shapes/SVGFillStyleData'
import type SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData'
import type SVGGradientStrokeStyleData from '@/elements/helpers/shapes/SVGGradientStrokeStyleData'
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type SVGStrokeStyleData from '@/elements/helpers/shapes/SVGStrokeStyleData'
import type SVGTransformData from '@/elements/helpers/shapes/SVGTransformData'
import type { Shape } from '@/types'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'
import type ShapePath from '@/utils/shapes/ShapePath'

import { buildShapeString } from '@/utils'
import { ShapeType } from '@/utils/enums'
import Matrix from '@/utils/Matrix'

const _identityMatrix = new Matrix(),
  _matrixHelper = new Matrix()

export function createRenderFunction(data: Shape) {
  switch (data.ty) {
    case ShapeType.Fill: {
      return renderFill
    }
    case ShapeType.GradientFill: {
      return renderGradient
    }
    case ShapeType.GradientStroke: {
      return renderGradientStroke
    }
    case ShapeType.Stroke: {
      return renderStroke
    }
    case ShapeType.Path:
    case ShapeType.Ellipse:
    case ShapeType.Rectangle:
    case ShapeType.PolygonStar: {
      return renderPath
    }
    case ShapeType.Transform: {
      return renderContentTransform
    }
    case ShapeType.NoStyle: {
      return renderNoop
    }
    default: {
      return null
    }
  }
}

function renderContentTransform(
  _: Shape,
  itemData?: SVGTransformData,
  isFirstFrame?: boolean
) {
  if (!itemData) {
    throw new Error('SVGElementsRenderer: Method renderContetTransform is missing data')
  }
  if (isFirstFrame || itemData.transform.op._mdf) {
    itemData.transform.container.setAttribute('opacity',
      `${itemData.transform.op.v}`)
  }
  if (isFirstFrame || itemData.transform.mProps._mdf) {
    itemData.transform.container.setAttribute('transform',
      itemData.transform.mProps.v.to2dCSS())
  }
}

function renderFill(
  _: Shape,
  itemData?: SVGFillStyleData,
  isFirstFrame?: boolean
) {
  if (!itemData) {
    throw new Error('SVGElementsRenderer: Method renderFill is missing data')
  }
  const styleElem = itemData.style

  if (itemData.c?.v && (itemData.c._mdf || isFirstFrame)) {
    styleElem.pElem.setAttribute('fill',
      `rgb(${Math.floor(itemData.c.v[0])},${Math.floor(itemData.c.v[1])},${itemData.c.v[2]})`)
  }
  if (itemData.o?._mdf || isFirstFrame) {
    styleElem.pElem.setAttribute('fill-opacity', `${itemData.o?.v}`)
  }
}

function renderGradient(
  styleData: Shape,
  itemData?: SVGGradientFillStyleData,
  isFirstFrame?: boolean
) {
  if (!itemData) {
    throw new Error('SVGElementsRenderer: Method renderGradient is missing data')
  }
  const gfill = itemData.gf,
    hasOpacity = itemData.g?._hasOpacity,
    pt1 = itemData.s?.v ?? [0, 0],
    pt2 = itemData.e?.v ?? [0, 0]

  if (itemData.o?._mdf || isFirstFrame) {
    const attr = styleData.ty === ShapeType.GradientFill ? 'fill-opacity' : 'stroke-opacity'

    itemData.style?.pElem.setAttribute(attr, `${itemData.o?.v}`)
  }
  if (itemData.s?._mdf || isFirstFrame) {
    const attr1 = styleData.t === 1 ? 'x1' : 'cx',
      attr2 = attr1 === 'x1' ? 'y1' : 'cy'

    gfill?.setAttribute(attr1, `${pt1[0]}`)
    gfill?.setAttribute(attr2, `${pt1[1]}`)
    if (hasOpacity && !itemData.g?._collapsable) {
      itemData.of?.setAttribute(attr1, `${pt1[0]}`)
      itemData.of?.setAttribute(attr2, `${pt1[1]}`)
    }
  }
  let stops: SVGStopElement[], stop: SVGStopElement

  if (itemData.g && (itemData.g._cmdf || isFirstFrame)) {
    stops = itemData.cst
    const cValues = itemData.g.c,
      { length } = stops

    for (let i = 0; i < length; i++) {
      stop = stops[i]
      stop.setAttribute('offset', `${cValues[i * 4]}%`)
      stop.setAttribute('stop-color',
        `rgb(${cValues[i * 4 + 1]},${cValues[i * 4 + 2]},${cValues[i * 4 + 3]})`)
    }
  }
  if (hasOpacity && itemData.g && (itemData.g._omdf || isFirstFrame)) {
    const oValues = itemData.g.o

    if (itemData.g._collapsable) {
      stops = itemData.cst
    } else {
      stops = itemData.ost
    }
    const { length: sLen } = stops

    for (let i = 0; i < sLen; i++) {
      stop = stops[i]
      if (!itemData.g._collapsable) {
        stop.setAttribute('offset', `${oValues[i * 2]}%`)
      }
      stop.setAttribute('stop-opacity', `${oValues[i * 2 + 1]}`)
    }
  }
  if (styleData.t === 1) {
    if (itemData.e?._mdf || isFirstFrame) {
      gfill?.setAttribute('x2', `${pt2[0]}`)
      gfill?.setAttribute('y2', `${pt2[1]}`)
      if (hasOpacity && !itemData.g?._collapsable) {
        itemData.of?.setAttribute('x2', `${pt2[0]}`)
        itemData.of?.setAttribute('y2', `${pt2[1]}`)
      }
    }
  } else {
    let rad = 0

    if (itemData.s?._mdf || itemData.e?._mdf || isFirstFrame) {
      rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2))
      gfill?.setAttribute('r', `${rad}`)
      if (hasOpacity && !itemData.g?._collapsable) {
        itemData.of?.setAttribute('r', `${rad}`)
      }
    }
    if (
      itemData.e?._mdf ||
      itemData.h?._mdf ||
      itemData.a?._mdf ||
      isFirstFrame
    ) {
      if (!rad) {
        rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2))
      }
      const ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0])

      let percent = Number(itemData.h?.v)

      if (percent >= 1) {
        percent = 0.99
      } else if (percent <= -1) {
        percent = -0.99
      }
      const dist = rad * percent,
        x = Math.cos(ang + Number(itemData.a?.v)) * dist + pt1[0],
        y = Math.sin(ang + Number(itemData.a?.v)) * dist + pt1[1]

      gfill?.setAttribute('fx', `${x}`)
      gfill?.setAttribute('fy', `${y}`)
      if (hasOpacity && !itemData.g?._collapsable) {
        itemData.of?.setAttribute('fx', `${x}`)
        itemData.of?.setAttribute('fy', `${y}`)
      }
    }
    // gfill.setAttribute('fy','200');
  }
}

function renderGradientStroke(
  styleData: Shape,
  itemData?: SVGGradientStrokeStyleData | SVGGradientFillStyleData,
  isFirstFrame?: boolean
) {
  renderGradient(
    styleData, itemData, isFirstFrame
  )
  renderStroke(
    styleData, itemData as SVGGradientStrokeStyleData, isFirstFrame
  )
}

function renderNoop(_: Shape) {
  // Pass Through
}

function renderPath(
  styleData: Shape,
  itemData?: SVGShapeData,
  isFirstFrame?: boolean
) {
  if (!itemData) {
    throw new Error('SVGElementsRenderer: Method renderPath is missing data')
  }
  let pathStringTransformed, shouldRedraw: boolean, pathNodes: ShapePath | undefined
  const {
      caches, lvl, sh, styles, transformers
    } = itemData,
    { length } = styles
  let paths: ShapeElement | ShapeCollection | undefined,
    mat: Matrix,
    iterations,
    k

  for (let i = 0; i < length; i++) {
    shouldRedraw = sh._mdf || Boolean(isFirstFrame)
    if (styles[i].lvl < lvl) {
      mat = _matrixHelper.reset()
      iterations = lvl - styles[i].lvl
      k = transformers.length - 1
      while (!shouldRedraw && iterations > 0) {
        shouldRedraw = transformers[k].mProps._mdf || shouldRedraw
        iterations--
        k--
      }
      if (shouldRedraw) {
        iterations = lvl - styles[i].lvl
        k = transformers.length - 1
        while (iterations > 0) {
          mat.multiply(transformers[k].mProps.v)
          iterations--
          k--
        }
      }
    } else {
      mat = _identityMatrix
    }
    paths = sh.paths
    const jLen = paths?._length || 0

    if (shouldRedraw) {
      pathStringTransformed = ''
      for (let j = 0; j < jLen; j++) {
        pathNodes = paths?.shapes[j]
        if (pathNodes?._length) {
          pathStringTransformed += buildShapeString(
            pathNodes,
            pathNodes._length,
            Boolean(pathNodes.c),
            mat
          )
        }
      }
      caches[i] = pathStringTransformed
    } else {
      pathStringTransformed = caches[i]
    }
    styles[i].d += styleData.hd === true ? '' : pathStringTransformed
    styles[i]._mdf = shouldRedraw || styles[i]._mdf
  }
}


function renderStroke(
  _: Shape,
  itemData?: SVGStrokeStyleData | SVGGradientStrokeStyleData,
  isFirstFrame?: boolean
) {
  if (!itemData) {
    throw new Error('SVGElementsRenderer: Method renderStroke is missing data')
  }

  const {
    c, d, o, style, w
  } = itemData

  if (d && (d._mdf || isFirstFrame) && d.dashStr) {
    style?.pElem.setAttribute('stroke-dasharray', d.dashStr)
    style?.pElem.setAttribute('stroke-dashoffset', `${d.dashoffset[0]}`)
  }
  if (c && (c._mdf || isFirstFrame)) {
    style?.pElem.setAttribute('stroke', `rgb(${  Math.floor(c.v[0])  },${  Math.floor(c.v[1])  },${  Math.floor(c.v[2])  })`)
  }
  if (o?._mdf || isFirstFrame) {
    style?.pElem.setAttribute('stroke-opacity', `${o?.v ?? 1}`)
  }
  if (w?._mdf || isFirstFrame) {
    style?.pElem.setAttribute('stroke-width', `${w?.v || 0}`)
    if (style?.msElem) {
      style.msElem.setAttribute('stroke-width', `${w?.v || 0}`)
    }
  }
}

export type CreateRenderFunction = ReturnType<typeof createRenderFunction>
