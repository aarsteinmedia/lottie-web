import { CompExpressionInterface } from '@/utils/expressions/CompInterface'
import { EffectsExpressionInterface } from '@/utils/expressions/EffectInterface'
import { FootageInterface } from '@/utils/expressions/FootageInterface'
import { LayerExpressionInterface } from '@/utils/expressions/LayerInterface'
import { ShapeExpressionInterface } from '@/utils/expressions/shapes/ShapeInterface'
import { TextExpressionInterface } from '@/utils/expressions/TextInterface'

const interfaces = {
  comp: CompExpressionInterface,
  effects: EffectsExpressionInterface,
  footage: FootageInterface,
  layer: LayerExpressionInterface,
  shape: ShapeExpressionInterface,
  text: TextExpressionInterface,
}

// type ExpressionInterface = typeof interfaces[keyof typeof interfaces]

export function getInterface(type: keyof typeof interfaces) {
  return interfaces[type]
}
