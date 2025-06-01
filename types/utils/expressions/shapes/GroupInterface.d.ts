import type ShapePathInterface from '../../../utils/expressions/shapes/ShapePathInterface';
import BaseInterface from '../../../utils/expressions/shapes/BaseInterface';
export default class GroupInterface extends BaseInterface {
    content?: (value: string | number) => ShapePathInterface | null;
    get _name(): string | undefined;
    getInterface(value: string | number): any;
}
