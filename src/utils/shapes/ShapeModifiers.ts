import type { ElementInterfaceIntersect } from '@/types'
import type MouseModifier from '@/utils/shapes/MouseModifier'
import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier'

export type ShapeModifierInterface =
  | TrimModifier
  | PuckerAndBloatModifier
  | RepeaterModifier
  | ZigZagModifier
  | OffsetPathModifier

type Modifier =
  | typeof TrimModifier
  | typeof PuckerAndBloatModifier
  | typeof RepeaterModifier
  | typeof ZigZagModifier
  | typeof OffsetPathModifier
  | typeof MouseModifier

const Modifiers: { [key: string]: Modifier | undefined } = {}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function getModifier<T extends ShapeModifierInterface>(
  nm: string,
  _elem?: ElementInterfaceIntersect,
  _data?: unknown
) {
  if (!Modifiers[nm]) {
    throw new Error('Invalid modifier')
  }

  return new Modifiers[nm]() as T
}

export function registerModifier(nm: string, factory: Modifier) {
  Modifiers[nm] = Modifiers[nm] ?? factory
}
