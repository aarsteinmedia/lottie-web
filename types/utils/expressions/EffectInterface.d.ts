import type { ElementInterfaceIntersect } from '../../types';
import type LayerExpressionInterface from '../../utils/expressions/LayerInterface';
declare const EffectsExpressionInterface: {
    createEffectsInterface: (elem: ElementInterfaceIntersect, propertyGroup: LayerExpressionInterface) => ((name: string | number) => any) | null;
};
export default EffectsExpressionInterface;
