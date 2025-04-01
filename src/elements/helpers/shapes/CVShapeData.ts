import type ShapeElement from '@/elements/helpers/shapes/ShapeElement'
import type { Shape } from '@/types'

import SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import { getShapeProp } from '@/utils/shapes/ShapeProperty'

export default class CVShapeData {
  constructor(element: ShapeElement, data: Shape, styles, transformsManager) {
    this.styledShapes = []
    this.tr = [0, 0, 0, 0, 0, 0]
    let ty = 4

    switch (data.ty) {
      case 'rc':
        ty = 5
        break
      case 'el':
        ty = 6
        break
      case 'sr':
        ty = 7
    }

    this.sh = getShapeProp(element, data, ty)
    const { length } = styles
    let styledShape
    for (let i = 0; i < length; i++) {
      if (!styles[i].closed) {
        styledShape = {
          transforms: transformsManager.addTransformSequence(
            styles[i].transforms
          ),
          trNodes: [],
        }
        this.styledShapes.push(styledShape)
        styles[i].elements.push(styledShape)
      }
    }
    this.setAsAnimated = new SVGShapeData().setAsAnimated
  }
  setAsAnimated() {
    throw new Error(
      `${this.constructor.name}: Method setAsAnimated is not implemented`
    )
  }
}
