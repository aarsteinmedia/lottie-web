import { createNS, createTag } from '@/utils'
import { FeatureSupport } from '@/utils/FiltersFactory'

const featureSupport = new FeatureSupport(),
  id = '__lottie_element_luma_buffer'
let lumaBuffer: null | HTMLCanvasElement = null,
  lumaBufferCtx: null | CanvasRenderingContext2D = null,
  svg: null | SVGSVGElement = null

function createLumaSvgFilter() {
  const _svg = createNS<SVGSVGElement>('svg'),
    fil = createNS<SVGFilterElement>('filter'),
    matrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')

  fil.setAttribute('id', id)
  matrix.setAttribute('type', 'matrix')
  matrix.setAttribute('color-interpolation-filters', 'sRGB')
  matrix.setAttribute('values',
    '0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0, 0.3, 0.3, 0.3, 0, 0')
  fil.appendChild(matrix)
  _svg.appendChild(fil)
  _svg.setAttribute('id', `${id}_svg`)
  if (featureSupport.svgLumaHidden) {
    _svg.style.display = 'none'
  }

  return _svg
}

export function loadLumaCanvas() {
  if (lumaBuffer && lumaBufferCtx) {
    return
  }
  svg = createLumaSvgFilter()
  document.body.appendChild(svg)
  lumaBuffer = createTag<HTMLCanvasElement>('canvas')
  lumaBufferCtx = lumaBuffer.getContext('2d')
  if (lumaBufferCtx) {
    lumaBufferCtx.filter = `url(#${id})`
    lumaBufferCtx.fillStyle = 'rgba(0,0,0,0)'
    lumaBufferCtx.fillRect(
      0, 0, 1, 1
    )
  }
}

export function getLumaCanvas(canvas: HTMLCanvasElement) {
  if (!lumaBuffer || !lumaBufferCtx) {
    loadLumaCanvas()
  }
  if (!lumaBuffer || !lumaBufferCtx) {
    throw new Error('Could not create Canvas Element')
  }
  lumaBuffer.width = canvas.width
  lumaBuffer.height = canvas.height
  lumaBufferCtx.filter = `url(#${id})`

  return lumaBuffer
}

export function createCanvas(width: number, height: number) {
  if (featureSupport.offscreenCanvas) {
    return new OffscreenCanvas(width, height)
  }
  const canvas = createTag<HTMLCanvasElement>('canvas')

  canvas.width = width
  canvas.height = height

  return canvas
}

const AssetManager = {
  createCanvas,
  getLumaCanvas,
  loadLumaCanvas,
}

export default AssetManager