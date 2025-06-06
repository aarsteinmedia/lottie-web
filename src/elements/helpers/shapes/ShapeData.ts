import type CVShapeData from '@/elements/helpers/shapes/CVShapeData'
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ShapeDataInterface, SVGElementInterface, Transformer,
} from '@/types'
import type { ShapeType } from '@/utils/enums'
import type Matrix from '@/utils/Matrix'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'
import type ShapePath from '@/utils/shapes/ShapePath'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'


export default abstract class ShapeData {
  _isAnimated?: boolean
  _length?: number
  caches: string[] = []
  data?: SVGShapeData
  gr?: SVGGElement
  hd?: boolean

  it: ShapeDataInterface[] = []
  last?: ShapeCollection
  localShapeCollection?: ShapeCollection
  lStr = ''
  lvl = 0
  pathsData: ShapePath[] = []
  prevViewData: SVGElementInterface[] = []
  sh: ShapeProperty | null = null
  shape?: ShapeProperty
  style?: SVGStyleData
  styledShapes: CVShapeData[] = []
  styles: SVGStyleData[] = []
  tr: number[] = []
  transform?: Transformer
  transformers: Transformer[] = []
  transforms?: { finalTransform: Matrix }
  trNodes: any[] = []
  ty?: ShapeType

  setAsAnimated() {
    this._isAnimated = true
  }

}