import type {
  ElementInterfaceIntersect,
  Vector2,
  VectorProperty,
} from '@/types'
import type {
  MultiDimensionalProperty,
  NoProperty,
  ValueProperty,
} from '@/utils/Properties'

import { degToRads } from '@/utils'
import PropertyFactory from '@/utils/PropertyFactory'
import TextSelectorProperty from '@/utils/text/TextSelectorProperty'

export default class TextAnimatorDataProperty {
  a?: {
    a: ValueProperty | NoProperty
    fb: ValueProperty | NoProperty
    fc: ValueProperty | NoProperty
    fh: ValueProperty | NoProperty
    fs: ValueProperty | NoProperty
    o: ValueProperty | NoProperty
    p: MultiDimensionalProperty<Vector2> | NoProperty
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
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.a as unknown as VectorProperty,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fb: textAnimatorAnimatables?.fb
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fb as unknown as VectorProperty,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      fc: textAnimatorAnimatables?.fc
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fc as unknown as VectorProperty,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fh: textAnimatorAnimatables?.fh
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fh as unknown as VectorProperty,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fs: textAnimatorAnimatables?.fs
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fs as unknown as VectorProperty,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      o: textAnimatorAnimatables?.o
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.o as unknown as VectorProperty,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      p: textAnimatorAnimatables?.p
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.p as unknown as VectorProperty,
            1,
            0,
            container
          ) as MultiDimensionalProperty<Vector2>)
        : defaultData,
      r: textAnimatorAnimatables?.r
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.r as unknown as VectorProperty,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      rx: textAnimatorAnimatables?.rx
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.rx as unknown as VectorProperty,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      ry: textAnimatorAnimatables?.ry
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.ry as unknown as VectorProperty,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      s: textAnimatorAnimatables?.s
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.s as unknown as VectorProperty,
            1,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      sa: textAnimatorAnimatables?.sa
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sa as unknown as VectorProperty,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      sc: textAnimatorAnimatables?.sc
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sc as unknown as VectorProperty,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      sk: textAnimatorAnimatables?.sk
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sk as unknown as VectorProperty,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      sw: textAnimatorAnimatables?.sw
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sw as unknown as VectorProperty,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      t: textAnimatorAnimatables?.t
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.t as unknown as VectorProperty,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
    }

    this.s = new TextSelectorProperty(elem, animatorProps?.s as any)
    ;(this.s as any).t = (animatorProps as any)?.s?.t
  }
}
