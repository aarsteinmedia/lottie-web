import type { ElementInterfaceIntersect, TextRangeValue } from '../../types';
import { BaseProperty, ValueProperty } from '../../utils/Properties';
export default class TextSelectorProperty extends BaseProperty {
    _currentTextLength: number;
    a: ValueProperty;
    b?: ValueProperty;
    data: TextRangeValue;
    e: ValueProperty | {
        v: number;
    };
    elem: ElementInterfaceIntersect;
    finalE: number;
    finalS: number;
    ne: ValueProperty;
    o: ValueProperty;
    rn?: number;
    sm: ValueProperty;
    totalChars?: number;
    x?: boolean;
    xe: ValueProperty;
    constructor(elem: ElementInterfaceIntersect, data: TextRangeValue);
    getMult(indFromProps: number, _val?: number): number | number[];
    getValue(newCharsFlag?: boolean): void;
    initiateExpression(): void;
}
