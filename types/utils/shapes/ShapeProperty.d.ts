import type CVShapeElement from '../../elements/canvas/CVShapeElement';
import type HShapeElement from '../../elements/html/HShapeElement';
import type SVGShapeElement from '../../elements/svg/SVGShapeElement';
import type { Caching, CompElementInterface, ElementInterfaceIntersect, Keyframe, KeyframesMetadata, Shape, StrokeData } from '../../types';
import type PropertyInterface from '../../utils/expressions/PropertyInterface';
import type { MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
import type ShapeCollection from '../../utils/shapes/ShapeCollection';
import type ShapePath from '../../utils/shapes/ShapePath';
import type TextSelectorProperty from '../../utils/text/TextSelectorProperty';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
declare function getConstructorFunction(): typeof ShapeProperty;
declare function getKeyframedConstructorFunction(): typeof KeyframedShapeProperty;
declare function getShapeProp(elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number, _arr?: any[], _trims?: any[]): ShapeProperty | KeyframedShapeProperty | RectShapeProperty | EllShapeProperty | StarShapeProperty | null;
export declare abstract class ShapeBaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    _cachingAtTime?: Caching;
    comp?: CompElementInterface;
    data?: Shape;
    effectsSequence: ((arg: unknown) => ShapePath)[];
    elem?: SVGShapeElement | CVShapeElement | HShapeElement;
    frameId?: number;
    k?: boolean;
    keyframes: Keyframe[];
    keyframesMetadata: KeyframesMetadata[];
    kf?: boolean;
    localShapeCollection?: ShapeCollection;
    lock?: boolean;
    offsetTime: number;
    paths?: ShapePath[] | ShapeCollection;
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
    p: MultiDimensionalProperty;
    pt?: ValueProperty;
    r: ValueProperty;
    s: MultiDimensionalProperty;
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
    p: MultiDimensionalProperty;
    pt: ValueProperty;
    r: ValueProperty;
    s?: ValueProperty;
    constructor(elem: ElementInterfaceIntersect, data: Shape);
    convertPolygonToPath(): void;
    convertStarToPath(): void;
    convertToPath(): void;
    getValue(): void;
}
export declare class EllShapeProperty extends ShapeBaseProperty {
    _cPoint: number;
    d?: number;
    p: MultiDimensionalProperty;
    s: MultiDimensionalProperty;
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
    constructor(elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number);
    setGroupProperty(_propertyInterface: PropertyInterface): void;
}
export declare class KeyframedShapeProperty extends ShapeBaseProperty {
    lastFrame: number;
    constructor(elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number);
}
declare const ShapePropertyFactory: {
    getConstructorFunction: typeof getConstructorFunction;
    getKeyframedConstructorFunction: typeof getKeyframedConstructorFunction;
    getShapeProp: typeof getShapeProp;
};
export default ShapePropertyFactory;
