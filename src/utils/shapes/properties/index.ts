import type { CVShapeElement } from '@/elements/canvas/CVShapeElement'
import type { HShapeElement } from '@/elements/html/HShapeElement'
import type { SVGShapeElement } from '@/elements/svg/SVGShapeElement'
import type {
  ElementInterfaceIntersect,
  Shape,
} from '@/types'

import { EllShapeProperty } from '@/utils/shapes/properties/EllShapeProperty'
import { RectShapeProperty } from '@/utils/shapes/properties/RectShapeProperty'
import { KeyframedShapeProperty, ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'
import { StarShapeProperty } from '@/utils/shapes/properties/StarShapeProperty'

function getConstructorFunction() {
  return ShapeProperty
}

function getKeyframedConstructorFunction() {
  return KeyframedShapeProperty
}

function getShapeProp(
  elem: SVGShapeElement | CVShapeElement | HShapeElement,
  data: Shape,
  type: number,
  _arr?: any[],
  _trims?: any[]
) {
  let prop = null

  switch (type) {
    case 3:
    case 4: {
      const dataProp = type === 3 ? data.pt : data.ks,
        keys = dataProp?.k

      if (keys?.length) {
        prop = new KeyframedShapeProperty(
          elem, data, type
        )
        break
      }
      prop = new ShapeProperty(
        elem, data, type
      )
      break
    }
    case 5: {
      prop = new RectShapeProperty(elem as ElementInterfaceIntersect, data)
      break
    }
    case 6: {
      prop = new EllShapeProperty(elem as ElementInterfaceIntersect, data)
      break
    }
    case 7: {
      prop = new StarShapeProperty(elem as ElementInterfaceIntersect, data)
    }
  }

  if (prop?.k) {
    elem.addDynamicProperty(prop)
  }

  return prop
}

const ShapePropertyFactory = {
  getConstructorFunction,
  getKeyframedConstructorFunction,
  getShapeProp,
}

export default ShapePropertyFactory