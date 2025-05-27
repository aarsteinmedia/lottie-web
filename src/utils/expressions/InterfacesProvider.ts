import CompExpressionInterface from './CompInterface'
import EffectsExpressionInterface from './EffectInterface'
import FootageInterface from './FootageInterface'
import LayerExpressionInterface from './LayerInterface'
import ShapeExpressionInterface from './ShapeInterface'
import TextExpressionInterface from './TextInterface'

const interfaces = {
  comp: CompExpressionInterface,
  effects: EffectsExpressionInterface,
  footage: FootageInterface,
  layer: LayerExpressionInterface,
  shape: ShapeExpressionInterface,
  text: TextExpressionInterface,
}

function getInterface(type) {
  return interfaces[type] || null
}

export default getInterface
