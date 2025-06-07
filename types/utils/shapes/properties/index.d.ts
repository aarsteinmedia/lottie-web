import type CVShapeElement from '../../../elements/canvas/CVShapeElement';
import type HShapeElement from '../../../elements/html/HShapeElement';
import type SVGShapeElement from '../../../elements/svg/SVGShapeElement';
import type { Shape } from '../../../types';
import EllShapeProperty from '../../../utils/shapes/properties/EllShapeProperty';
import RectShapeProperty from '../../../utils/shapes/properties/RectShapeProperty';
import { KeyframedShapeProperty, ShapeProperty } from '../../../utils/shapes/properties/ShapeProperty';
import StarShapeProperty from '../../../utils/shapes/properties/StarShapeProperty';
declare function getConstructorFunction(): typeof ShapeProperty;
declare function getKeyframedConstructorFunction(): typeof KeyframedShapeProperty;
declare function getShapeProp(elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number, _arr?: any[], _trims?: any[]): ShapeProperty | KeyframedShapeProperty | RectShapeProperty | EllShapeProperty | StarShapeProperty | null;
declare const ShapePropertyFactory: {
    getConstructorFunction: typeof getConstructorFunction;
    getKeyframedConstructorFunction: typeof getKeyframedConstructorFunction;
    getShapeProp: typeof getShapeProp;
};
export default ShapePropertyFactory;
