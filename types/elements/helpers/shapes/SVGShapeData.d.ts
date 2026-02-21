import type { Transformer } from '../../../types';
import type { ShapeProperty } from '../../../utils/shapes/properties/ShapeProperty';
import { ShapeData } from '../../../elements/helpers/shapes/ShapeData';
export declare class SVGShapeData extends ShapeData {
    constructor(transformers: Transformer[], level: number, shape: ShapeProperty);
}
