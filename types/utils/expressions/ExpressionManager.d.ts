import type { ElementInterfaceIntersect, ExpressionProperty } from '../../types';
import type { KeyframedValueProperty } from '../../utils/properties/KeyframedValueProperty';
declare function initiateExpression(this: KeyframedValueProperty, elem: ElementInterfaceIntersect, data: ExpressionProperty, property: KeyframedValueProperty): (this: KeyframedValueProperty, _value: number) => unknown;
declare function resetFrame(): void;
declare const ExpressionManager: {
    initiateExpression: typeof initiateExpression;
    resetFrame: typeof resetFrame;
};
export default ExpressionManager;
