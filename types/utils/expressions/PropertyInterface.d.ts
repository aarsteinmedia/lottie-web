import type { PropertyGroupFactory } from '../../utils/expressions/PropertyGroupFactory';
export declare class PropertyInterface {
    _name: string;
    propertyGroup: PropertyGroupFactory;
    constructor(propertyName: string, propertyGroup: PropertyGroupFactory);
    getInterface(val: number): any;
}
