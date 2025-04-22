import type ShapeElement from '@/elements/helpers/shapes/ShapeElement'
import type { CVStyleElement, Shape } from '@/types'

import ShapeTransformManager from '@/elements/helpers/shapes/ShapeTransformManager'
import SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import { ShapeType } from '@/enums'
import ShapePropertyFactory, {
  type ShapeProperty,
} from '@/utils/shapes/ShapeProperty'

export default class CVShapeData {
  _isAnimated?: boolean
  sh: ShapeProperty | null
  styledShapes: CVShapeData[]
  tr: number[]
  transforms: ReturnType<
    typeof ShapeTransformManager.prototype.addTransformSequence
  >
  trNodes: any[] = []
  constructor(
    element: ShapeElement,
    data: Shape,
    styles: CVStyleElement[],
    transformsManager: ShapeTransformManager
  ) {
    this.styledShapes = []
    this.tr = [0, 0, 0, 0, 0, 0]
    let ty = 4
    switch (data.ty) {
      case ShapeType.Rectangle:
        ty = 5
        break
      case ShapeType.Ellipse:
        ty = 6
        break
      case ShapeType.PolygonStar:
        ty = 7
    }
    this.sh = ShapePropertyFactory.getShapeProp(
      element,
      data,
      ty
    ) as ShapeProperty
    const { length } = styles
    let styledShape
    for (let i = 0; i < length; i++) {
      if (!styles[i].closed) {
        styledShape = {
          transforms: transformsManager.addTransformSequence(
            styles[i].transforms
          ),
          trNodes: [],
        } as unknown as CVShapeData
        this.styledShapes?.push(styledShape)
        styles[i].elements.push(styledShape)
      }
    }
    const { setAsAnimated } = SVGShapeData.prototype
    this.setAsAnimated = setAsAnimated
  }
  setAsAnimated() {
    throw new Error(
      `${this.constructor.name}: Method setAsAnimated is not implemented`
    )
  }
}
