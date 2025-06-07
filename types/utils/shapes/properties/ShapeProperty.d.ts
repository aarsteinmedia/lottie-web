import type CVShapeElement from '@/elements/canvas/CVShapeElement';
import type HShapeElement from '@/elements/html/HShapeElement';
import type SVGShapeElement from '@/elements/svg/SVGShapeElement';
import type { Shape } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
import ShapeBaseProperty from '@/utils/shapes/properties/ShapeBaseProperty';
export declare class ShapeProperty extends ShapeBaseProperty {
    ix?: number;
    pathsData?: ShapePath[] | ShapePath;
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
}
export declare class KeyframedShapeProperty extends ShapeBaseProperty {
    lastFrame: number;
    constructor(elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number);
}
