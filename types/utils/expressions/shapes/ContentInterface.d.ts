import type ShapePathInterface from '../../../utils/expressions/shapes/ShapePathInterface';
import BaseInterface from '../../../utils/expressions/shapes/BaseInterface';
export default class ContentInterface extends BaseInterface {
    interfaces: ShapePathInterface[];
    getInterface(value: string | number): ShapePathInterface | null;
}
