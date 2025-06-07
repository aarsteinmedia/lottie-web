import type { ElementInterfaceIntersect, Keyframe, Vector2, VectorProperty } from '@/types';
import BaseProperty from '@/utils/properties/BaseProperty';
export default class KeyframedMultidimensionalProperty<T extends number[] = Vector2> extends BaseProperty {
    pv: T;
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<Keyframe[]>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
