import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier'

import { ElementInterfaceIntersect } from '@/types'

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

/**
 *
 */
export function getModifier<T extends ShapeModifierInterface>(
  nm: string,
  _elem?: ElementInterfaceIntersect,
  _data?: unknown
) {
  return new modifiers[nm]() as T
}

/**
 *
 */
export function registerModifier(nm: string, factory: Modifier) {
  if (!modifiers[nm]) {
    modifiers[nm] = factory
  }
}

const modifiers: { [key: string]: Modifier } = {}
