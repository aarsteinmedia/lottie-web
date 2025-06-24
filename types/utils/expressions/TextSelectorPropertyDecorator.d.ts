import type { ElementInterfaceIntersect, ExpressionProperty, TextRangeValue, Vector3 } from '@/types';
import type KeyframedValueProperty from '@/utils/properties/KeyframedValueProperty';
import BaseProperty from '@/utils/properties/BaseProperty';
export default class TextExpressionSelectorPropFactory extends BaseProperty {
    lastValue: Vector3;
    selectorValue: number;
    constructor(elem: ElementInterfaceIntersect, data: TextRangeValue & ExpressionProperty, _arr?: unknown[]);
    getMult(_index: number, _total: number): void;
    getTextSelectorProp(_elem: ElementInterfaceIntersect, _data: TextRangeValue, _arr: unknown[]): KeyframedValueProperty;
    getValueProxy(index: number, total: number): any;
}
