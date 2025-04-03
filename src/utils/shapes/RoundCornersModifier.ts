import type {
  ElementInterfaceIntersect,
  Shape,
  Vector2,
  VectorProperty,
} from '@/types'
import type { ValueProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'

import { roundCorner } from '@/utils/getterSetter'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'
import { ShapeProperty } from '@/utils/shapes/ShapeProperty'

export default class RoundCornersModifier extends ShapeModifier {
  rd?: ValueProperty
  override initModifierProperties(
    elem: ElementInterfaceIntersect,
    data: Shape
  ) {
    this.getValue = this.processKeys
    this.rd = PropertyFactory(
      elem,
      data.r as unknown as VectorProperty, // TODO: Find out if typing is wrong
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this._isAnimated = !!this.rd?.effectsSequence.length
  }

  processPath(path: ShapePath, round: number) {
    const clonedPath = newElement<ShapePath>()
    clonedPath.c = path.c
    const len = path._length
    let currentV,
      currentI: Vector2,
      currentO: Vector2,
      closerV: Vector2,
      distance,
      newPosPerc,
      index = 0,
      vX,
      vY,
      oX,
      oY,
      iX,
      iY
    for (let i = 0; i < len; i++) {
      currentV = path.v[i]
      currentO = path.o[i]
      currentI = path.i[i]
      if (
        currentV[0] === currentO[0] &&
        currentV[1] === currentO[1] &&
        currentV[0] === currentI[0] &&
        currentV[1] === currentI[1]
      ) {
        if ((i === 0 || i === len - 1) && !path.c) {
          clonedPath.setTripleAt(
            currentV[0],
            currentV[1],
            currentO[0],
            currentO[1],
            currentI[0],
            currentI[1],
            index
          )
          /* clonedPath.v[index] = currentV;
                clonedPath.o[index] = currentO;
                clonedPath.i[index] = currentI; */
          index++
        } else {
          if (i === 0) {
            closerV = path.v[len - 1]
          } else {
            closerV = path.v[i - 1]
          }
          distance = Math.sqrt(
            Math.pow(currentV[0] - closerV[0], 2) +
              Math.pow(currentV[1] - closerV[1], 2)
          )
          newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0
          iX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc
          vX = iX
          iY = currentV[1] - (currentV[1] - closerV[1]) * newPosPerc
          vY = iY
          oX = vX - (vX - currentV[0]) * roundCorner
          oY = vY - (vY - currentV[1]) * roundCorner
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index)
          index++

          if (i === len - 1) {
            closerV = path.v[0]
          } else {
            closerV = path.v[i + 1]
          }
          distance = Math.sqrt(
            Math.pow(currentV[0] - closerV[0], 2) +
              Math.pow(currentV[1] - closerV[1], 2)
          )
          newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0
          oX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc
          vX = oX
          oY = currentV[1] + (closerV[1] - currentV[1]) * newPosPerc
          vY = oY
          iX = vX - (vX - currentV[0]) * roundCorner
          iY = vY - (vY - currentV[1]) * roundCorner
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index)
          index++
        }
      } else {
        clonedPath.setTripleAt(
          path.v[i][0],
          path.v[i][1],
          path.o[i][0],
          path.o[i][1],
          path.i[i][0],
          path.i[i][1],
          index
        )
        index++
      }
    }
    return clonedPath
  }

  processShapes(_isFirstFrame: boolean) {
    const { length } = this.shapes || [],
      rd = this.rd?.v

    if (rd !== 0) {
      let shapeData, shapePaths, localShapeCollection
      for (let i = 0; i < length; i++) {
        shapeData = this.shapes?.[i] as unknown as ShapeProperty
        localShapeCollection = shapeData.localShapeCollection
        if (!(!shapeData.shape?._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection?.releaseShapes()
          shapeData.shape!._mdf = true
          shapePaths = shapeData.shape?.paths?.shapes || []
          const jLen = shapeData.shape?.paths?._length || 0
          for (let j = 0; j < jLen; j++) {
            localShapeCollection?.addShape(
              this.processPath(shapePaths![j], rd as number)
            )
          }
        }
        shapeData.shape!.paths = shapeData.localShapeCollection
      }
    }
    if (!this.dynamicProperties?.length) {
      this._mdf = false
    }
  }
}
