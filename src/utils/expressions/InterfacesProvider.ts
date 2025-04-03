import CompExpressionInterface from '@/utils/expressions/CompInterface'
import { createEffectsInterface } from '@/utils/expressions/EffectInterface'
import FootageInterface from '@/utils/expressions/FootageInterface'
import LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import ShapeExpressionInterface from '@/utils/expressions/ShapeInterface'
import TextExpressionInterface from '@/utils/expressions/TextInterface'

const interfaces = {
  comp: CompExpressionInterface,
  effects: { createEffectsInterface },
  footage: FootageInterface,
  layer: LayerExpressionInterface,
  shape: ShapeExpressionInterface,
  text: TextExpressionInterface,
}

export default function getInterface(type: keyof typeof interfaces) {
  return interfaces[type] || null
}
