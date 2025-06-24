import type SVGStrokeStyleData from '@/elements/helpers/shapes/SVGStrokeStyleData';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class StrokeInterface extends BaseInterface {
    dashOb?: Record<PropertyKey, unknown>;
    prop?: SVGStrokeStyleData;
    get color(): any;
    get dash(): Record<PropertyKey, unknown> | undefined;
    get opacity(): any;
    get strokeWidth(): any;
    getInterface(val: string | number): any;
}
