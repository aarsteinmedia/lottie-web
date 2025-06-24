import type RepeaterModifier from '@/utils/shapes/modifiers/RepeaterModifier';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class RepeaterInterface extends BaseInterface {
    prop?: RepeaterModifier;
    get copies(): any;
    get offset(): any;
    getInterface(value: string | number): any;
}
