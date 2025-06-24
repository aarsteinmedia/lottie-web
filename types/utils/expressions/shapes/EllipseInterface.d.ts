import type EllShapeProperty from '@/utils/shapes/properties/EllShapeProperty';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class EllipseInterface extends BaseInterface {
    prop?: EllShapeProperty;
    get position(): any;
    get size(): any;
    getInterface(value: string | number): any;
}
