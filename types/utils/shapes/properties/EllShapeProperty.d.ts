import type { ElementInterfaceIntersect, Shape } from '../../../types';
import type { MultiDimensionalProperty } from '../../../utils/Properties';
import ShapeBaseProperty from '../../../utils/shapes/properties/ShapeBaseProperty';
export default class EllShapeProperty extends ShapeBaseProperty {
    _cPoint: number;
    d?: number;
    s: MultiDimensionalProperty;
    constructor(elem: ElementInterfaceIntersect, data: Shape);
    convertEllToPath(): void;
    getValue(_flag?: boolean): number;
}
