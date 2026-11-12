import type {
  ElementInterfaceIntersect,
  TextRangeValue,
  Vector2,
  VectorProperty,
} from '@/types'
import type { MultiDimensionalProperty } from '@/utils/properties/MultiDimensionalProperty'
import type { NoProperty } from '@/utils/properties/NoProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { DEG_TO_RAD } from '@/utils/helpers/constants'
import PropertyFactory from '@/utils/PropertyFactory'
import { TextSelectorProperty } from '@/utils/text/TextSelectorProperty'

export class TextAnimatorDataProperty {
  a?: {
    a: ValueProperty | NoProperty
    fb: ValueProperty | NoProperty
    fc: ValueProperty | NoProperty
    fh: ValueProperty | NoProperty
    fs: ValueProperty | NoProperty
    o: ValueProperty | NoProperty
    p: MultiDimensionalProperty | NoProperty
    r: ValueProperty | NoProperty
    rx: ValueProperty | NoProperty
    ry: ValueProperty | NoProperty
    s: ValueProperty | NoProperty
    sa: ValueProperty | NoProperty
    sc: ValueProperty | NoProperty
    sk: ValueProperty | NoProperty
    sw: ValueProperty | NoProperty
    t: ValueProperty | NoProperty
  }
  s?: TextSelectorProperty
  constructor(
    elem: ElementInterfaceIntersect,
    animatorProps?: TextAnimatorDataProperty,
    container?: ElementInterfaceIntersect
  ) {
    const defaultData = { propType: false } as NoProperty,
      textAnimatorElements = animatorProps?.a,

      parseValueProperty = (prop: undefined | ValueProperty | NoProperty, val: Vector2) => {
        if (!prop) {
          return defaultData
        }

        return PropertyFactory.getProp(
          elem,
          prop as unknown as VectorProperty,
          val[0],
          val[1],
          container
        )
      }

    this.a = {
      a: parseValueProperty(textAnimatorElements?.a, [1, 0]),
      fb: parseValueProperty(textAnimatorElements?.fb, [0, 0.01]),
      fc: parseValueProperty(textAnimatorElements?.fc, [1, 0]),
      fh: parseValueProperty(textAnimatorElements?.fh, [0, 0]),
      fs: parseValueProperty(textAnimatorElements?.fs, [0, 0.01]),
      o: parseValueProperty(textAnimatorElements?.o, [0, 0.01]),
      p: parseValueProperty(textAnimatorElements?.p, [1, 0]),
      r: parseValueProperty(textAnimatorElements?.r, [0, DEG_TO_RAD]),
      rx: parseValueProperty(textAnimatorElements?.rx, [0, DEG_TO_RAD]),
      ry: parseValueProperty(textAnimatorElements?.ry, [0, DEG_TO_RAD]),
      s: parseValueProperty(textAnimatorElements?.s, [1, 0.01]),
      sa: parseValueProperty(textAnimatorElements?.sa, [0, DEG_TO_RAD]),
      sc: parseValueProperty(textAnimatorElements?.sc, [1, 0]),
      sk: parseValueProperty(textAnimatorElements?.sk, [0, DEG_TO_RAD]),
      sw: parseValueProperty(textAnimatorElements?.sw, [0, 0]),
      t: parseValueProperty(textAnimatorElements?.t, [0, 0]),
    }

    this.s = new TextSelectorProperty(elem, animatorProps?.s as unknown as TextRangeValue)
    this.s.t = animatorProps?.s?.t
  }
}
