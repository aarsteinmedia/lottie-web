import type { CompElementInterface, ElementInterfaceIntersect, Vector3 } from '../../types';
import type ShapePath from '../../utils/shapes/ShapePath';
import type TextSelectorProperty from '../../utils/text/TextSelectorProperty';
import ExpressionManager from '../../utils/expressions/ExpressionManager';
export default class TextExpressionSelectorPropFactory {
    comp?: CompElementInterface;
    elem: ElementInterfaceIntersect;
    initiateExpression?: typeof ExpressionManager;
    k: boolean;
    kf?: boolean;
    lastValue: Vector3;
    mult: number;
    propType: string;
    pv: ShapePath | number;
    selectorValue: number;
    textIndex?: number;
    textTotal: number;
    v?: number;
    x: boolean;
    constructor(elem: ElementInterfaceIntersect, data: TextSelectorProperty);
    getMult(_index: number, _total: number): void;
    getValue(_val?: number): number;
    getValueAtTime(_frameNum: number): void;
    getValueProxy(index: number, total: number): number;
    getVelocityAtTime(_frameNum: number): void;
    setGroupProperty(_propertyGroup: any): void;
}
