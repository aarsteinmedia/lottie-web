import type {
  ElementInterfaceIntersect,
  Keyframe,
  VectorProperty,
} from '@/types'

import {
  KeyframedMultidimensionalProperty,
  KeyframedValueProperty,
  MultiDimensionalProperty,
  NoProperty,
  ValueProperty,
} from '@/utils/Properties'

/**
 *
 */
export default function PropertyFactory(
  // <T = number>
  elem: ElementInterfaceIntersect,
  dataFromProps?: any, // VectorProperty<T>,
  type?: number,
  mult?: null | number,
  container?: ElementInterfaceIntersect // ElementInterfaceIntersect | GroupEffect
) {
  let data = dataFromProps
  if (data && 'sid' in data && data.sid) {
    data = elem.globalData?.slotManager?.getProp(data as VectorProperty)
  }
  let p
  if (!(data?.k as number[]).length) {
    p = new ValueProperty(elem, data as VectorProperty, mult, container as any)
  } else if (typeof (data?.k as number[])[0] === 'number') {
    p = new MultiDimensionalProperty(
      elem as ElementInterfaceIntersect,
      data as VectorProperty<number[]>,
      mult,
      container as ElementInterfaceIntersect
    )
  } else {
    switch (type) {
      case 0:
        p = new KeyframedValueProperty(
          elem as ElementInterfaceIntersect,
          data as unknown as VectorProperty<Keyframe[]>,
          mult,
          container as ElementInterfaceIntersect
        )
        break
      case 1:
        p = new KeyframedMultidimensionalProperty(
          elem,
          data as VectorProperty<number[]>,
          mult,
          container as ElementInterfaceIntersect
        )
        break
      default:
        break
    }
  }
  if (!p) {
    p = new NoProperty()
  }
  if (p?.effectsSequence.length) {
    container?.addDynamicProperty(p)
  }
  return p
}
