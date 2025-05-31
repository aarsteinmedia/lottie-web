import type ShapeData from '../../../elements/helpers/shapes/ShapeData';
import type { Shape } from '../../../types';
import type LayerExpressionInterface from '../../../utils/expressions/LayerInterface';
import type { ShapeProperty } from '../../../utils/shapes/ShapeProperty';
export default class ShapePathInterface {
    _name?: string;
    ind?: number;
    ix?: number;
    mn?: string;
    prop: null | ShapeProperty;
    propertyGroup: LayerExpressionInterface;
    propertyIndex?: number;
    get path(): ShapeProperty | null;
    get shape(): ShapeProperty | null;
    constructor(shape: Shape, view: ShapeData, propertyGroup: LayerExpressionInterface);
    getInterface(val: string | number): ShapeProperty | null;
}
