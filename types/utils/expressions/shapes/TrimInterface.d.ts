import type TrimModifier from '@/utils/shapes/modifiers/TrimModifier';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class TrimInterface extends BaseInterface {
    prop?: TrimModifier;
    get end(): any;
    get offset(): any;
    get start(): any;
    getInterface(val: string | number): any;
}
