import type { ElementInterfaceIntersect, VectorProperty } from '../types';
import { KeyframedMultidimensionalProperty, KeyframedValueProperty, MultiDimensionalProperty, NoProperty, ValueProperty } from '../utils/Properties';
declare function getProp(elem: ElementInterfaceIntersect, dataFromProps?: VectorProperty<number | number[]>, type?: number, mult?: null | number, container?: ElementInterfaceIntersect): ValueProperty<number> | MultiDimensionalProperty<number[]> | KeyframedValueProperty | KeyframedMultidimensionalProperty<import("../types").Vector2> | NoProperty;
declare const PropertyFactory: {
    getProp: typeof getProp;
};
export default PropertyFactory;
