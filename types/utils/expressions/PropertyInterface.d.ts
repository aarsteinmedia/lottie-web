import type PropertyGroupFactory from '../../utils/expressions/PropertyGroupFactory';
export default class PropertyInterface {
    _name: string;
    propertyGroup: PropertyGroupFactory;
    constructor(propertyName: string, propertyGroup: PropertyGroupFactory);
    getInterface(val: number): any;
}
