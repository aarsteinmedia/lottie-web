import type SVGFillStyleData from '@/elements/helpers/shapes/SVGFillStyleData';
import type SVGTransformData from '@/elements/helpers/shapes/SVGTransformData';
import type { ShapeType } from '@/utils/enums';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class TransformInterface extends BaseInterface {
    prop?: SVGTransformData | SVGFillStyleData;
    ty?: ShapeType;
    get anchorPoint(): any;
    get opacity(): any;
    get position(): any;
    get rotation(): any;
    get scale(): any;
    get skew(): any;
    get skewAxis(): any;
    getInterface(value: string | number): any;
}
