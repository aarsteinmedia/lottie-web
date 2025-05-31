import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
import type PropertyGroupFactory from '../PropertyGroupFactory';
import type ShapePathInterface from './ShapePathInterface';
export default class GroupInterface extends BaseInterface {
    content?: (value: string | number) => ShapePathInterface | null;
    propertyGroup?: PropertyGroupFactory;
    get _name(): string | undefined;
    getInterface(value: string | number): any;
}
