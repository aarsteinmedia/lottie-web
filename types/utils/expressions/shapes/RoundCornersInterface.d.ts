import type RoundCornersModifier from '@/utils/shapes/modifiers/RoundCornersModifier';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class RoundCornersInterface extends BaseInterface {
    prop?: RoundCornersModifier;
    get radius(): any;
    getInterface(value: string | number): any;
}
