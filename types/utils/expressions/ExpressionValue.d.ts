import { BaseProperty } from '../../utils/Properties';
export default class ExpressionValue extends BaseProperty {
    prop: BaseProperty;
    get velocity(): number;
    constructor(elementProp: BaseProperty, multFromProps?: number, type?: string);
    key(pos: number): number;
}
