import type { ElementInterfaceIntersect } from '../../types';
import type ExpressionManager from '../../utils/expressions/ExpressionManager';
export default class TextExpressionInterface {
    elem: ElementInterfaceIntersect;
    initiateExpression?: typeof ExpressionManager;
    get sourceText(): {
        value?: string;
        style?: {
            fillColor: number[];
        };
    };
    private _sourceText?;
    constructor(elem: ElementInterfaceIntersect);
    _thisLayerFunction(name: string): {
        value?: string;
        style?: {
            fillColor: number[];
        };
    } | null;
}
