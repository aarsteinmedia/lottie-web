import { BaseProperty } from '../../utils/Properties';
export default class ExpressionValue extends BaseProperty {
    numKeys: number;
    prop: BaseProperty;
    get velocity(): number;
    constructor(elementProp: BaseProperty, multFromProps?: number, type?: string);
    key(pos: number): number;
    speedAtTime(_frameNum: number): void;
    velocityAtTime(_frameNum: number): void;
}
