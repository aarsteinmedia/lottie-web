import type RectShapeProperty from '@/utils/shapes/properties/RectShapeProperty';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class RectInterface extends BaseInterface {
    prop?: RectShapeProperty;
    get position(): any;
    get roundness(): any;
    get size(): any;
    getInterface(value: string | number): any;
}
