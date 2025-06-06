import type { ElementInterfaceIntersect, Shape } from '../../../types';
import type ValueProperty from '../../../utils/properties/ValueProperty';
import type ShapePath from '../../../utils/shapes/ShapePath';
import ShapeModifier from '../../../utils/shapes/modifiers/ShapeModifier';
export default class ZigZagModifier extends ShapeModifier {
    amplitude?: ValueProperty;
    frequency?: ValueProperty;
    pointsType?: ValueProperty;
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processPath(path: ShapePath, amplitude: number, frequency: number, pointType: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
