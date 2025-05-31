import type { ElementInterfaceIntersect, VectorProperty } from '../types';
import { KeyframedMultidimensionalProperty, KeyframedValueProperty, MultiDimensionalProperty, NoProperty, ValueProperty } from '../utils/Properties';
declare function getProp<T = number | number[]>(elem: ElementInterfaceIntersect, dataFromProps?: VectorProperty<T>, type?: number, mult?: null | number, container?: ElementInterfaceIntersect): ValueProperty<number> | KeyframedValueProperty | NoProperty | MultiDimensionalProperty<number[]> | KeyframedMultidimensionalProperty<import("../types").Vector2>;
declare const PropertyFactory: {
    getProp: typeof getProp;
};
export default PropertyFactory;
