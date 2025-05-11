import type { Caching, CompElementInterface, DocumentData, EffectFunction, ElementInterfaceIntersect, Keyframe, Shape, TextData, TextRangeValue, Vector2, Vector3, VectorProperty } from '../types';
import type LayerExpressionInterface from '../utils/expressions/LayerInterface';
import type Matrix from '../utils/Matrix';
import type ShapePath from '../utils/shapes/ShapePath';
import { type BezierData } from '../utils/Bezier';
import DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
export declare abstract class BaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    _cachingAtTime?: Caching;
    _isFirstFrame?: boolean;
    _placeholder?: boolean;
    comp?: CompElementInterface;
    data?: VectorProperty<number | number[] | Keyframe[]> | Shape | TextRangeValue | TextData;
    e?: ValueProperty | {
        v: number;
    };
    effectsSequence: EffectFunction[];
    elem?: ElementInterfaceIntersect;
    frameId?: number;
    g?: unknown;
    initFrame: number;
    k?: boolean;
    keyframes: Keyframe[];
    keyframesMetadata: {
        bezierData?: BezierData;
        __fnct?: ((val: number) => number) | ((val: number) => number)[];
    }[];
    kf?: boolean;
    lock?: boolean;
    mult?: number;
    offsetTime: number;
    propertyGroup?: LayerExpressionInterface;
    pv?: string | number | number[] | DocumentData | ShapePath;
    s?: ValueProperty | MultiDimensionalProperty<Vector3>;
    sh?: Shape;
    v?: string | number | number[] | Matrix | DocumentData;
    value?: number | number[];
    vel?: number | number[];
    addEffect(effectFunction: EffectFunction): void;
    getSpeedAtTime(_frameNum: number): void;
    getValueAtCurrentTime(): string | number | number[] | DocumentData | ShapePath | undefined;
    getValueAtTime(_a: number, _b?: number): number | number[];
    getVelocityAtTime(_frameNum: number): number;
    interpolateValue(frameNum: number, caching?: Caching): Vector3;
    processEffectsSequence(): void;
    setVValue(val?: number | number[] | Keyframe[]): void;
    valueAtTime(_a: number, _b?: number): void;
}
export declare class ValueProperty<T extends number | number[] = number> extends BaseProperty {
    pv: T;
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class MultiDimensionalProperty<T extends any[] = Vector2> extends BaseProperty {
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<T>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class KeyframedValueProperty extends BaseProperty {
    pv: number;
    v: number;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<Keyframe[]>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class KeyframedMultidimensionalProperty<T extends any[] = Vector2> extends BaseProperty {
    pv: T;
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<any[]>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class NoProperty extends BaseProperty {
    constructor();
}
