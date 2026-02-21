import { BaseProperty } from '../../utils/properties/BaseProperty';
export declare class ExpressionValue extends BaseProperty {
    prop: BaseProperty;
    get velocity(): number | number[];
    constructor(elementProp: BaseProperty, multFromProps?: number, type?: string);
    key(pos: number): number;
}
