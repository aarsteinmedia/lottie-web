import type { ExpressionInterfaces } from '@/types'

import CompExpressionInterface from '@/utils/expressions/CompInterface'
import EffectInterface from '@/utils/expressions/EffectInterface'
import FootageInterface from '@/utils/expressions/FootageInterface'
import LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import ShapeExpressionInterface from '@/utils/expressions/ShapeInterface'
import TextExpressionInterface from '@/utils/expressions/TextInterface'

const interfaces: ExpressionInterfaces = {
  comp: CompExpressionInterface,
  effects: EffectInterface,
  footage: FootageInterface,
  layer: LayerExpressionInterface,
  shape: ShapeExpressionInterface,
  text: TextExpressionInterface,
}

export default function getInterface(type: keyof ExpressionInterfaces) {
  return interfaces[type] || null
}

export { interfaces }
