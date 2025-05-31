import type { ElementInterfaceIntersect, Shape } from '../../types';
import type { ValueProperty } from '../../utils/Properties';
import type ShapePath from '../../utils/shapes/ShapePath';
import ShapeModifier from '../../utils/shapes/ShapeModifier';
export default class OffsetPathModifier extends ShapeModifier {
    amount?: ValueProperty;
    lineJoin?: number;
    miterLimit?: ValueProperty;
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processPath(inputBezier: ShapePath, amount: number, lineJoin: number, miterLimit: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
