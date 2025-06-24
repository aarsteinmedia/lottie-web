import type CVShapeElement from '@/elements/canvas/CVShapeElement';
import type HShapeElement from '@/elements/html/HShapeElement';
import type SVGShapeElement from '@/elements/svg/SVGShapeElement';
import type { Shape } from '@/types';
declare function getConstructorFunction(): any;
declare function getKeyframedConstructorFunction(): any;
declare function getShapeProp(elem: SVGShapeElement | CVShapeElement | HShapeElement, data: Shape, type: number, _arr?: any[], _trims?: any[]): any;
declare const ShapePropertyFactory: {
    getConstructorFunction: typeof getConstructorFunction;
    getKeyframedConstructorFunction: typeof getKeyframedConstructorFunction;
    getShapeProp: typeof getShapeProp;
};
export default ShapePropertyFactory;
