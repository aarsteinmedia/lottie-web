import type { Caching, ElementInterfaceIntersect, Keyframe, KeyframesMetadata, Shape, Vector2 } from '../../types';
import type { MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
import type ShapeCollection from '../../utils/shapes/ShapeCollection';
import ShapeElement from '../../elements/ShapeElement';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import ShapePath from '../../utils/shapes/ShapePath';
export declare function getConstructorFunction(): typeof ShapeProperty;
export declare function getKeyframedConstructorFunction(): typeof KeyframedShapeProperty;
export declare function getShapeProp(elem: ShapeElement, data: Shape, type: number): null | ShapeProperty;
declare abstract class ShapeBaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    comp?: ElementInterfaceIntersect;
    data?: Shape;
    effectsSequence: ((arg: unknown) => ShapePath)[];
    elem?: ShapeElement;
    frameId?: number;
    k?: boolean;
    keyframes: Keyframe[];
    keyframesMetadata: KeyframesMetadata[];
    kf?: boolean;
    localShapeCollection?: ShapeCollection;
    lock?: boolean;
    offsetTime: number;
    paths?: ShapeCollection;
    pv?: ShapePath;
    v?: ShapePath;
    interpolateShape(frameNum: number, previousValue: ShapePath, caching?: Caching): void;
    interpolateShapeCurrentTime(): ShapePath;
    processEffectsSequence(): void;
    reset(): void;
    setVValue(newPath?: ShapePath): void;
    shapesEqual(shape1: ShapePath, shape2: ShapePath): boolean;
}
export declare class RectShapeProperty extends ShapeBaseProperty {
    d?: number;
    ir?: ValueProperty;
    is?: ValueProperty;
    or?: ValueProperty;
    os?: ValueProperty;
    p: MultiDimensionalProperty<Vector2>;
    pt?: ValueProperty;
    r: ValueProperty;
    s: MultiDimensionalProperty<Vector2>;
    constructor(elem: ElementInterfaceIntersect, data: Shape);
    convertRectToPath(): void;
    getValue(): void;
}
export declare class ShapeProperty extends ShapeBaseProperty {
    pathsData?: ShapePath[] | ShapePath;
    shape?: {
        _mdf?: boolean;
        paths?: {
            shapes: ShapePath[];
            _length: number;
        };
    };
    totalShapeLength?: number;
    constructor(elem: ShapeElement, data: Shape, type: number);
}
declare class KeyframedShapeProperty extends ShapeBaseProperty {
    lastFrame: number;
    constructor(elem: ShapeElement, data: Shape, type: number);
}
export {};
