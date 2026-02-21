import type { ElementInterfaceIntersect, Shape, StrokeData } from '../../../types';
import type { ValueProperty } from '../../../utils/properties/ValueProperty';
import { ShapeBaseProperty } from '../../../utils/shapes/properties/ShapeBaseProperty';
export declare class StarShapeProperty extends ShapeBaseProperty {
    d?: StrokeData[];
    ir?: ValueProperty;
    is?: ValueProperty;
    or: ValueProperty;
    os: ValueProperty;
    pt: ValueProperty;
    r: ValueProperty;
    s?: ValueProperty;
    constructor(elem: ElementInterfaceIntersect, data: Shape);
    convertPolygonToPath(): void;
    convertStarToPath(): void;
    convertToPath(): void;
    getValue(_val?: unknown): number;
}
