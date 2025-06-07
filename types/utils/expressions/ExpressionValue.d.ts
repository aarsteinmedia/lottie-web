import BaseProperty from '@/utils/properties/BaseProperty';
export default class ExpressionValue extends BaseProperty {
    prop: BaseProperty;
    get velocity(): number | number[];
    constructor(elementProp: BaseProperty, multFromProps?: number, type?: string);
    key(pos: number): number;
}
