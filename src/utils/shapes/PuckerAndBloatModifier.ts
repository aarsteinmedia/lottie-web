import type { ElementInterfaceIntersect, Shape } from '@/types'
import type { ValueProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'

import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'
import { ShapeProperty } from '@/utils/shapes/ShapeProperty'

export default class PuckerAndBloatModifier extends ShapeModifier {
  amount?: ValueProperty
  override initModifierProperties(
    elem: ElementInterfaceIntersect,
    data: Shape
  ) {
    this.getValue = this.processKeys
    this.amount = PropertyFactory(
      elem,
      data.a,
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this._isAnimated = !!this.amount?.effectsSequence.length
  }

  processPath(path: ShapePath, amount: number) {
    const percent = amount / 100
    const centerPoint = [0, 0]
    const pathLength = path._length
    let i = 0
    for (i = 0; i < pathLength; i++) {
      centerPoint[0] += path.v[i][0]
      centerPoint[1] += path.v[i][1]
    }
    centerPoint[0] /= pathLength
    centerPoint[1] /= pathLength
    const clonedPath = newElement<ShapePath>()
    clonedPath.c = path.c
    let vX, vY, oX, oY, iX, iY
    for (i = 0; i < pathLength; i++) {
      vX = path.v[i][0] + (centerPoint[0] - path.v[i][0]) * percent
      vY = path.v[i][1] + (centerPoint[1] - path.v[i][1]) * percent
      oX = path.o[i][0] + (centerPoint[0] - path.o[i][0]) * -percent
      oY = path.o[i][1] + (centerPoint[1] - path.o[i][1]) * -percent
      iX = path.i[i][0] + (centerPoint[0] - path.i[i][0]) * -percent
      iY = path.i[i][1] + (centerPoint[1] - path.i[i][1]) * -percent
      clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, i)
    }
    return clonedPath
  }

  processShapes(_isFirstFrame: boolean) {
    const { length } = this.shapes || [],
      amount = this.amount?.v

    if (amount !== 0) {
      let shapePaths, shapeData, localShapeCollection
      for (let i = 0; i < length; i++) {
        shapeData = this.shapes?.[i] as unknown as ShapeProperty
        localShapeCollection = shapeData.localShapeCollection
        if (!(!shapeData.shape?._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection?.releaseShapes()
          shapeData.shape!._mdf = true
          shapePaths = shapeData.shape?.paths?.shapes
          const jLen = shapeData.shape?.paths?._length || 0
          for (let j = 0; j < jLen; j++) {
            localShapeCollection?.addShape(
              this.processPath(shapePaths![j], amount as number)
            )
          }
        }
        if (shapeData.localShapeCollection) {
          shapeData.shape!.paths = shapeData.localShapeCollection
        }
      }
    }
    if (!this.dynamicProperties?.length) {
      this._mdf = false
    }
  }
}
