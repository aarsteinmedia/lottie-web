import type {
  ElementInterfaceIntersect,
  ExpressionProperty,
  Keyframe,
  LottieLayer,
  VectorProperty,
} from '@/types'
import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

import KeyframedMultidimensionalProperty from '@/utils/properties/KeyframedMultidimensionalProperty'
import KeyframedValueProperty from '@/utils/properties/KeyframedValueProperty'
import MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import NoProperty from '@/utils/properties/NoProperty'
import ValueProperty from '@/utils/properties/ValueProperty'

function getProp<T = number | number[]>(
  elem: ElementInterfaceIntersect,
  dataFromProps?: VectorProperty<T> | ExpressionProperty,
  type?: number,
  mult?: null | number,
  container?: ElementInterfaceIntersect
) {
  let data = dataFromProps

  // console.log(data)
  if (data && 'sid' in data && data.sid) {
    data = elem.globalData?.slotManager?.getProp(data as unknown as LottieLayer)
  }
  let p

  if (!(data?.k as number[] | undefined)?.length) {
    p = new ValueProperty(
      elem,
      data as VectorProperty,
      mult,
      container as ElementInterfaceIntersect
    )
  } else if (typeof (data?.k as number[])[0] === 'number') {
    p = new MultiDimensionalProperty(
      elem,
      data as VectorProperty<number[]>,
      mult,
      container as ElementInterfaceIntersect
    )
  } else {
    switch (type) {
      case 0: {
        p = new KeyframedValueProperty(
          elem,
          data as VectorProperty<Keyframe[]>,
          mult,
          container as ElementInterfaceIntersect
        )
        break
      }
      case 1: {
        p = new KeyframedMultidimensionalProperty(
          elem,
          data as VectorProperty<Keyframe[]>,
          mult,
          container as ElementInterfaceIntersect
        )
        break
      }
      case undefined:
      default: {
        break
      }
    }
  }
  p = p ?? new NoProperty()
  if (p.effectsSequence.length > 0) {
    container?.addDynamicProperty(p as DynamicPropertyContainer)
  }

  return p
}

const PropertyFactory = { getProp }

export default PropertyFactory
