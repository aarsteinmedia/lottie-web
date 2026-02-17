import type {
  ElementInterfaceIntersect,
  VectorProperty,
} from '@/types'
import type { MultiDimensionalProperty } from '@/utils/properties/MultiDimensionalProperty'
import type { NoProperty } from '@/utils/properties/NoProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { degToRads } from '@/utils/helpers/constants'
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
      textAnimatorAnimatables = animatorProps?.a

    this.a = {
      a: textAnimatorAnimatables?.a
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.a as unknown as VectorProperty,
          1,
          0,
          container
        ) as ValueProperty)
        : defaultData,
      fb: textAnimatorAnimatables?.fb
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.fb as unknown as VectorProperty,
          0,
          0.01,
          container
        ) as ValueProperty)
        : defaultData,
      fc: textAnimatorAnimatables?.fc
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.fc as unknown as VectorProperty,
          1,
          0,
          container
        ) as ValueProperty)
        : defaultData,
      fh: textAnimatorAnimatables?.fh
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.fh as unknown as VectorProperty,
          0,
          0,
          container
        ) as ValueProperty)
        : defaultData,
      fs: textAnimatorAnimatables?.fs
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.fs as unknown as VectorProperty,
          0,
          0.01,
          container
        ) as ValueProperty)
        : defaultData,
      o: textAnimatorAnimatables?.o
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.o as unknown as VectorProperty,
          0,
          0.01,
          container
        ) as ValueProperty)
        : defaultData,
      p: textAnimatorAnimatables?.p
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.p as unknown as VectorProperty,
          1,
          0,
          container
        ) as MultiDimensionalProperty)
        : defaultData,
      r: textAnimatorAnimatables?.r
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.r as unknown as VectorProperty,
          0,
          degToRads,
          container
        ) as ValueProperty)
        : defaultData,
      rx: textAnimatorAnimatables?.rx
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.rx as unknown as VectorProperty,
          0,
          degToRads,
          container
        ) as ValueProperty)
        : defaultData,
      ry: textAnimatorAnimatables?.ry
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.ry as unknown as VectorProperty,
          0,
          degToRads,
          container
        ) as ValueProperty)
        : defaultData,
      s: textAnimatorAnimatables?.s
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.s as unknown as VectorProperty,
          1,
          0.01,
          container
        ) as ValueProperty)
        : defaultData,
      sa: textAnimatorAnimatables?.sa
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.sa as unknown as VectorProperty,
          0,
          degToRads,
          container
        ) as ValueProperty)
        : defaultData,
      sc: textAnimatorAnimatables?.sc
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.sc as unknown as VectorProperty,
          1,
          0,
          container
        ) as ValueProperty)
        : defaultData,
      sk: textAnimatorAnimatables?.sk
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.sk as unknown as VectorProperty,
          0,
          degToRads,
          container
        ) as ValueProperty)
        : defaultData,
      sw: textAnimatorAnimatables?.sw
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.sw as unknown as VectorProperty,
          0,
          0,
          container
        ) as ValueProperty)
        : defaultData,
      t: textAnimatorAnimatables?.t
        ? (PropertyFactory.getProp(
          elem,
          textAnimatorAnimatables.t as unknown as VectorProperty,
          0,
          0,
          container
        ) as ValueProperty)
        : defaultData,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    this.s = new TextSelectorProperty(elem, animatorProps?.s as any)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ; (this.s as any).t = (animatorProps as any)?.s?.t
  }
}
