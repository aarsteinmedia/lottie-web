import CompExpressionInterface from '@/utils/expressions/CompInterface';
import EffectsExpressionInterface from '@/utils/expressions/EffectInterface';
import FootageInterface from '@/utils/expressions/FootageInterface';
import LayerExpressionInterface from '@/utils/expressions/LayerInterface';
import ShapeExpressionInterface from '@/utils/expressions/shapes/ShapeInterface';
import TextExpressionInterface from '@/utils/expressions/TextInterface';
declare const interfaces: {
    comp: typeof CompExpressionInterface;
    effects: typeof EffectsExpressionInterface;
    footage: typeof FootageInterface;
    layer: typeof LayerExpressionInterface;
    shape: typeof ShapeExpressionInterface;
    text: typeof TextExpressionInterface;
};
declare function getInterface(type: keyof typeof interfaces): typeof CompExpressionInterface | typeof TextExpressionInterface | typeof ShapeExpressionInterface | typeof FootageInterface | typeof LayerExpressionInterface | typeof EffectsExpressionInterface;
export default getInterface;
