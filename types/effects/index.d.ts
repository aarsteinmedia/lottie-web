import type { GroupEffect } from '../effects/GroupEffect';
import type { EffectValue, ElementInterfaceIntersect } from '../types';
import type { ValueProperty } from '../utils/properties/ValueProperty';
declare abstract class EffectZero {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: ElementInterfaceIntersect, container: GroupEffect);
}
declare abstract class EffectOne {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: ElementInterfaceIntersect, container: GroupEffect);
}
export declare class SliderEffect extends EffectZero {
}
export declare class AngleEffect extends EffectZero {
}
export declare class ColorEffect extends EffectOne {
}
export declare class PointEffect extends EffectOne {
}
export declare class LayerIndexEffect extends EffectZero {
}
export declare class MaskIndexEffect extends EffectZero {
}
export declare class CheckboxEffect extends EffectZero {
}
export declare class NoValueEffect {
    p: object;
    constructor();
}
export {};
