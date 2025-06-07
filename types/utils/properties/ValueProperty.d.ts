import type { ElementInterfaceIntersect, VectorProperty } from '../../types';
import BaseProperty from '../../utils/properties/BaseProperty';
export default class ValueProperty<T extends number | number[] = number> extends BaseProperty {
    pv: T;
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
