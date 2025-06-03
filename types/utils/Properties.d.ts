import type { Caching, CompElementInterface, DocumentData, EffectFunction, ElementInterfaceIntersect, ExpressionProperty, Keyframe, KeyframesMetadata, Shape, Vector2, Vector3, VectorProperty } from '../types';
import type LayerExpressionInterface from '../utils/expressions/LayerInterface';
import type Matrix from '../utils/Matrix';
import type ShapePath from '../utils/shapes/ShapePath';
import DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
export declare abstract class BaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    _cachingAtTime?: Caching;
    _isFirstFrame?: boolean;
    _name?: string;
    _placeholder?: boolean;
    comp?: CompElementInterface;
    e?: ValueProperty | {
        v: number;
    };
    effectsSequence: EffectFunction[];
    elem?: ElementInterfaceIntersect;
    frameExpressionId?: number;
    frameId?: number;
    g?: unknown;
    initFrame: number;
    k?: boolean;
    keyframesMetadata: KeyframesMetadata[];
    kf?: boolean | null;
    lock?: boolean;
    loopIn?: (type: string, duration: number, durationFlag?: boolean) => void;
    loopOut?: (type: string, duration: number, durationFlag?: boolean) => void;
    mult?: number;
    numKeys?: number;
    offsetTime: number;
    propertyGroup?: LayerExpressionInterface;
    pv?: string | number | number[] | DocumentData | ShapePath;
    s?: ValueProperty | MultiDimensionalProperty<Vector3>;
    sh?: Shape;
    smooth?: (width: number, samples: number) => void;
    textIndex?: number;
    textTotal?: number;
    v?: string | number | number[] | Matrix | DocumentData | ShapePath;
    value?: number | number[];
    vel?: number | number[];
    x?: boolean;
    addEffect(effectFunction: EffectFunction): void;
    getSpeedAtTime(_frameNum: number): void;
    getValueAtCurrentTime(): string | number | number[] | ShapePath | DocumentData | undefined;
    getValueAtTime(_val1?: unknown, _val2?: unknown): unknown;
    getVelocityAtTime(_frameNum: number): number | number[];
    initiateExpression(_elem: ElementInterfaceIntersect, _data: ExpressionProperty, _property: KeyframedValueProperty): EffectFunction;
    interpolateValue(frameNum: number, caching?: Caching): Vector3;
    processEffectsSequence(): number;
    setVValue(val?: number | number[] | Keyframe[] | ShapePath): void;
    speedAtTime(_frameNum: number): void;
    valueAtTime(_a: number, _b?: number): void;
    velocityAtTime(_frameNum: number): void;
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
    pv: number | number[];
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
