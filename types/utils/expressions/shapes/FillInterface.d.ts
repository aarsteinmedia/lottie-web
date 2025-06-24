import type { Vector3 } from '@/types';
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty';
import type ValueProperty from '@/utils/properties/ValueProperty';
import BaseInterface from '@/utils/expressions/shapes/BaseInterface';
export default class FillInterface extends BaseInterface {
    c?: MultiDimensionalProperty<Vector3>;
    o?: ValueProperty;
    get color(): any;
    get opacity(): any;
    getInterface(val: string | number): any;
}
