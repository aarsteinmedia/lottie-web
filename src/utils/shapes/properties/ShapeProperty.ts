
import type { CVShapeElement } from '@/elements/canvas/CVShapeElement'
import type { HShapeElement } from '@/elements/html/HShapeElement'
import type { SVGShapeElement } from '@/elements/svg/SVGShapeElement'
import type {
  Caching,
  ElementInterfaceIntersect,
  Keyframe,
  Shape,
} from '@/types'
import type { ShapePath } from '@/utils/shapes/ShapePath'

import { PropType } from '@/utils/enums'
import { initialDefaultFrame } from '@/utils/helpers/constants'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'
import { clone, newElement } from '@/utils/pooling/ShapePool'
import { ShapeBaseProperty } from '@/utils/shapes/properties/ShapeBaseProperty'

export class ShapeProperty extends ShapeBaseProperty {
  ix?: number
  pathsData?: ShapePath[] | ShapePath
  shape?: {
    _mdf?: boolean
    paths?: undefined | {
      shapes: ShapePath[]
      _length: number
    }
  }
  totalShapeLength?: number
  x?: boolean
  constructor(
    elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number
  ) {
    super()
    this.propType = PropType.Shape
    this.comp = elem.comp
    this.container = elem as ElementInterfaceIntersect
    this.elem = elem
    this.data = data
    this.k = false
    this.kf = false
    this._mdf = false
    const pathData = type === 3 ? data.pt?.k : data.ks?.k

    if (!pathData) {
      throw new Error(`${this.constructor.name}: Could now get Path Data`)
    }
    this.v = clone(pathData as ShapePath)
    this.pv = clone(this.v)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.effectsSequence = []
    this.getValue = this.processEffectsSequence
  }
}

export class KeyframedShapeProperty extends ShapeBaseProperty {
  public lastFrame
  constructor(
    elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number
  ) {
    super()
    this.data = data
    this.propType = PropType.Shape
    this.comp = elem.comp
    this.elem = elem
    this.container = elem as ElementInterfaceIntersect
    this.offsetTime = elem.data?.st || 0
    this.keyframes = (type === 3
      ? data.pt?.k
      : data.ks?.k ?? []) as unknown as Keyframe[]
    this.keyframesMetadata = []
    this.k = true
    this.kf = true
    const shapePaths = this.keyframes[0]?.s as ShapePath[] | undefined,
      { length } = shapePaths?.[0]?.i ?? []

    this.v = newElement() as ShapePath
    this.v.setPathData(Boolean(shapePaths?.[0]?.c), length)
    this.pv = clone(this.v)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.lastFrame = initialDefaultFrame
    this._caching = {
      lastFrame: initialDefaultFrame,
      lastIndex: 0
    } as Caching
    // @ts-expect-error
    this.effectsSequence = [this.interpolateShapeCurrentTime.bind(this)]
    this.getValue = this.processEffectsSequence
  }
}
