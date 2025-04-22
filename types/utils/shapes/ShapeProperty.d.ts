import type { Caching, CompElementInterface, ElementInterfaceIntersect, Keyframe, KeyframesMetadata, Shape, StrokeData, Vector2 } from '../../types';
import type PropertyInterface from '../../utils/expressions/PropertyInterface';
import type { MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
import type ShapeCollection from '../../utils/shapes/ShapeCollection';
import type TextSelectorProperty from '../../utils/text/TextSelectorProperty';
import ShapeElement from '../../elements/helpers/shapes/ShapeElement';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import ShapePath from '../../utils/shapes/ShapePath';
declare function getConstructorFunction(): typeof ShapeProperty;
declare function getKeyframedConstructorFunction(): typeof KeyframedShapeProperty;
declare function getShapeProp(elem: ShapeElement, data: Shape, type: number, _arr?: any[], _trims?: any[]): ShapeProperty | KeyframedShapeProperty | RectShapeProperty | EllShapeProperty | StarShapeProperty | null;
export declare abstract class ShapeBaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    _cachingAtTime?: Caching;
    comp?: CompElementInterface;
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
    getValueAtTime(_frameNumFromProps: number, _num?: number): ShapePath;
    initiateExpression(_elem: ElementInterfaceIntersect, _data: TextSelectorProperty, _property: TextSelectorProperty): void;
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
export declare class StarShapeProperty extends ShapeBaseProperty {
    d?: StrokeData[];
    ir?: ValueProperty;
    is?: ValueProperty;
    or: ValueProperty;
    os: ValueProperty;
    p: MultiDimensionalProperty<Vector2>;
    pt: ValueProperty;
    r: ValueProperty;
    s?: ValueProperty;
    constructor(elem: ElementInterfaceIntersect, data: any);
    convertPolygonToPath(): void;
    convertStarToPath(): void;
    convertToPath(): void;
    getValue(): void;
}
export declare class EllShapeProperty extends ShapeBaseProperty {
    _cPoint: number;
    d?: number;
    p: MultiDimensionalProperty<Vector2>;
    s: MultiDimensionalProperty<Vector2>;
    constructor(elem: ElementInterfaceIntersect, data: Shape);
    convertEllToPath(): void;
    getValue(): void;
}
export declare class ShapeProperty extends ShapeBaseProperty {
    ix?: number;
    pathsData?: ShapePath[] | ShapePath;
    propertyIndex?: number;
    shape?: {
        _mdf?: boolean;
        paths?: {
            shapes: ShapePath[];
            _length: number;
        };
    };
    totalShapeLength?: number;
    x?: boolean;
    constructor(elem: ShapeElement, data: Shape, type: number);
    setGroupProperty(_propertyInterface: PropertyInterface): void;
}
export declare class KeyframedShapeProperty extends ShapeBaseProperty {
    lastFrame: number;
    constructor(elem: ShapeElement, data: Shape, type: number);
}
declare const ShapePropertyFactory: {
    getConstructorFunction: typeof getConstructorFunction;
    getKeyframedConstructorFunction: typeof getKeyframedConstructorFunction;
    getShapeProp: typeof getShapeProp;
};
export default ShapePropertyFactory;
