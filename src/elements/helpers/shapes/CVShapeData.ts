import type CVShapeElement from '@/elements/canvas/CVShapeElement'
import type ShapeTransformManager from '@/elements/helpers/shapes/ShapeTransformManager'
import type { CVStyleElement, Shape } from '@/types'

import ShapeData from '@/elements/helpers/shapes/ShapeData'
import { ShapeType } from '@/utils/enums'
import ShapePropertyFactory, { type ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'

export default class CVShapeData extends ShapeData {
  constructor(
    element: CVShapeElement,
    data: Shape,
    styles: CVStyleElement[],
    transformsManager: ShapeTransformManager
  ) {
    super()
    this.styledShapes = []
    this.tr = [0,
      0,
      0,
      0,
      0,
      0]
    let ty

    switch (data.ty) {
      case ShapeType.Rectangle: {
        ty = 5
        break
      }
      case ShapeType.Ellipse: {
        ty = 6
        break
      }
      case ShapeType.PolygonStar: {
        ty = 7
        break
      }
      default: {
        ty = 4
      }
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          transforms: transformsManager.addTransformSequence(styles[i].transforms as any),
          trNodes: [],
        } as unknown as CVShapeData
        this.styledShapes.push(styledShape)
        styles[i].elements.push(styledShape)
      }
    }
  }
}
