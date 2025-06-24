import type SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class GradientFillInterface extends BaseInterface {
    prop?: SVGGradientFillStyleData;
    get endPoint(): any;
    get opacity(): any;
    get startPoint(): any;
    get type(): string;
    getInterface(val: string | number): any;
}
