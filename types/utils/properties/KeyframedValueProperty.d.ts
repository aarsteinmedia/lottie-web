import type { ElementInterfaceIntersect, Keyframe, VectorProperty } from '../../types';
import { BaseProperty } from '../../utils/properties/BaseProperty';
export declare class KeyframedValueProperty extends BaseProperty {
    pv: number | number[];
    selectorValue?: string;
    v: number;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<Keyframe[]>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
