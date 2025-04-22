import type SVGShapeData from '../../../elements/helpers/shapes/SVGShapeData';
import { Shape } from '../../../types';
import { ShapeProperty } from '../../../utils/shapes/ShapeProperty';
export default class ShapePathInterface {
    _name?: string;
    _propertyGroup: (val?: number) => any;
    ind?: number;
    ix?: number;
    mn?: string;
    path: ShapeProperty;
    prop: ShapeProperty;
    propertyGroup?: unknown;
    propertyIndex?: number;
    shape: ShapeProperty;
    constructor(shape: Shape, view: SVGShapeData, propertyGroup: unknown);
    interfaceFunction(val: string | number): ShapeProperty | null;
}
