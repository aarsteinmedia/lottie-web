import type { ShapeData } from '../../../elements/helpers/shapes/ShapeData';
import type { Shape } from '../../../types';
import type { LayerExpressionInterface } from '../../../utils/expressions/LayerInterface';
import type { ShapeProperty } from '../../../utils/shapes/properties/ShapeProperty';
export declare class ShapePathInterface {
    _name?: undefined | string;
    ind?: undefined | number;
    ix?: undefined | number;
    mn?: undefined | string;
    prop: null | ShapeProperty;
    propertyGroup: LayerExpressionInterface;
    propertyIndex?: undefined | number;
    get path(): ShapeProperty | null;
    get shape(): ShapeProperty | null;
    constructor(shape: Shape, view: ShapeData, propertyGroup: LayerExpressionInterface);
    getInterface(val: string | number): ShapeProperty | null;
}
