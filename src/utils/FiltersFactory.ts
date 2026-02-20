import { createNS } from '@/utils/helpers/svgElements'

function createAlphaToLuminanceFilter() {
  const feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')

  feColorMatrix.setAttribute('type', 'matrix')
  feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB')
  feColorMatrix.setAttribute('values',
    '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1')

  return feColorMatrix
}

function createFilter(filId: string, skipCoordinates?: boolean) {
  const fil = createNS<SVGFilterElement>('filter')

  fil.id = filId
  if (!skipCoordinates) {
    fil.setAttribute('filterUnits', 'objectBoundingBox')
    fil.setAttribute('x', '0%')
    fil.setAttribute('y', '0%')
    fil.setAttribute('width', '100%')
    fil.setAttribute('height', '100%')
  }

  return fil
}

const FiltersFactory = {
  createAlphaToLuminanceFilter,
  createFilter
}

// eslint-disable-next-line import/no-default-export
export default FiltersFactory
