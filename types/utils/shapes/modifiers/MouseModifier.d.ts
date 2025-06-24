import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData';
import type { ElementInterfaceIntersect, Shape, Vector2 } from '@/types';
import ShapeModifier from '@/utils/shapes/modifiers/ShapeModifier';
export default class MouseModifier extends ShapeModifier {
    data?: Shape | Shape[];
    positions: unknown[];
    addShapeToModifier(_shapeData: SVGShapeData): void;
    initModifierProperties(_elem: ElementInterfaceIntersect, data: Shape | Shape[]): void;
    processKeys(forceRender?: boolean): number;
    processPath(path: {
        v: Vector2[];
        o: Vector2[];
        i: Vector2[];
        c: Vector2[];
    }, mouseCoords: Vector2, positions: {
        v: Vector2[];
        o: Vector2[];
        i: Vector2[];
        distV: number[];
        distO: number[];
        distI: number[];
    }): {
        c: Vector2[];
        i: any[];
        o: any[];
        v: any[];
    };
    processShapes(): void;
}
