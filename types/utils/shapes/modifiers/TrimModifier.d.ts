import type { SVGShapeData } from '../../../elements/helpers/shapes/SVGShapeData';
import type { ElementInterfaceIntersect, Shape, Vector2 } from '../../../types';
import type { ValueProperty } from '../../../utils/properties/ValueProperty';
import type { ShapeCollection } from '../../../utils/shapes/ShapeCollection';
import type { ShapePath } from '../../../utils/shapes/ShapePath';
import { ShapeModifier } from '../../../utils/shapes/modifiers/ShapeModifier';
export declare class TrimModifier extends ShapeModifier {
    e?: ValueProperty;
    eValue?: number;
    m?: Shape['m'];
    o?: ValueProperty;
    s?: ValueProperty;
    sValue?: number;
    addPaths(newPaths: ShapePath[], localShapeCollection: ShapeCollection): void;
    addSegment(pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2, shapePath: ShapePath, pos: number, isNewShape?: boolean): void;
    addSegmentFromArray(points: number[], shapePath: ShapePath, pos: number, isNewShape?: boolean): void;
    addShapes(shapeData: SVGShapeData, shapeSegment: {
        e: number;
        s: number;
    }, shapePathFromProps?: ShapePath): ShapePath[];
    addShapeToModifier(shapeData: SVGShapeData): void;
    calculateShapeEdges(s: number, e: number, shapeLength: number, addedLength: number, totalModifierLength: number): number[][];
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processShapes(_isFirstFrame: boolean): void;
    releasePathsData(pathsData: ShapePath[]): ShapePath[];
}
