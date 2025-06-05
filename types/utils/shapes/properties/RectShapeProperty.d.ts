import type { ElementInterfaceIntersect, Shape } from '../../../types';
import type { MultiDimensionalProperty, ValueProperty } from '../../../utils/Properties';
import ShapeBaseProperty from '../../../utils/shapes/properties/ShapeBaseProperty';
export default class RectShapeProperty extends ShapeBaseProperty {
    d?: number;
    ir?: ValueProperty;
    is?: ValueProperty;
    or?: ValueProperty;
    os?: ValueProperty;
    pt?: ValueProperty;
    r: ValueProperty;
    s: MultiDimensionalProperty;
    constructor(elem: ElementInterfaceIntersect, data: Shape);
    convertRectToPath(): void;
    getValue(): number;
}
