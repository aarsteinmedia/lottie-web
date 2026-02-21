import type { ElementInterfaceIntersect, TextRangeValue } from '../../types';
import type { ValueProperty } from '../../utils/properties/ValueProperty';
import { BaseProperty } from '../../utils/properties/BaseProperty';
export declare class TextSelectorProperty extends BaseProperty {
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
    xe: ValueProperty;
    constructor(elem: ElementInterfaceIntersect, data: TextRangeValue);
    getMult(indFromProps: number, _val?: number): number | number[];
    getTextSelectorProp(_elem: ElementInterfaceIntersect, _data: TextRangeValue, _arr: unknown[]): void;
    getValue(newCharsFlag?: boolean): number;
}
