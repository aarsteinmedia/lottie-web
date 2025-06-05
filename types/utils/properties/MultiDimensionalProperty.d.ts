import type { ElementInterfaceIntersect, Vector2, VectorProperty } from '../../types';
import BaseProperty from '../../utils/properties/BaseProperty';
export default class MultiDimensionalProperty<T extends number[] = Vector2> extends BaseProperty {
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<T>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
